import { useState } from "react";
import { Heart, FolderHeart } from "lucide-react";
import { Button } from "@/components/ui/button";

const photos = [
  { file: "BEAUTY_001", alt: "Chân dung beauty với ánh sáng studio mềm và nền kem" },
  { file: "BEAUTY_002", alt: "Chân dung beauty góc nghiêng với lớp trang điểm hồng nhẹ" },
  { file: "BEAUTY_003", alt: "Ảnh beauty trong trang phục satin màu kem" },
  { file: "BEAUTY_004", alt: "Chân dung beauty nhắm mắt hướng về ánh sáng dịu" },
];

export function BeautyAlbumPreview({ selected = false, interactive = false, priority = false }: {
  selected?: boolean; interactive?: boolean; priority?: boolean;
}) {
  const [liked, setLiked] = useState<number[]>(selected ? [0, 2] : []);
  const count = interactive ? liked.length : selected ? 2 : 0;
  return (
    <div className="beauty-album" aria-label="Album minh họa Beauty Studio">
      <div className="beauty-album-heading">
        <div><span className="beauty-album-label">ALBUM MINH HỌA</span><h3>Beauty Studio</h3></div>
        <span className="beauty-selection-count"><FolderHeart aria-hidden="true" />{count} / 4 ảnh đã chọn</span>
      </div>
      <div className="beauty-album-grid">
        {photos.map((photo, index) => {
          const isLiked = interactive ? liked.includes(index) : selected && [0, 2].includes(index);
          return <div className="beauty-photo" key={photo.file}>
            <img src={`/images/landing/beauty/beauty-${index + 1}.webp`} alt={photo.alt} width="640" height="960" loading={priority ? "eager" : "lazy"} decoding="async" />
            {interactive ? <Button variant="ghost" size="icon" className={`beauty-heart ${isLiked ? "is-liked" : ""}`} aria-label={`${isLiked ? "Bỏ chọn" : "Chọn"} ${photo.file}`} aria-pressed={isLiked} onClick={() => setLiked(current => current.includes(index) ? current.filter(i => i !== index) : [...current, index])}><Heart aria-hidden="true" /></Button> : <span className={`beauty-heart ${isLiked ? "is-liked" : ""}`}><Heart aria-hidden="true" /></span>}
            <span className="beauty-filename">{photo.file}.jpg</span>
          </div>;
        })}
      </div>
      <p className="beauty-album-note">{interactive ? "Thử chạm tim để chọn ảnh · " : ""}Ảnh beauty được tạo bằng AI</p>
    </div>
  );
}
