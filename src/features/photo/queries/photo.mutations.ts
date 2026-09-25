import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query";
import { useRef } from "react";
import { useAppStore } from "@/app/stores/app.store";
import { albumKeys } from "@/features/photographer/queries/album.key";
import type { Album } from "@/features/photographer/types/album.types";
import { photoService } from "../services/photo.service";
import { usePhotoStore } from "../stores/photo.store";
import type { Photo, PhotoFilters, PhotoPage } from "../types/photo.types";
import { photoKeys } from "./photo.key";

function updatePhotoSelection(
  current: InfiniteData<PhotoPage> | undefined,
  photoId: string,
  selected: boolean,
  countDelta: number,
) {
  if (!current) return current;

  return {
    ...current,
    pages: current.pages.map((page) => ({
      ...page,
      album:
        typeof page.album.selectedPhotosCount === "number"
          ? {
              ...page.album,
              selectedPhotosCount: Math.max(
                0,
                page.album.selectedPhotosCount + countDelta,
              ),
            }
          : page.album,
      photos: page.photos.map((photo) =>
        photo.id === photoId ? { ...photo, isSelected: selected } : photo,
      ),
    })),
  };
}

function updateSelectionCount(
  current: InfiniteData<PhotoPage> | undefined,
  selectedPhotosCount: number,
) {
  if (!current) return current;

  return {
    ...current,
    pages: current.pages.map((page) => ({
      ...page,
      album: { ...page.album, selectedPhotosCount },
    })),
  };
}

function hasSelectedFilter(queryKey: QueryKey) {
  const filters = queryKey[3] as PhotoFilters | undefined;
  return filters?.selected === true;
}

function matchesPrefix(queryKey: QueryKey, prefix: QueryKey) {
  return prefix.every((part, index) => queryKey[index] === part);
}

interface RemovedPhoto {
  queryKey: QueryKey;
  pageIndex: number;
  photoIndex: number;
  photo: Photo;
}

interface PendingAlbumSelection {
  pending: number;
  hadError: boolean;
  latestResult?: {
    version: bigint;
    selectedPhotosCount: number;
  };
}

function restoreRemovedPhoto(
  current: InfiniteData<PhotoPage> | undefined,
  removed: RemovedPhoto,
) {
  if (!current) return current;
  if (
    current.pages.some((page) =>
      page.photos.some((photo) => photo.id === removed.photo.id),
    )
  )
    return current;

  return {
    ...current,
    pages: current.pages.map((page, pageIndex) => {
      if (pageIndex !== removed.pageIndex) return page;
      const photos = [...page.photos];
      photos.splice(
        Math.min(removed.photoIndex, photos.length),
        0,
        removed.photo,
      );
      return { ...page, photos };
    }),
  };
}

