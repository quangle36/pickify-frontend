import { useMutation, useQueryClient } from "@tanstack/react-query";
import { photoService } from "../services/photo.service";
import { commentKeys } from "./comment.key";
import { photoKeys } from "./photo.key";

export function useAddPhotoComment(basePath: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      photoId: string;
      content: string;
      clientMutationId: string;
    }) =>
      photoService.addComment(
        basePath,
        input.photoId,
        input.content,
        input.clientMutationId,
      ),
    onSuccess: (_, input) => {
      void client.invalidateQueries({
        queryKey: commentKeys.list(basePath, input.photoId),
      });
      void client.invalidateQueries({
        queryKey: photoKeys.prefix("guest", basePath.split("/").at(-1)),
      });
    },
  });
}
