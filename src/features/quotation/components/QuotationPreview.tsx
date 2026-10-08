import { useLayoutEffect, useRef, useState } from "react";
import type { Quotation } from "../types/quotation.types";
import { quotationThemes } from "./themes";
import { QuotationCanvasDock } from "./QuotationCanvasDock";

type Zoom = { mode: "auto" | "fit" } | { mode: "manual"; scale: number };
export function QuotationPreview({ quote }: { quote: Quotation }) {
  const container = useRef<HTMLDivElement>(null);
  const document = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({
    width: 0,
    height: 0,
    documentHeight: 1120,
    padding: 48,
  });
  const [zoom, setZoom] = useState<Zoom>({ mode: "auto" });
  const [grid, setGrid] = useState(true);
  useLayoutEffect(() => {
    const measure = () => {
      if (
        !container.current ||
        !document.current ||
        !container.current.clientWidth
      )
        return;
      const style = getComputedStyle(container.current);
      const next = {
        width: container.current.clientWidth,
        height: container.current.clientHeight,
        documentHeight: document.current.offsetHeight,
        padding: parseFloat(style.paddingLeft),
      };
      setMetrics((previous) =>
        Object.keys(next).every(
          (key) =>
            next[key as keyof typeof next] ===
            previous[key as keyof typeof next],
        )
          ? previous
          : next,
      );
    };
    const observer = new ResizeObserver(measure);
    if (container.current) observer.observe(container.current);
    if (document.current) observer.observe(document.current);
    measure();
    return () => observer.disconnect();
  }, []);
  const widthScale = Math.max(0.1, (metrics.width - metrics.padding * 2) / 800);
  const scale =
    zoom.mode === "manual"
      ? zoom.scale
      : zoom.mode === "fit"
        ? Math.max(
            0.1,
            Math.min(
              1,
              widthScale,
              (metrics.height - metrics.padding - 96) / metrics.documentHeight,
            ),
          )
        : Math.min(0.85, widthScale);
  const Theme = quotationThemes[quote.themeId].render;
  return (
    <div className="quotation-canvas">
      <div
        ref={container}
        className={`quotation-preview-surface ${grid ? "" : "no-dots"}`}
        aria-label="Canvas báo giá"
        tabIndex={0}
      >
        <div
          className="quotation-preview-frame"
          style={{ width: 800 * scale, height: metrics.documentHeight * scale }}
        >
          <div
            ref={document}
            className="quotation-preview-document"
            style={{ transform: `scale(${scale})` }}
          >
            <Theme quote={quote} />
          </div>
        </div>
      </div>
      <QuotationCanvasDock
        scale={scale}
        height={metrics.documentHeight}
        grid={grid}
        onZoom={(scale) =>
          setZoom({
            mode: "manual",
            scale: Math.max(0.1, Math.min(2, Math.round(scale * 100) / 100)),
          })
        }
        onFit={() => {
          setZoom({ mode: "fit" });
          container.current?.scrollTo({ top: 0, left: 0 });
        }}
        onGrid={() => setGrid((value) => !value)}
      />
    </div>
  );
}
