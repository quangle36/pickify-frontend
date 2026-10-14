import { useEffect } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ApiError } from "@/api/errors";
import { mergeOwnerAlbumSnapshot } from "@/features/photographer/utils/mergeOwnerAlbumSnapshot";
import { useAlbums } from "@/features/photographer/queries/album.queries";
import { albumKeys } from "@/features/photographer/queries/album.key";
import { useOwnerQuery } from "@/features/auth/queries/auth.queries";
import { useGuestAlbumQuery } from "@/features/guest/queries/guest.queries";
import {
  photosFromPages,
  usePhotosQuery,
} from "@/features/photo/queries/photo.queries";
import { usePhotoSelection } from "@/features/photo/queries/photo.mutations";
import { photoKeys } from "@/features/photo/queries/photo.key";
import type { PhotoPage } from "@/features/photo/types/photo.types";
import { usePhotoStore } from "@/features/photo/stores/photo.store";
import { useAlbumStore } from "@/features/photographer/stores/album.store";
import type {
  Album,
  PhotographerProfile,
} from "@/features/photographer/types/album.types";
import type { ViewRole } from "../app.types";
import { useAppStore } from "../stores/app.store";
import { useAppActions } from "./useAppActions";
import { useAppEffects } from "./useAppEffects";
import { useAppLightbox } from "./useAppLightbox";

interface AppRoute {
  pathname: string;
  currentRole: ViewRole;
  selectedAlbumId: string;
  isDetailView: boolean;
}

const emptyProfile: PhotographerProfile = {
  id: "",
  name: "",
  email: "",
  avatarUrl: "",
  activeAlbumsCount: 0,
  maxPhotosLimit: 1500,
  albumLifespanDays: 30,
};

const defaultFilters = { selected: false, search: "" };

