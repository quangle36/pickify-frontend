import { useState } from "react";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { landingPhotos } from "../photos";

/** The hero phone: visitors can heart photos the way a client would. */
export function LandingAlbumPreview() {
  const [liked, setLiked] = useState<number[]>([0, 3]);
  return (
    <div className="lp-phone">
      <div className="lp-phone-screen">
        <div className="lp-album-head">
          <span className="lp-album-title">Album Hè 2026</span>
          <Badge className="lp-count">♥ {liked.length} / {landingPhotos.length}</Badge>
        </div>
        <div className="lp-album-grid">
          {landingPhotos.map((photo, index) => {
            const isLiked = liked.includes(index);
            return (
              <Button
                key={photo.file}
                type="button"
                variant={null}
                size={null}
                className="lp-album-photo"
                aria-pressed={isLiked}
                aria-label={`${isLiked ? "Bỏ chọn" : "Chọn"} ${photo.alt}`}
                onClick={() =>
                  setLiked((current) =>
                    current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
                  )
                }
              >
                <img src={photo.src} alt="" width="640" height="960" decoding="async" />
                <span className="lp-heart" data-on={isLiked}><Heart aria-hidden="true" /></span>
              </Button>
            );
          })}
        </div>
        <p className="lp-phone-hint">Chạm trái tim để thử</p>
      </div>
    </div>
  );
}
