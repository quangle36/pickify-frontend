import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { errorMessage } from "@/api/errors";
import { authKeys } from "@/features/auth/queries/auth.key";
import { photoKeys } from "@/features/photo/queries/photo.key";
import { createAlbumSchema } from "../schemas/album.schema";
import { albumService, type UpdateAlbumInput } from "../services/album.service";
import { useAlbumStore } from "../stores/album.store";
import type {
  Album,
  AlbumSourceInput,
  PhotoSortMode,
  PhotographerProfile,
} from "../types/album.types";
import { albumKeys } from "./album.key";

export interface CreateAlbumFormInput {
  name: string;
  slug: string;
  sources: AlbumSourceInput[];
  sortMode: PhotoSortMode;
  passcode: string;
  selectionLimit: number;
}

export function useRevealAlbumPasscode() {
  return useMutation({ mutationFn: albumService.revealPasscode, gcTime: 0 });
}

async function invalidateAlbumData(client: QueryClient, includePhotos = true) {
  await Promise.all([
    client.invalidateQueries({ queryKey: authKeys.owner }),
    client.invalidateQueries({ queryKey: albumKeys.all }),
    ...(includePhotos
      ? [client.invalidateQueries({ queryKey: photoKeys.prefix("owner") })]
      : []),
  ]);
}

export function useCreateAlbum() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (form: CreateAlbumFormInput) => {
      const input = createAlbumSchema.parse({
        name: form.name,
        slug: form.slug,
        sources: form.sources,
        sortMode: form.sortMode,
        password: form.passcode,
        selectionLimit: form.selectionLimit,
      });
      return albumService.createAlbum({ ...input, sources: input.sources! });
    },
    onSuccess: () => invalidateAlbumData(client),
  });
}

export function useRetryAlbum() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: albumService.retryAlbum,
    onSuccess: () => invalidateAlbumData(client),
  });
}

export function useUpdateAlbum() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      albumId,
      input,
    }: {
      albumId: string;
      input: UpdateAlbumInput;
    }) => albumService.updateAlbum(albumId, input),
    onSuccess: () => invalidateAlbumData(client, false),
  });
}

export function useUpdateAlbumPasscode() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      albumId,
      password,
    }: {
      albumId: string;
      password: string;
    }) => albumService.updatePasscode(albumId, password),
    onSuccess: () => invalidateAlbumData(client),
  });
}

export function useRevokeAlbumSessions() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: albumService.revokeGuestSessions,
    onSuccess: () => invalidateAlbumData(client),
  });
}

export function useSetAlbumSelectionLocked() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ albumId, locked }: { albumId: string; locked: boolean }) =>
      albumService.setSelectionLocked(albumId, locked),
    onMutate: async ({ albumId, locked }) => {
      await client.cancelQueries({ queryKey: albumKeys.all });
      const previousAlbums = client.getQueryData<Album[]>(albumKeys.all);
      client.setQueryData<Album[]>(albumKeys.all, (current) =>
        current?.map((album) =>
          album.id === albumId ? { ...album, selectionLocked: locked } : album,
        ),
      );
      return { previousAlbums };
    },
    onError: (_error, _input, context) => {
      if (context?.previousAlbums) {
        client.setQueryData(albumKeys.all, context.previousAlbums);
      }
    },
    onSuccess: (updatedAlbum) => {
      client.setQueryData<Album[]>(albumKeys.all, (current) =>
        current?.map((album) =>
          album.id === updatedAlbum.id ? { ...album, ...updatedAlbum } : album,
        ),
      );
    },
  });
}

export function useDeleteAlbum() {
  const client = useQueryClient();
  const hideAlbum = useAlbumStore((state) => state.hideAlbum);
  const showAlbum = useAlbumStore((state) => state.showAlbum);

  return useMutation({
    mutationFn: albumService.deleteAlbum,
    onMutate: async (albumId) => {
      hideAlbum(albumId);
      await Promise.all([
        client.cancelQueries({ queryKey: albumKeys.all }),
        client.cancelQueries({ queryKey: authKeys.owner }),
      ]);

      const previousAlbums = client.getQueryData<Album[]>(albumKeys.all);
      const removedAlbum = previousAlbums?.find(
        (album) => album.id === albumId,
      );
      const removedIndex = previousAlbums?.findIndex(
        (album) => album.id === albumId,
      );
      client.setQueryData<Album[]>(albumKeys.all, (current) =>
        current?.filter((album) => album.id !== albumId),
      );

      const countedAsActive =
        removedAlbum !== undefined &&
        !["expired", "deleting", "deleted"].includes(removedAlbum.status);
      if (countedAsActive) {
        client.setQueryData<PhotographerProfile | null>(
          authKeys.owner,
          (current) =>
            current
              ? {
                  ...current,
                  activeAlbumsCount: Math.max(0, current.activeAlbumsCount - 1),
                }
              : current,
        );
      }
      return {
        removedAlbum,
        removedIndex: removedIndex ?? -1,
        countedAsActive,
      };
    },
    onError: (_error, albumId, context) => {
      showAlbum(albumId);
      if (!context?.removedAlbum) return;
      const albumToRestore = context.removedAlbum;
      client.setQueryData<Album[]>(albumKeys.all, (current = []) => {
        if (current.some((album) => album.id === albumToRestore.id)) {
          return current;
        }
        const next = [...current];
        next.splice(
          Math.min(Math.max(context.removedIndex, 0), next.length),
          0,
          albumToRestore,
        );
        return next;
      });
      if (context.countedAsActive) {
        client.setQueryData<PhotographerProfile | null>(
          authKeys.owner,
          (current) =>
            current
              ? {
                  ...current,
                  activeAlbumsCount: current.activeAlbumsCount + 1,
                }
              : current,
        );
      }
    },
    onSuccess: async (_result, albumId) => {
      client.removeQueries({ queryKey: photoKeys.prefix("owner", albumId) });
      await invalidateAlbumData(client, false);
    },
  });
}

export async function createAlbumResult(
  create: ReturnType<typeof useCreateAlbum>["mutateAsync"],
  form: CreateAlbumFormInput,
) {
  try {
    const album = await create(form);
    return { success: true as const, album };
  } catch (error) {
    return { success: false as const, error: errorMessage(error) };
  }
}

export function useSetPhotoOrder() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { albumId: string; sortMode: PhotoSortMode }) =>
      albumService.setPhotoOrder(input.albumId, input.sortMode),
    onSuccess: () => invalidateAlbumData(client),
  });
}
export function useSetSourceClock() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      albumId: string;
      sourceId: string;
      correction:
        | { offsetSeconds: number }
        | { referencePhotoId: string; correctedCapturedAt: string };
    }) =>
      albumService.setSourceClock(
        input.albumId,
        input.sourceId,
        input.correction,
      ),
    onSuccess: async (_, input) => {
      await Promise.all([
        client.invalidateQueries({
          queryKey: albumKeys.timePrefix(input.albumId),
        }),
        invalidateAlbumData(client),
      ]);
    },
  });
}
export function useSetPhotoCaptureTime() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      albumId: string;
      photoId: string;
      capturedAt: string | null;
    }) =>
      albumService.setPhotoCaptureTime(
        input.albumId,
        input.photoId,
        input.capturedAt,
      ),
    onSuccess: async (_, input) => {
      await Promise.all([
        client.invalidateQueries({
          queryKey: albumKeys.timePrefix(input.albumId),
        }),
        invalidateAlbumData(client),
      ]);
    },
  });
}
