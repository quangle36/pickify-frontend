import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateAlbumCardProps {
  onCreate: () => void;
}

export function CreateAlbumCard({ onCreate }: CreateAlbumCardProps) {
  return (
    <Button
      type="button"
      onClick={onCreate}
      className="min-h-11 w-full sm:min-h-10 sm:w-auto"
    >
      <Plus className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      Tạo album mới
    </Button>
  );
}
