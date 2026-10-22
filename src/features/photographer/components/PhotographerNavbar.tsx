import { FC } from "react";
import { LumipicLogo } from "@/components/ui/lumipic-logo";
import { Link } from "@tanstack/react-router";
import type { PhotographerProfile } from "@/features/photographer/types/album.types";
import {
  LogOut,
  ChevronDown,
  ShieldCheck,
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
    <header className="photographer-navbar sticky top-0 z-30 border-b border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Landing Link */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-hidden"
            title="Quay về Trang chủ Landing Page"
          >
            <LumipicLogo />
          </Link>


        </div>

        {/* Center/Right: Drive connection + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex min-h-9 cursor-pointer items-center gap-2 rounded-xl p-1 text-left outline-none hover:bg-stone-100 transition-colors"
                title="Tài khoản cá nhân"
              >
                {profile.avatarUrl ? <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-8 w-8 rounded-[10px] object-cover"
                /> : <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-[10px] bg-stone-100 text-xs font-medium text-stone-600">{profile.name.slice(0, 1).toUpperCase()}</span>}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-normal text-stone-600 leading-tight">
                    {profile.name}
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
              <DropdownMenuItem asChild><Link to="/dashboard">Album của bạn</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/dashboard/quotes">Báo giá</Link></DropdownMenuItem>
              {profile.role === 'admin' && <DropdownMenuItem asChild><Link to="/dashboard/admin"><ShieldCheck className="mr-2 h-4 w-4" />Quản lý tài khoản</Link></DropdownMenuItem>}
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
