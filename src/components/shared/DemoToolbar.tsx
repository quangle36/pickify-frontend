import { FC, useState } from 'react';
import { ViewRole, Album } from '@/types';
import {
  Sliders,
  Radio,
  WifiOff,
  RotateCcw,
  User,
  Users,
  Home,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { store } from '@/lib/mockStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DemoToolbarProps {
  currentRole: ViewRole;
  onRoleChange: (role: ViewRole) => void;
  albums: Album[];
  selectedAlbumId: string;
  onSelectAlbum: (id: string) => void;
  onSimulateSSE: () => void;
}

export const DemoToolbar: FC<DemoToolbarProps> = ({
  currentRole,
  onRoleChange,
  albums,
  selectedAlbumId,
  onSelectAlbum,
  onSimulateSSE,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [networkError, setNetworkError] = useState(store.getSimulateNetworkError());

  const handleToggleNetworkError = () => {
    const next = !networkError;
    setNetworkError(next);
    store.setSimulateNetworkError(next);
  };

  const handleResetData = () => {
    if (window.confirm('Khôi phục dữ liệu mẫu ban đầu?')) {
      store.resetStore();
      setNetworkError(false);
      onSelectAlbum('album_dalat_wedding');
    }
  };

  return (
    <aside aria-label="Bảng điều khiển thử nghiệm" className="fixed bottom-3 right-3 z-40">
      {isOpen ? (
        <div className="bg-stone-900/95 text-stone-200 rounded-3xl p-4 sm:p-5 shadow-2xl border border-stone-700/80 w-80 space-y-4 backdrop-blur-md animate-fade-in text-xs">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <div className="flex items-center gap-2 font-bold text-white">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Bảng Thử Nghiệm MVP Demo</span>
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Role Switcher */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold text-stone-400">
                Chuyển đổi giao diện:
              </span>
              <Badge variant="outline" className="text-[10px] border-stone-700 text-stone-300">
                {currentRole}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1 bg-stone-800 rounded-xl">
              <button
                type="button"
                onClick={() => onRoleChange('landing')}
                className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors ${
                  currentRole === 'landing' ? 'bg-brand-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Home className="w-3 h-3" />
                <span>Landing</span>
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('photographer')}
                className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors ${
                  currentRole === 'photographer' ? 'bg-brand-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                <User className="w-3 h-3" />
                <span>Studio</span>
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('guest')}
                className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors ${
                  currentRole === 'guest' ? 'bg-brand-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>Khách</span>
              </button>
            </div>
          </div>

          {/* Album Switcher */}
          <div>
            <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1.5">
              Album đang chọn:
            </span>
            <select
              value={selectedAlbumId}
              onChange={(e) => onSelectAlbum(e.target.value)}
              aria-label="Chọn album để thử nghiệm"
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-white outline-hidden font-medium focus:ring-1 focus:ring-brand-500"
            >
              {albums.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.status})
                </option>
              ))}
            </select>
          </div>

          {/* Simulation buttons */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <Button
              type="button"
              variant="outline"
              onClick={onSimulateSSE}
              className="w-full h-auto py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-500/40 text-emerald-300 font-bold justify-center gap-2 hover:text-emerald-200"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Giả lập khách khác thả tim (SSE)</span>
            </Button>

            <Button
              type="button"
              variant={networkError ? 'destructive' : 'secondary'}
              onClick={handleToggleNetworkError}
              className={`w-full h-auto py-2 px-3 rounded-xl font-bold justify-center gap-2 ${
                networkError
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md hover:bg-rose-700'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>{networkError ? 'Đang bật Giả lập Lỗi Mạng' : 'Bật Giả lập Lỗi Mạng (Test Chưa Lưu)'}</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetData}
              className="w-full text-stone-400 hover:text-stone-200 text-[11px] font-medium justify-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Khôi phục dữ liệu gốc</span>
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-stone-900/90 hover:bg-stone-900 text-white px-3.5 py-2 rounded-2xl shadow-xl border border-stone-700/80 flex items-center gap-2 backdrop-blur-md transition-all group"
          title="Mở bảng điều khiển thử nghiệm tính năng"
        >
          <Sliders className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-bold hidden sm:inline">Thử Nghiệm Demo</span>
          <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
        </button>
      )}
    </aside>
  );
};
export default DemoToolbar;
