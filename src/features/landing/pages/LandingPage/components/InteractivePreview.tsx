import { FC, useState } from 'react';
import { Heart, Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface InteractivePhoto {
  id: string;
  name: string;
  url: string;
  isSelected: boolean;
}

const DEMO_PHOTOS: InteractivePhoto[] = [
  {
    id: 'demo_1',
    name: 'DSC_0012.JPG',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    isSelected: true,
  },
  {
    id: 'demo_2',
    name: 'DSC_0045.JPG',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    isSelected: true,
  },
  {
    id: 'demo_3',
    name: 'DSC_0089.JPG',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    isSelected: false,
  },
  {
    id: 'demo_4',
    name: 'DSC_0102.JPG',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
    isSelected: true,
  },
  {
    id: 'demo_5',
    name: 'DSC_0140.JPG',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
    isSelected: false,
  },
  {
    id: 'demo_6',
    name: 'DSC_0215.JPG',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=600&q=80',
    isSelected: true,
  },
];

interface InteractivePreviewProps {
  onOpenGuestDemo: () => void;
  onGoToDashboard: () => void;
}

export const InteractivePreview: FC<InteractivePreviewProps> = ({
  onOpenGuestDemo,
  onGoToDashboard,
}) => {
  const [photos, setPhotos] = useState<InteractivePhoto[]>(DEMO_PHOTOS);
  const [lastAction, setLastAction] = useState<string | null>('Bấm vào biểu tượng trái tim để trải nghiệm thử!');

  const toggleHeart = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.isSelected;
          setLastAction(
            nextState
              ? `Bạn vừa thả tim ảnh ${p.name} ❤️`
              : `Bạn vừa bỏ tim ảnh ${p.name}`
          );
          return { ...p, isSelected: nextState };
        }
        return p;
      })
    );
  };

  const selectedCount = photos.filter((p) => p.isSelected).length;

  const handleDownloadSampleCsv = () => {
    const selected = photos.filter((p) => p.isSelected);
    if (selected.length === 0) {
      alert('Vui lòng thả tim ít nhất 1 ảnh để xuất thử CSV!');
      return;
    }
    const headers = ['STT', 'Tên File', 'Trạng Thái', 'Google Drive ID'];
    const rows = selected.map((p, idx) => [
      (idx + 1).toString(),
      p.name,
      'Đã chọn (Thả tim)',
      `drive_${p.id}_demo`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Demo_ChonAnh_${selectedCount}_File.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setLastAction(`Đã tải xuống file CSV chứa ${selectedCount} ảnh được chọn!`);
  };

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="warning" className="mb-3 gap-1.5 px-3.5 py-1 text-xs font-bold border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Trải nghiệm Tương tác Trực tiếp</span>
          </Badge>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Thử cảm giác Khách hàng chọn ảnh ngay dưới đây
          </h3>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Bấm thả tim vào các ảnh cưới mẫu để xem cách bộ đếm và giao diện phản hồi tức thì.
          </p>
        </div>

        {/* Interactive Box */}
        <Card className="max-w-4xl mx-auto bg-stone-900 text-white rounded-3xl p-5 sm:p-8 shadow-2xl border-stone-800 relative overflow-hidden">
          {/* Top Bar of Interactive Box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Đồng bộ Trực Tiếp (SSE Realtime)
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mt-1">Album: Đà Lạt Mộng Mơ — Demo Khách Chọn</h4>
            </div>

            {/* Counter Badge */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-stone-800 border border-stone-700/80 flex items-center gap-2 shadow-inner">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                <span className="text-xs text-stone-300 font-medium">Đã chọn:</span>
                <span className="text-base font-black text-white font-mono">{selectedCount}</span>
                <span className="text-xs text-stone-400">/{photos.length} ảnh</span>
              </div>

              <Button
                size="sm"
                onClick={handleDownloadSampleCsv}
                className="rounded-xl font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 gap-1.5 shadow-xs"
                title="Tải file CSV mẫu tương thích Lightroom"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất CSV Thử</span>
              </Button>
            </div>
          </div>

          {/* Toast Notification inside box */}
          <div className="py-2.5 px-4 bg-stone-800/80 rounded-xl my-4 text-xs font-medium text-stone-300 flex items-center justify-between">
            <span>{lastAction}</span>
            <span className="text-[11px] text-stone-500 hidden sm:inline">Khách & Photographer đều thấy số liệu này</span>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => toggleHeart(photo.id)}
                className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-800 cursor-pointer border border-stone-700/60 hover:border-brand-500 transition-all select-none"
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                {/* Heart Button Overlay */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHeart(photo.id);
                    }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-90 shadow-md ${
                      photo.isSelected
                        ? 'bg-rose-500 text-white animate-heart-pop'
                        : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${photo.isSelected ? 'fill-white' : ''}`}
                    />
                  </button>
                </div>

                {/* Filename label */}
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-stone-300">
                  <span className="truncate">{photo.name}</span>
                  {photo.isSelected && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 rounded border border-rose-800/50 shrink-0 bg-rose-950/70 text-rose-300">
                      ĐÃ CHỌN
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer of Interactive Box */}
          <div className="mt-6 pt-5 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
            <span>✨ Trải nghiệm đầy đủ trên điện thoại của khách hàng hỗ trợ zoom ảnh lớn & phím tắt.</span>
            <div className="flex items-center gap-4">
              <Button
                variant="link"
                size="sm"
                onClick={onOpenGuestDemo}
                className="text-brand-400 hover:text-brand-300 font-bold p-0 h-auto underline underline-offset-4"
              >
                Mở toàn màn hình Khách →
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={onGoToDashboard}
                className="text-amber-400 hover:text-amber-300 font-bold p-0 h-auto underline underline-offset-4"
              >
                Vào Dashboard Quản lý →
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
export default InteractivePreview;
