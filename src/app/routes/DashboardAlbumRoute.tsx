import { useParams } from "@tanstack/react-router";
import App from "../App";

export function DashboardAlbumRoute() {
  const { albumId } = useParams({ from: "/dashboard/album/$albumId" });

  return (
    <App currentRole="photographer" selectedAlbumId={albumId} isDetailView />
  );
}