export function usePhotoSelectionMutation(
  scope: "owner" | "guest",
  guestShare: string | null,
) {
  const client = useQueryClient();
  const pendingAlbums = useRef(new Map<string, PendingAlbumSelection>());
  return useMutation({
    mutationKey: ["selection"],
    mutationFn: (input: {
      albumId: string;
      photoId: string;
      selected: boolean;
    }) =>
      photoService.updateSelection(
        scope === "guest"
          ? `/public/albums/${guestShare}`
          : `/albums/${input.albumId}`,
        input.photoId,
        input.selected,
      ),
    onMutate: async (input) => {
      const albumId = guestShare ?? input.albumId;
      const prefix = photoKeys.prefix(scope, albumId);
      await client.cancelQueries({ queryKey: prefix });

      const removedPhotos: RemovedPhoto[] = [];
      const photoQueries = client.getQueriesData<InfiniteData<PhotoPage>>({
        queryKey: prefix,
      });
      const previousSelected = photoQueries
        .flatMap(([, current]) =>
          current?.pages.flatMap((page) => page.photos) ?? [],
        )
        .find((photo) => photo.id === input.photoId)?.isSelected;
      const countDelta =
        previousSelected === undefined || previousSelected === input.selected
          ? 0
          : input.selected
            ? 1
            : -1;
      const mutationState = pendingAlbums.current.get(albumId) ?? {
        pending: 0,
        hadError: false,
      };
      mutationState.pending += 1;
      pendingAlbums.current.set(albumId, mutationState);

      photoQueries.forEach(([queryKey, current]) => {
        if (!current) return;
        if (!input.selected && hasSelectedFilter(queryKey)) {
          current.pages.forEach((page, pageIndex) => {
            const photoIndex = page.photos.findIndex(
              (photo) => photo.id === input.photoId,
            );
            if (photoIndex !== -1)
              removedPhotos.push({
                queryKey,
                pageIndex,
                photoIndex,
                photo: page.photos[photoIndex],
              });
          });
        }
        client.setQueryData<InfiniteData<PhotoPage>>(queryKey, (cached) => {
          const updated = updatePhotoSelection(
            cached,
            input.photoId,
            input.selected,
            countDelta,
          );
          if (!updated || input.selected || !hasSelectedFilter(queryKey))
            return updated;
          return {
            ...updated,
            pages: updated.pages.map((page) => ({
              ...page,
              photos: page.photos.filter((photo) => photo.id !== input.photoId),
            })),
          };
        });
      });

      if (scope === "owner") {
        client.setQueryData<Album[]>(albumKeys.all, (current) =>
          current?.map((album) =>
            album.id === input.albumId
              ? {
                  ...album,
                  selectedPhotosCount: Math.max(
                    0,
                    album.selectedPhotosCount + countDelta,
                  ),
                }
              : album,
          ),
        );
      }

      return {
        albumId,
        prefix,
        countDelta,
        previousSelected: previousSelected ?? !input.selected,
        removedPhotos,
      };
    },
    onError: (_error, input, context) => {
      const prefix =
        context?.prefix ?? photoKeys.prefix(scope, guestShare ?? input.albumId);
      const rollbackDelta = -(context?.countDelta ?? (input.selected ? 1 : -1));
      client.setQueriesData<InfiniteData<PhotoPage>>(
        { queryKey: prefix },
        (current) =>
          updatePhotoSelection(
            current,
            input.photoId,
            context?.previousSelected ?? !input.selected,
            rollbackDelta,
          ),
      );
      context?.removedPhotos.forEach((removed) =>
        client.setQueryData<InfiniteData<PhotoPage>>(
          removed.queryKey,
          (current) => restoreRemovedPhoto(current, removed),
        ),
      );

      if (scope === "owner")
        client.setQueryData<Album[]>(albumKeys.all, (current) =>
          current?.map((album) =>
            album.id === input.albumId
              ? {
                  ...album,
                  selectedPhotosCount: Math.max(
                    0,
                    album.selectedPhotosCount + rollbackDelta,
                  ),
                }
              : album,
          ),
        );

      const albumId = context?.albumId ?? guestShare ?? input.albumId;
      const mutationState = pendingAlbums.current.get(albumId);
      if (mutationState) mutationState.hadError = true;
    },
    onSuccess: (result, input, context) => {
      const prefix =
        context?.prefix ?? photoKeys.prefix(scope, guestShare ?? input.albumId);
      client.setQueriesData<InfiniteData<PhotoPage>>(
        { queryKey: prefix },
        (current) =>
          updatePhotoSelection(current, input.photoId, result.selected, 0),
      );
      const albumId = context?.albumId ?? guestShare ?? input.albumId;
      const mutationState = pendingAlbums.current.get(albumId);
      const version = BigInt(result.version);
      if (
        mutationState &&
        (!mutationState.latestResult ||
          version >= mutationState.latestResult.version)
      ) {
        mutationState.latestResult = {
          version,
          selectedPhotosCount: result.selectedPhotosCount,
        };
      }
      void client.invalidateQueries({
        predicate: (query) =>
          matchesPrefix(query.queryKey, prefix) &&
          hasSelectedFilter(query.queryKey),
        refetchType: "none",
      });
    },
    onSettled: (_result, _error, input, context) => {
      const albumId = context?.albumId ?? guestShare ?? input.albumId;
      const prefix =
        context?.prefix ?? photoKeys.prefix(scope, guestShare ?? input.albumId);
      const mutationState = pendingAlbums.current.get(albumId);
      if (!mutationState) return;

      mutationState.pending = Math.max(0, mutationState.pending - 1);
      if (mutationState.pending > 0) return;

      if (mutationState.latestResult) {
        const selectedPhotosCount =
          mutationState.latestResult.selectedPhotosCount;
        client.setQueriesData<InfiniteData<PhotoPage>>(
          { queryKey: prefix },
          (current) => updateSelectionCount(current, selectedPhotosCount),
        );
        if (scope === "owner")
          client.setQueryData<Album[]>(albumKeys.all, (current) =>
            current?.map((album) =>
              album.id === input.albumId
                ? { ...album, selectedPhotosCount }
                : album,
            ),
          );
      }

      if (mutationState.hadError) {
        void client.invalidateQueries({ queryKey: prefix, refetchType: "active" });
        if (scope === "owner")
          void client.invalidateQueries({
            queryKey: albumKeys.all,
            refetchType: "active",
          });
      }
      pendingAlbums.current.delete(albumId);
    },
  });
}

export function usePhotoSelection(
  scope: "owner" | "guest",
  guestShare: string | null,
) {
  const client = useQueryClient();
  const mutation = usePhotoSelectionMutation(scope, guestShare);
  const saving = usePhotoStore((state) => state.saving);
  const failedSelections = usePhotoStore((state) => state.failedSelections);
  const report = useAppStore((state) => state.report);
  const setSaving = usePhotoStore((state) => state.setSaving);
  const clearFailedSelection = usePhotoStore(
    (state) => state.clearFailedSelection,
  );
  const setFailedSelection = usePhotoStore((state) => state.setFailedSelection);

  const toggle = async (
    albumId: string,
    photoId: string,
    selected: boolean,
  ) => {
    const alreadySaving = client
      .getMutationCache()
      .findAll({ mutationKey: ["selection"], status: "pending" })
      .some(
        (item) =>
          (item.state.variables as { photoId?: string })?.photoId === photoId,
      );
    if (alreadySaving) return false;

    setSaving(photoId, true);
    clearFailedSelection(photoId);
    try {
      await mutation.mutateAsync({ albumId, photoId, selected });
      return true;
    } catch (error) {
      setFailedSelection(photoId, selected);
      report(error);
      return false;
    } finally {
      setSaving(photoId, false);
    }
  };

  return {
    toggle,
    retry: (albumId: string, photoId: string) =>
      photoId in failedSelections
        ? toggle(albumId, photoId, failedSelections[photoId])
        : Promise.resolve(true),
    isPending: (photoId: string) => !!saving[photoId],
    isFailed: (photoId: string) => photoId in failedSelections,
  };
}
