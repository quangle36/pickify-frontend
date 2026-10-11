import { useQuery } from "@tanstack/react-query";
import { albumService } from "../services/album.service";
import { albumKeys } from "./album.key";

const isProcessing = (status?: string) =>
  status === "scanning" || status === "importing";

export function useAlbums(ownerId?: string) {
  return useQuery({
    queryKey: albumKeys.all,
    enabled: !!ownerId,
    queryFn: ({ signal }) => albumService.getAlbums(signal),
    refetchInterval: (query) =>
      query.state.data?.some((album) => isProcessing(album.status))
        ? 2000
        : false,
  });
}

export function useSourceTimePhotos(
  albumId: string,
  sourceId: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: albumKeys.sourceTime(albumId, sourceId),
    queryFn: ({ signal }) =>
      albumService.getTimePhotos(albumId, sourceId, signal),
    enabled: enabled && !!sourceId,
  });
}
