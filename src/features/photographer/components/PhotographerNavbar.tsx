import { FC } from "react";
import { Link } from "@tanstack/react-router";
import type { PhotographerProfile } from "@/features/photographer/types/album.types";
import { Heart, Plus, Eye, Home, Cloud, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface PhotographerNavbarProps {
  profile: PhotographerProfile;
  onCreateAlbum: () => void;
  onOpenGuestDemo: () => void;
  onOpenDriveModal: () => void;
  onLogout?: () => void;
}

export const PhotographerNavbar: FC<PhotographerNavbarProps> = ({
  profile,
  onCreateAlbum,
  onOpenGuestDemo,
  onOpenDriveModal,
  onLogout,
}) => {
  const isQuotaFull = profile.activeAlbumsCount >= profile.maxAlbumsLimit;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Landing Link */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
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
          </Link>

          <div className="h-5 w-px bg-stone-200 hidden md:block mx-1" />

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900"
          >
            <Link to="/">
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </Link>
          </Button>
        </div>

        {/* Center/Right: Drive connection + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Google Drive Status Badge */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenDriveModal}
            className="gap-2 text-xs font-semibold border bg-stone-50 text-stone-700"
            title="Hướng dẫn chia sẻ folder Drive public"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Drive public</span>
          </Button>

          {/* Guest View Demo Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenGuestDemo}
            className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900"
            title="Mở album hiện tại ở góc nhìn của khách hàng"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Góc nhìn Khách</span>
          </Button>

          {/* Create Album CTA */}
          <Button
            size="sm"
            onClick={onCreateAlbum}
            disabled={isQuotaFull}
            variant={isQuotaFull ? "secondary" : "brand"}
            className="gap-2 text-xs sm:text-sm font-bold shadow-xs"
            title={
              isQuotaFull
                ? "Bạn đã đạt tối đa 3 album trong MVP"
                : "Tạo album mới từ link Google Drive"
            }
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Tạo Album Mới</span>
            <span className="sm:hidden">Tạo Album</span>
            <Badge
              variant="outline"
              className="px-1.5 py-0 text-[10px] bg-black/15 border-0 font-mono text-white"
            >
              {profile.activeAlbumsCount}/{profile.maxAlbumsLimit}
            </Badge>
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 pl-2 border-l border-stone-200 hover:opacity-90 transition-all outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 rounded-xl p-1 -m-1 text-left cursor-pointer group"
                title="Tài khoản cá nhân"
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-stone-200 group-hover:ring-brand-500 transition-all"
                />
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-stone-900 leading-tight">
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-stone-400 truncate max-w-[120px]">
                    {profile.email}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl border-stone-200">
              <DropdownMenuLabel className="font-normal px-2.5 py-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-bold text-stone-900 leading-none truncate">
                    {profile.name}
                  </p>
                  <p className="text-[11px] text-stone-500 leading-none truncate">
                    {profile.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer font-medium"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
export default PhotographerNavbar;
