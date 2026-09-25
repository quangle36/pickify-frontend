import { FC } from "react";
import { Link } from "@tanstack/react-router";
import type { PhotographerProfile } from "@/features/photographer/types/album.types";
import {
  Heart,
  LogOut,
  ChevronDown,
} from "lucide-react";
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
  onLogout?: () => void;
}

export const PhotographerNavbar: FC<PhotographerNavbarProps> = ({
  profile,
  onLogout,
}) => {
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
            <span className="hidden text-left text-base font-extrabold leading-tight tracking-tight text-stone-900 sm:block">
              Pickify
            </span>
          </Link>

          <div className="h-5 w-px bg-stone-200 hidden md:block mx-1" />
        </div>

        {/* Center/Right: Drive connection + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
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
            <DropdownMenuContent
              align="end"
              className="w-56 p-1.5 shadow-xl border-stone-200"
            >
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
