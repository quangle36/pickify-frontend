import { useInfiniteQuery } from "@tanstack/react-query";
import { photoService } from "../services/photo.service";
import { commentKeys } from "./comment.key";

export function usePhotoComments(
  basePath: string,
  photoId: string,
  enabled: boolean,
) {
  return useInfiniteQuery({
    queryKey: commentKeys.list(basePath, photoId),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      photoService.getComments(basePath, photoId, pageParam, signal),
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled,
    refetchInterval: enabled ? 15_000 : false,
  });
}
