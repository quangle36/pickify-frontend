import { FC, MouseEvent } from 'react';
import { Photo } from '@/types';
import { Heart, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GuestPhotoCardProps {
  photo: Photo;
  isFailed: boolean;
  onClick: () => void;
  onToggleHeart: (photo: Photo) => void;
  onRetrySave: (photo: Photo) => void;
}

export const GuestPhotoCard: FC<GuestPhotoCardProps> = ({
  photo,
  isFailed,
  onClick,
  onToggleHeart,
  onRetrySave,
}) => {
  const handleHeartClick = (e: MouseEvent) => {
    e.stopPropagation();
    onToggleHeart(photo);
  };

  const handleRetryClick = (e: MouseEvent) => {
    e.stopPropagation();
    onRetrySave(photo);
  };

  return (
    <Card
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-800 cursor-pointer border border-stone-800 hover:border-brand-500 transition-all select-none"
    >
      <img
        src={photo.thumbnailUrl}
        alt={photo.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Heart Button Overlay (Tap target >= 44px) */}
      <div className="absolute top-1.5 right-1.5 z-10">
        <button
          type="button"
          onClick={handleHeartClick}
          className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-85 ${
            photo.isSelected
              ? 'bg-rose-500 text-white animate-heart-pop shadow-lg shadow-rose-500/40'
              : 'bg-black/45 text-white/80 hover:bg-black/60'
          }`}
          aria-label={photo.isSelected ? 'Bỏ tim' : 'Thả tim'}
        >
          <Heart className={`w-5 h-5 ${photo.isSelected ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Unsaved warning badge per plan.md */}
      {isFailed && (
        <div
          onClick={handleRetryClick}
          className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-bold flex items-center gap-1 shadow-md cursor-pointer animate-pulse"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Chưa lưu • Bấm thử lại</span>
        </div>
      )}

      {/* Bottom name label */}
      <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-stone-300 pointer-events-none">
        <span className="truncate">{photo.name}</span>
        {photo.isSelected && (
          <Badge variant="destructive" className="text-[10px] font-sans font-black text-rose-400 bg-rose-950/80 px-1.5 py-0 rounded shrink-0 border-rose-800/50">
            ĐÃ CHỌN
          </Badge>
        )}
      </div>
    </Card>
  );
};
export default GuestPhotoCard;
