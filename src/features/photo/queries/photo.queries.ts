import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { photoService } from "../services/photo.service";
import { usePhotoStore } from "../stores/photo.store";
import type { Photo, PhotoFilters, PhotoPage } from "../types/photo.types";
import { photoKeys } from "./photo.key";

const isProcessing = (status?: string) =>
  status === "scanning" || status === "importing";

interface PhotosQueryOptions {
  scope: "owner" | "guest";
  albumId: string;
  filters: PhotoFilters;
  enabled: boolean;
  targetStatus?: string;
  readOnly?: boolean;
}

export function usePhotosQuery(options: PhotosQueryOptions) {
  return useInfiniteQuery({
    queryKey: photoKeys.list(
      options.scope,
      options.albumId,
      options.filters,
      options.readOnly ? "view" : "interactive",
    ),
    enabled: options.enabled,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      options.scope === "guest"
        ? photoService.getGuestPhotos(
            options.albumId,
            pageParam,
            options.filters,
            !!options.readOnly,
            signal,
          )
        : photoService.getOwnerPhotos(
            options.albumId,
            pageParam,
            options.filters,
            signal,
          ),
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    refetchInterval: (query) =>
      isProcessing(
        query.state.data?.pages.slice(-1)[0]?.album.status ??
          options.targetStatus,
      )
        ? 2000
        : false,
  });
}

export function photosFromPages(data?: InfiniteData<PhotoPage>) {
  return [
    ...new Map(
      data?.pages
        .flatMap((page) => page.photos)
        .map((photo) => [photo.id, photo]) ?? [],
    ).values(),
  ].filter((photo) => photo.status === "ready" || photo.status === "error");
}

export function usePhotoFilters(albumId: string) {
  const setFilters = usePhotoStore((state) => state.setFilters);
  return useCallback(
    (selected: boolean, search = "") =>
      setFilters(albumId, { selected, search }),
    [albumId, setFilters],
  );
}

export function useCachedAlbumPhotos(albumId: string): Photo[] {
  const client = useQueryClient();
  const cached = client
    .getQueriesData<InfiniteData<PhotoPage>>({
      queryKey: photoKeys.prefix("owner", albumId),
    })
    .map(([, data]) => data)
    .find(Boolean);
  return photosFromPages(cached);
}