export function useAppController(route: AppRoute) {
  const client = useQueryClient();
  const navigate = useNavigate();
  const guestShare =
    route.pathname.match(/^\/album\/([a-zA-Z0-9_-]+)\/?$/)?.[1] ?? null;
  const guestReadOnly =
    !!guestShare &&
    new URLSearchParams(window.location.search).get("mode") === "view";
  const report = useAppStore((state) => state.report);
  const error = useAppStore((state) => state.error);
  const clearError = useAppStore((state) => state.clearError);
  const filters = usePhotoStore((state) => state.filters);
  const hiddenAlbumIds = useAlbumStore((state) => state.hiddenAlbumIds);

  const owner = useOwnerQuery(!guestShare);
  const albumsQuery = useAlbums(owner.data?.id);
  const guest = useGuestAlbumQuery(guestShare, guestReadOnly);
  const albumId = guestShare ?? route.selectedAlbumId;
  const scope = guestShare ? "guest" : "owner";
  const photosQuery = usePhotosQuery({
    scope,
    albumId,
    filters: filters[albumId] ?? defaultFilters,
    enabled: guestShare
      ? !!guest.data
      : !!route.isDetailView && !!albumId && !!owner.data?.id,
    readOnly: guestReadOnly,
  });
  const photoSelection = usePhotoSelection(scope, guestShare);

  const cachedGuestAlbum = guestShare
    ? client
        .getQueriesData<InfiniteData<PhotoPage>>({
          queryKey: photoKeys.prefix("guest", guestShare),
        })
        .map(([key, data]) =>
          key[3] === (guestReadOnly ? "view" : "interactive")
            ? data?.pages.slice(-1)[0]?.album
            : undefined,
        )
        .find(Boolean)
    : undefined;
  const photoAlbum =
    photosQuery.data?.pages.slice(-1)[0]?.album ?? cachedGuestAlbum;
  const albums = guestShare
    ? guest.data
      ? [
          {
            ...guest.data,
            ...photoAlbum,
            selectionLocked: guest.data.selectionLocked,
            imageProtectionEnabled: guest.data.imageProtectionEnabled,
          },
        ]
      : []
    : (albumsQuery.data ?? [])
        .filter((album) => !hiddenAlbumIds.includes(album.id))
        .map((album) =>
          album.id === albumId && photoAlbum
            ? mergeOwnerAlbumSnapshot(album, photoAlbum)
            : album,
        );
  const selectedAlbum = albums.find(
    (album) => album.id === route.selectedAlbumId,
  );
  const album =
    route.currentRole === "photographer" && route.isDetailView
      ? selectedAlbum
      : (selectedAlbum ?? albums[0]);
  const photos = photosFromPages(photosQuery.data);
  const firstPhotoCoverUrl = photos.find(
    (photo) => photo.status === "ready" && photo.displayUrl,
  )?.displayUrl;
  const nextCoverUrl = photoAlbum?.coverUrl || firstPhotoCoverUrl;
  const hasGuestData =
    !!guestShare &&
    client
      .getQueriesData<InfiniteData<PhotoPage>>({
        queryKey: photoKeys.prefix("guest", guestShare),
      })
      .some(
        ([key, data]) =>
          key[3] === (guestReadOnly ? "view" : "interactive") && !!data,
      );
  const verified =
    hasGuestData &&
    !(
      photosQuery.error instanceof ApiError && photosQuery.error.status === 401
    );

  useEffect(() => {
    if (scope !== "owner" || !albumId || !nextCoverUrl) return;
    client.setQueryData<Album[]>(albumKeys.all, (current) =>
      current?.map((currentAlbum) =>
        currentAlbum.id === albumId && currentAlbum.coverUrl !== nextCoverUrl
          ? { ...currentAlbum, coverUrl: nextCoverUrl }
          : currentAlbum,
      ),
    );
  }, [albumId, client, nextCoverUrl, scope]);

  useEffect(() => {
    // The album behind this page was deleted (or never existed): the page
    // already shows the album list, so fix the URL instead of showing an
    // error that every refetch would show again.
    if (
      !guestShare &&
      photosQuery.error instanceof ApiError &&
      photosQuery.error.status === 404
    ) {
      void navigate({ to: "/dashboard", replace: true, search: {} });
      return;
    }
    const queryError =
      owner.error ?? albumsQuery.error ?? guest.error ?? photosQuery.error;
    if (
      queryError &&
      !(
        guestShare &&
        queryError instanceof ApiError &&
        queryError.status === 401
      )
    ) {
      report(queryError);
    } else {
      clearError();
    }
  }, [
    albumsQuery.error,
    clearError,
    guest.error,
    guestShare,
    navigate,
    owner.error,
    photosQuery.error,
    report,
  ]);

  const actions = useAppActions();
  const lightbox = useAppLightbox(
    album?.id,
    album?.totalPhotos ?? 0,
    photos,
    photoSelection.toggle,
  );
  useAppEffects({ ...route, album, closeLightbox: lightbox.close });

  return {
    pending: {
      owner: !guestShare && owner.isPending,
      albums: !guestShare && !!owner.data?.id && albumsQuery.isPending,
      photos:
        !guestShare && route.isDetailView && !!albumId && photosQuery.isPending,
      guest:
        !!guestShare &&
        (guest.isPending ||
          (guest.isSuccess && !hasGuestData && photosQuery.isPending)),
    },
    error,
    profile: owner.data ?? emptyProfile,
    albums,
    album,
    photos,
    verified,
    guestReadOnly,
    hasMorePhotos: !!photosQuery.hasNextPage,
    loadingMorePhotos: photosQuery.isFetchingNextPage,
    loadMorePhotos: async () => {
      const result = await photosQuery.fetchNextPage({ cancelRefetch: false });
      if (result.error) throw result.error;
    },
    actions,
    lightbox,
    openGuestDemo: () => {
      if (album) actions.openGuest(album.slug ?? album.shareId);
    },
  };
}

export type AppController = ReturnType<typeof useAppController>;
