import { useMutation, useQueryClient } from "@tanstack/react-query";
import { photoKeys } from "@/features/photo/queries/photo.key";
import { guestService } from "../services/guest.service";

export function useGuestVerificationMutation(shareId: string | null) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ share, password }: { share: string; password: string }) =>
      guestService.verifyPasscode(share, password),
    onSuccess: async () => {
      if (!shareId) return;
      await client.refetchQueries({
        queryKey: photoKeys.prefix("guest", shareId),
      });
    },
  });
}
