import { BeautyAlbumPreview } from "./BeautyAlbumPreview";
import { PreviewWindow } from "./PreviewWindow";

const captions = [
  ["Album sẵn sàng", "Preview tự động · không sửa ảnh gốc trên Drive"],
  ["Lựa chọn đã được lưu", "Không cần tài khoản · thả tim ngay trên điện thoại"],
  ["Lấy đúng ảnh gốc", "Sao chép file đã chọn · giữ nguyên thư mục nguồn"],
];
export function FeaturePreview({ chapter }: { chapter: number }) {
  return <div className="landing-feature-preview" data-preview-chapter={chapter}>
    <PreviewWindow parallax={0.045} label={chapter === 2 ? "Lumipic · lọc ảnh trên máy" : undefined}>
      {chapter === 2 ? <img className="landing-filter-image" src="/images/landing/local-photo-filter.webp" alt="Modal Lọc ảnh về máy mới: chọn định dạng, thư mục nguồn và nơi lưu bản sao" width="560" height="465" loading="lazy" /> : <BeautyAlbumPreview selected={chapter === 1} />}
    </PreviewWindow>
    <div className="landing-float-card" data-parallax="-0.055"><strong>{captions[chapter][0]}</strong><span>{captions[chapter][1]}</span></div>
  </div>;
}
