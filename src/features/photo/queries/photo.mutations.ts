import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useAppStore } from "@/app/stores/app.store";
import { albumKeys } from "@/features/photographer/queries/album.key";
import { photoService } from "../services/photo.service";
import { usePhotoStore } from "../stores/photo.store";
import type { PhotoPage } from "../types/photo.types";
import { photoKeys } from "./photo.key";

export function usePhotoSelectionMutation(
  scope: "owner" | "guest",
  guestShare: string | null,
) {
  const client = useQueryClient();
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
    onSuccess: async (result, input) => {
      const albumId = guestShare ?? input.albumId;
      const prefix = photoKeys.prefix(scope, albumId);
      await client.cancelQueries({ queryKey: prefix });
      client.setQueriesData<InfiniteData<PhotoPage>>(
        { queryKey: prefix },
        (current) =>
          current && {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              photos: page.photos.map((photo) =>
                photo.id === input.photoId
                  ? { ...photo, isSelected: result.selected }
                  : photo,
              ),
            })),
          },
      );
      await Promise.all([
        client.invalidateQueries({ queryKey: prefix }),
        ...(scope === "owner"
          ? [client.invalidateQueries({ queryKey: albumKeys.all })]
          : []),
      ]);
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
  const setFailedSelection = usePhotoStore(
    (state) => state.setFailedSelection,
  );

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
