import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { createAlbumSchema, type SelectionInput } from "./contracts";
import type { Album, PhotographerProfile } from "@/types";
import {
  api,
  ApiError,
  emptyProfile,
  errorMessage,
  messages,
  setCsrf,
  type Page,
} from "./api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000,
      retry: (count, error) =>
        !(error instanceof ApiError && error.status < 500) && count < 2,
    },
    mutations: { retry: false, networkMode: "always" },
  },
});
const processing = (status?: string) =>
  status === "scanning" || status === "importing";
const ownerKey = ["owner"] as const;
const albumsKey = ["albums", "owner"] as const;

function useApiController() {
  const client = useQueryClient();
  const [guestShare] = useState(
    () =>
      location.pathname.match(/^\/album\/([a-zA-Z0-9_-]+)\/?$/)?.[1] ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [hiddenAlbumIds, setHiddenAlbumIds] = useState<Set<string>>(
    () => new Set(),
  );
  const report = (error: unknown) => setError(errorMessage(error));
  const [target, setTarget] = useState<{ id: string; status: string } | null>(
    null,
  );
  const [filters, setFilters] = useState<
    Record<string, { selected: boolean; search: string }>
  >({});
  const owner = useQuery({
    queryKey: ownerKey,
    enabled: !guestShare,
    queryFn: async ({ signal }) => {
      try {
        const me = await api<{
          profile: PhotographerProfile;
          csrfToken: string;
        }>("/me", "GET", undefined, signal);
        setCsrf(me.csrfToken);
        return me.profile;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          setCsrf("");
          return null;
        }
        throw error;
      }
    },
  });
  const albumsQuery = useQuery({
    queryKey: albumsKey,
    enabled: !guestShare && !!owner.data?.id,
    queryFn: async ({ signal }) => {
      const result = await api<{ albums: Album[] }>(
        "/albums",
        "GET",
        undefined,
        signal,
      );
      return result.albums
        .filter((album) => !["deleting", "deleted"].includes(album.status))
        .map((a) => ({
          ...a,
          errorMessage: a.errorMessage
            ? (messages[a.errorMessage] ?? a.errorMessage)
            : undefined,
        }));
    },
    refetchInterval: (query) =>
      query.state.data?.some((a) => processing(a.status)) ? 5000 : false,
  });
  const guestKey = ["guest", guestShare] as const;
  const guest = useQuery({
    queryKey: guestKey,
    enabled: !!guestShare,
    queryFn: async ({ signal }) => {
      const metadata = await api<{ title: string; shareId: string }>(
        `/public/albums/${guestShare}`,
        "GET",
        undefined,
        signal,
      );
      return {
        ...metadata,
        id: guestShare!,
        status: "ready",
        coverUrl: "",
        totalPhotos: 0,
        importedPhotos: 0,
        selectedPhotosCount: 0,
        guestSessionCount: 0,
        folderUrl: "",
        folderId: "",
        createdAt: "",
        expiresAt: null,
      } as Album;
    },
  });
  const id = guestShare ?? target?.id ?? "";
  const filter = filters[id] ?? { selected: false, search: "" };
  const photoKey = [
    "photos",
    guestShare ? "guest" : "owner",
    id,
    filter,
  ] as const;
  const base = (albumId: string) =>
    guestShare ? `/public/albums/${guestShare}` : `/albums/${albumId}`;
  const photosQuery = useInfiniteQuery({
    queryKey: photoKey,
    enabled: guestShare ? !!guest.data : !!target && !!owner.data?.id,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set("cursor", pageParam);
      if (filter.selected) params.set("selected", "true");
      if (filter.search) params.set("search", filter.search);
      return api<Page>(
        `${base(id)}/photos?${params}`,
        "GET",
        undefined,
        signal,
      );
    },
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    refetchInterval: (query) =>
      processing(
        query.state.data?.pages.slice(-1)[0]?.album.status ?? target?.status,
      )
        ? 2000
        : false,
  });
  const hasGuestData =
    !!guestShare &&
    client
      .getQueriesData<
        InfiniteData<Page>
      >({ queryKey: ["photos", "guest", guestShare] })
      .some(([, data]) => !!data);
  const cachedGuestAlbum = guestShare
    ? client
        .getQueriesData<InfiniteData<Page>>({
          queryKey: ["photos", "guest", guestShare],
        })
        .map(([, data]) => data?.pages.slice(-1)[0]?.album)
        .find(Boolean)
    : undefined;
  const photoAlbum =
    photosQuery.data?.pages.slice(-1)[0]?.album ?? cachedGuestAlbum;
  const albums = guestShare
    ? guest.data
      ? [{ ...guest.data, ...photoAlbum }]
      : []
    : (albumsQuery.data ?? [])
        .filter((album) => !hiddenAlbumIds.has(album.id))
        .map((a) =>
          a.id === id && photoAlbum ? { ...a, ...photoAlbum } : a,
        );
  const photos = [
    ...new Map(
      photosQuery.data?.pages.flatMap((p) => p.photos).map((p) => [p.id, p]) ??
        [],
    ).values(),
  ];
  useEffect(() => {
    const error =
      owner.error ?? albumsQuery.error ?? guest.error ?? photosQuery.error;
    if (
      error &&
      !(guestShare && error instanceof ApiError && error.status === 401)
    )
      report(error);
  }, [
    owner.error,
    albumsQuery.error,
    guest.error,
    photosQuery.error,
    guestShare,
  ]);
  const refreshOwner = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: ownerKey }),
      client.invalidateQueries({ queryKey: albumsKey }),
    ]);
  };
  const albumMutation = useMutation({
    mutationFn: async (input: {
      path: string;
      method: string;
      body?: unknown;
    }) => api<Album>(input.path, input.method, input.body),
    onSuccess: async () => {
      await refreshOwner();
      await client.invalidateQueries({ queryKey: ["photos", "owner"] });
    },
  });
  const deleteAlbumMutation = useMutation({
    mutationFn: (id: string) =>
      api<{ ok: boolean }>(`/albums/${id}`, "DELETE"),
    onMutate: async (id) => {
      setHiddenAlbumIds((current) => new Set(current).add(id));
      await Promise.all([
        client.cancelQueries({ queryKey: albumsKey }),
        client.cancelQueries({ queryKey: ownerKey }),
      ]);

      let removedAlbum: Album | undefined;
      let removedIndex = -1;
      client.setQueryData<Album[]>(albumsKey, (current) => {
        if (!current) return current;
        removedIndex = current.findIndex((album) => album.id === id);
        if (removedIndex === -1) return current;
        removedAlbum = current[removedIndex];
        return current.filter((album) => album.id !== id);
      });

      const countedAsActive =
        removedAlbum !== undefined &&
        !["expired", "deleting", "deleted"].includes(removedAlbum.status);
      if (countedAsActive) {
        client.setQueryData<PhotographerProfile | null>(ownerKey, (current) =>
          current
            ? {
                ...current,
                activeAlbumsCount: Math.max(0, current.activeAlbumsCount - 1),
              }
            : current,
        );
      }

      return { removedAlbum, removedIndex, countedAsActive };
    },
    onError: (_error, _id, context) => {
      setHiddenAlbumIds((current) => {
        const next = new Set(current);
        next.delete(_id);
        return next;
      });
      if (!context?.removedAlbum) return;
      const albumToRestore = context.removedAlbum;
      client.setQueryData<Album[]>(albumsKey, (current = []) => {
        if (current.some((album) => album.id === albumToRestore.id))
          return current;
        const next = [...current];
        next.splice(
          Math.min(Math.max(context.removedIndex, 0), next.length),
          0,
          albumToRestore,
        );
        return next;
      });
      if (context.countedAsActive) {
        client.setQueryData<PhotographerProfile | null>(ownerKey, (current) =>
          current
            ? {
                ...current,
                activeAlbumsCount: Math.min(
                  current.maxAlbumsLimit,
                  current.activeAlbumsCount + 1,
                ),
              }
            : current,
        );
      }
    },
    onSuccess: async (_result, id) => {
      client.removeQueries({ queryKey: ["photos", "owner", id] });
      await client.invalidateQueries({ queryKey: ownerKey });
    },
  });
  const verification = useMutation({
    mutationFn: async ({
      share,
      password,
    }: {
      share: string;
      password: string;
    }) => {
      await api(`/public/albums/${share}/session`, "POST", { password });
      const result = await photosQuery.refetch();
      if (result.error) throw result.error;
    },
  });
  const selection = useMutation({
    mutationKey: ["selection"],
    mutationFn: async (input: {
      id: string;
      photoId: string;
      selected: boolean;
    }) => {
      const body: SelectionInput = {
        selected: input.selected,
        clientMutationId: crypto.randomUUID(),
      };
      const result = await api<{ selected: boolean; clientMutationId: string }>(
        `${base(input.id)}/photos/${input.photoId}/selection`,
        "PUT",
        body,
      );
      if (result.clientMutationId !== body.clientMutationId)
        throw new Error("Phản hồi lưu ảnh không hợp lệ");
      return result;
    },
    onSuccess: async (result, input) => {
      const prefix = [
        "photos",
        guestShare ? "guest" : "owner",
        guestShare ?? input.id,
      ];
      await client.cancelQueries({ queryKey: prefix });
      client.setQueriesData<InfiniteData<Page>>(
        { queryKey: prefix },
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              photos: page.photos.map((p) =>
                p.id === input.photoId
                  ? { ...p, isSelected: result.selected }
                  : p,
              ),
            })),
          },
      );
      await Promise.all([
        client.invalidateQueries({ queryKey: prefix }),
        ...(!guestShare
          ? [client.invalidateQueries({ queryKey: albumsKey })]
          : []),
      ]);
    },
  });
  // Per-photo feedback stays shared between the gallery and lightbox.
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [failures, setFailures] = useState<Record<string, boolean>>({});
  const toggleHeart = async (
    albumId: string,
    photoId: string,
    selected: boolean,
  ) => {
    if (
      client
        .getMutationCache()
        .findAll({ mutationKey: ["selection"], status: "pending" })
        .some(
          (m) =>
            (m.state.variables as { photoId?: string })?.photoId === photoId,
        )
    )
      return false;
    setSaving((old) => ({ ...old, [photoId]: true }));
    setFailures((old) => {
      const next = { ...old };
      delete next[photoId];
      return next;
    });
    try {
      await selection.mutateAsync({ id: albumId, photoId, selected });
      return true;
    } catch (error) {
      setFailures((old) => ({ ...old, [photoId]: selected }));
      report(error);
      return false;
    } finally {
      setSaving((old) => ({ ...old, [photoId]: false }));
    }
  };
  const logout = useMutation({
    mutationFn: () => api("/auth/logout", "POST"),
    onSuccess: () => {
      setCsrf("");
      client.clear();
    },
  });
  return {
    authConfig: () =>
      client.fetchQuery({
        queryKey: ["auth-config"],
        queryFn: ({ signal }) =>
          api<{ googleLoginEnabled: boolean }>(
            "/auth/config",
            "GET",
            undefined,
            signal,
          ),
      }),
    logout: () => logout.mutateAsync(),
    error,
    report,
    clearError: () => setError(null),
    pending: {
      owner: !guestShare && owner.isPending,
      albums:
        !guestShare && !!owner.data?.id && albumsQuery.isPending,
      guest:
        !!guestShare &&
        (guest.isPending ||
          (guest.isSuccess && !hasGuestData && photosQuery.isPending)),
    },
    getProfile: () => owner.data ?? emptyProfile,
    getAlbums: () => albums,
    getPhotos: (albumId: string) =>
      albumId === id || albumId === photoAlbum?.id ? photos : [],
    isGuestVerified: (_share: string) =>
      hasGuestData &&
      !(
        photosQuery.error instanceof ApiError &&
        photosQuery.error.status === 401
      ),
    setPhotoTarget: setTarget,
    filterPhotos: async (albumId: string, selected: boolean, search = "") => {
      const id = guestShare ?? albumId;
      setFilters((old) =>
        old[id]?.selected === selected && old[id]?.search === search
          ? old
          : { ...old, [id]: { selected, search } },
      );
    },
    hasMore: (_albumId: string) => !!photosQuery.hasNextPage,
    loadPhotos: async (_albumId: string) => {
      const result = await photosQuery.fetchNextPage({ cancelRefetch: false });
      if (result.error) throw result.error;
    },
    isPending: (photoId: string) => !!saving[photoId],
    isFailed: (photoId: string) => photoId in failures,
    toggleHeart,
    retryHeart: (albumId: string, photoId: string) =>
      photoId in failures
        ? toggleHeart(albumId, photoId, failures[photoId])
        : Promise.resolve(true),
    verifyGuestPasscode: (share: string, password: string) =>
      verification.mutateAsync({ share, password }),
    createAlbum: async (data: {
      name: string;
      folderUrl: string;
      passcode: string;
    }) => {
      try {
        const album = await albumMutation.mutateAsync({
          path: "/albums",
          method: "POST",
          body: createAlbumSchema.parse({
            name: data.name,
            folderUrl: data.folderUrl,
            password: data.passcode,
          }),
        });
        return { success: true, album };
      } catch (error) {
        return { success: false, error: errorMessage(error) };
      }
    },
    retryAlbum: (id: string) =>
      albumMutation.mutateAsync({
        path: `/albums/${id}/retry`,
        method: "POST",
      }),
    deleteAlbum: async (id: string) => {
      await deleteAlbumMutation.mutateAsync(id);
    },
    updateAlbumPasscode: (id: string, password: string) =>
      albumMutation.mutateAsync({
        path: `/albums/${id}/password`,
        method: "PUT",
        body: { password },
      }),
    revokeGuestSessions: (id: string) =>
      albumMutation.mutateAsync({
        path: `/albums/${id}/sessions`,
        method: "DELETE",
      }),
  };
}
const ApiContext = createContext<ReturnType<typeof useApiController> | null>(
  null,
);
function ApiProvider({ children }: { children: ReactNode }) {
  const value = useApiController();
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}
export function ApiQueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider>{children}</ApiProvider>
    </QueryClientProvider>
  );
}
export function useApiData() {
  const value = useContext(ApiContext);
  if (!value) throw new Error("ApiQueryProvider is missing");
  return value;
}
