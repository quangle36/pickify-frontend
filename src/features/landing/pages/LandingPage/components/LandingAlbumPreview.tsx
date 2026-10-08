import { useState } from "react";
import { Heart, FolderHeart } from "lucide-react";
import { Button } from "@/components/ui/button";

// Real photos from album 5ec14278-e956-49b2-9c56-02da2d87359f (Glamping).
const photos = [
  {
    file: "MQG07402",
    alt: "Ảnh Glamping: ngồi trên ghế dã ngoại cùng ly nước",
  },
  { file: "MQG07525", alt: "Ảnh Glamping: ngồi trên xích đu bên hồ" },
  { file: "MQG07615", alt: "Ảnh Glamping: chân dung dưới ánh nắng chiều" },
  {
    file: "MQG07697",
    alt: "Ảnh Glamping: chân dung góc nghiêng trong nắng vàng",
  },
];

export function LandingAlbumPreview({
  selected = false,
  interactive = false,
  priority = false,
}: {
  selected?: boolean;
  interactive?: boolean;
  priority?: boolean;
}) {
  const [liked, setLiked] = useState<number[]>(selected ? [0, 2] : []);
  const count = interactive ? liked.length : selected ? 2 : 0;
  return (
    <div className="beauty-album" aria-label="Album minh họa Glamping">
      <div className="beauty-album-heading">
        <span className="beauty-selection-count">
          <FolderHeart aria-hidden="true" />
          {count} / 4 ảnh đã chọn
        </span>
      </div>
      <div className="beauty-album-grid">
        {photos.map((photo, index) => {
          const isLiked = interactive
            ? liked.includes(index)
            : selected && [0, 2].includes(index);
          return (
            <div className="beauty-photo" key={photo.file}>
              <img
                src={`/images/landing/glamping/${photo.file}.webp`}
                alt={photo.alt}
                width="640"
                height="960"
                loading={priority ? "eager" : "lazy"}
                decoding="async"
              />
              {interactive ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`beauty-heart ${isLiked ? "is-liked" : ""}`}
                  aria-label={`${isLiked ? "Bỏ chọn" : "Chọn"} ${photo.file}`}
                  aria-pressed={isLiked}
                  onClick={() =>
                    setLiked((current) =>
                      current.includes(index)
                        ? current.filter((i) => i !== index)
                        : [...current, index],
                    )
                  }
                >
                  <Heart aria-hidden="true" />
                </Button>
              ) : (
                <span className={`beauty-heart ${isLiked ? "is-liked" : ""}`}>
                  <Heart aria-hidden="true" />
                </span>
              )}
              <span className="beauty-filename">{photo.file}.jpg</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
