import { FC, MouseEvent } from 'react';
import { Photo } from '@/types';
import { Heart } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  onToggleHeart: (photoId: string, currentSelected: boolean) => void;
}

export const PhotoCard: FC<PhotoCardProps> = ({
  photo,
  onClick,
  onToggleHeart,
}) => {
  const handleHeartClick = (e: MouseEvent) => {
    e.stopPropagation();
    onToggleHeart(photo.id, photo.isSelected);
  };

  return (
    <Card
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 cursor-pointer border border-stone-200 hover:border-brand-500 hover:shadow-md transition-all select-none"
    >
      <img
        src={photo.thumbnailUrl}
        alt={photo.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

      {/* Heart Button Top-Right */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <button
          type="button"
          onClick={handleHeartClick}
          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-90 shadow-md ${
            photo.isSelected
              ? 'bg-rose-500 text-white animate-heart-pop'
              : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'
          }`}
          title={photo.isSelected ? 'Khách đã thả tim' : 'Chưa được chọn'}
        >
          <Heart className={`w-4 h-4 ${photo.isSelected ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Bottom Label */}
      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-stone-200 pointer-events-none">
        <span className="truncate">{photo.name}</span>
        <Badge variant="outline" className="text-[10px] text-stone-400 bg-black/40 border-0 font-sans px-1.5 py-0">
          {formatBytes(photo.sizeBytes)}
        </Badge>
      </div>
    </Card>
  );
};
export default PhotoCard;
