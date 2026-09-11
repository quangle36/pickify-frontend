import { FC } from 'react';
import { PhotographerProfile } from '@/types';
import {
  Heart,
  Plus,
  Eye,
  Home,
  Cloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PhotographerNavbarProps {
  profile: PhotographerProfile;
  onCreateAlbum: () => void;
  onOpenGuestDemo: () => void;
  onGoToLanding: () => void;
  onOpenDriveModal: () => void;
}

export const PhotographerNavbar: FC<PhotographerNavbarProps> = ({
  profile,
  onCreateAlbum,
  onOpenGuestDemo,
  onGoToLanding,
  onOpenDriveModal,
}) => {
  const isQuotaFull = profile.activeAlbumsCount >= profile.maxAlbumsLimit;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Landing Link */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoToLanding}
            className="flex items-center gap-2.5 group focus:outline-hidden"
            title="Quay về Trang chủ Landing Page"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center shadow-md shadow-brand-500/20 text-white group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-extrabold text-base tracking-tight text-stone-900 block leading-tight">
                Pickify
              </span>
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Photographer Studio
              </span>
            </div>
          </button>

          <div className="h-5 w-px bg-stone-200 hidden md:block mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={onGoToLanding}
            className="hidden md:flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Button>
        </div>

        {/* Center/Right: Drive connection + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Google Drive Status Badge */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenDriveModal}
            className={`gap-2 text-xs font-semibold border transition-all ${
              profile.isDriveConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Nhấn để xem chi tiết quyền Google Drive"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {profile.isDriveConnected ? 'Google Drive: Đã kết nối' : 'Google Drive: Chưa kết nối'}
            </span>
            <span className="sm:hidden">
              {profile.isDriveConnected ? 'Drive: OK' : 'Drive: Chưa nối'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                profile.isDriveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
          </Button>

          {/* Guest View Demo Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenGuestDemo}
            className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900"
            title="Mở album mẫu ở góc nhìn của khách hàng"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Góc nhìn Khách</span>
          </Button>

          {/* Create Album CTA */}
          <Button
            size="sm"
            onClick={onCreateAlbum}
            disabled={isQuotaFull}
            variant={isQuotaFull ? 'secondary' : 'brand'}
            className="gap-2 text-xs sm:text-sm font-bold shadow-xs"
            title={isQuotaFull ? 'Bạn đã đạt tối đa 3 album trong MVP' : 'Tạo album mới từ link Google Drive'}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Tạo Album Mới</span>
            <span className="sm:hidden">Tạo Album</span>
            <Badge variant="outline" className="px-1.5 py-0 text-[10px] bg-black/15 border-0 font-mono text-white">
              {profile.activeAlbumsCount}/{profile.maxAlbumsLimit}
            </Badge>
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 border-l border-stone-200">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-stone-200"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-stone-900 leading-tight">{profile.name}</p>
              <p className="text-[10px] text-stone-400 truncate max-w-[120px]">{profile.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default PhotographerNavbar;
