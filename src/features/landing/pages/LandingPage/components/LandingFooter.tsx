import { FC } from "react";
import { LumipicLogo } from "./LumipicLogo";

export const LandingFooter: FC = () => {
  return (
    <footer className="lp-footer">
      <div className="lp-wrap lp-footer-inner">
        <LumipicLogo size={30} />
        <nav aria-label="Chân trang">
          <a href="/huong-dan/gui-anh-google-drive">Hướng dẫn</a>
          <a href="/dashboard">Demo</a>
          <a href="/privacy">Quyền riêng tư</a>
          <a href="/terms">Điều khoản</a>
          <span>© 2026</span>
        </nav>
      </div>
    </footer>
  );
};
export default LandingFooter;
