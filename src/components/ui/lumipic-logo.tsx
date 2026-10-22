/** Two photo cards tilted into a heart, beside the "lumipic" wordmark. */
import "@/lib/brand/logo.css";

export function LumipicLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`lumipic-logo ${className}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <g transform="translate(32 53) scale(1.22)">
          <path d="M-20 0 V-22 A10 10 0 0 1 0 -22 V0 Z" transform="rotate(45)" fill="currentColor" opacity="0.5" />
          <g transform="rotate(-45)">
            <path d="M0 0 V-22 A10 10 0 0 1 20 -22 V0 Z" fill="currentColor" />
            <circle cx="10" cy="-22" r="4" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
      lumipic
    </span>
  );
}
