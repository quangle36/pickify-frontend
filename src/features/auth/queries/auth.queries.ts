import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { authKeys } from "./auth.key";

export function useOwnerQuery(enabled: boolean) {
  return useQuery({
    queryKey: authKeys.owner,
    enabled,
    queryFn: ({ signal }) => authService.getCurrentUser(signal),
  });
}

export function useAuthConfigQuery() {
  const client = useQueryClient();
  return () =>
    client.fetchQuery({
      queryKey: authKeys.config,
      queryFn: ({ signal }) => authService.getConfig(signal),
    });
}
