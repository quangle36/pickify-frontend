import { File, Grid3X3, Maximize2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuotationCanvasDock({
  scale,
  height,
  grid,
  onZoom,
  onFit,
  onGrid,
}: {
  scale: number;
  height: number;
  grid: boolean;
  onZoom: (scale: number) => void;
  onFit: () => void;
  onGrid: () => void;
}) {
  return (
    <div
      className="quotation-canvas-dock"
      role="toolbar"
      aria-label="Điều khiển bản xem trước"
    >
      <span className="quotation-artboard-label">
        <File aria-hidden="true" />
        <span>Artboard · 800 × {height}</span>
      </span>
      <div className="quotation-zoom-controls">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Thu nhỏ"
          disabled={scale <= 0.1}
          onClick={() => onZoom(scale - 0.1)}
        >
          <Minus />
        </Button>
        <output aria-label="Mức thu phóng">{Math.round(scale * 100)}%</output>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Phóng to"
          disabled={scale >= 2}
          onClick={() => onZoom(scale + 0.1)}
        >
          <Plus />
        </Button>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onFit}
        aria-label="Vừa khung xem trước"
      >
        <Maximize2 />
        Fit
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onZoom(1)}
        aria-label="Kích thước thật 100%"
      >
        100%
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Chấm Figma"
        aria-pressed={grid}
        onClick={onGrid}
      >
        <Grid3X3 />
        <span className="quotation-grid-label">Chấm Figma</span>
      </Button>
    </div>
  );
}
