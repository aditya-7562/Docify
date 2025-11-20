"use client";

import { useEffect, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useStorage, useMutation } from "@liveblocks/react";

import { RIGHT_MARGIN_DEFAULT, LEFT_MARGIN_DEFAULT } from "@/constants/margins";

const markers = Array.from({ length: 83 }, (_, i) => i);
const MINIMUM_SPACE = 100;

export const Ruler = () => {
  // Liveblocks-backed margins (same shape as before)
  const leftMargin =
    useStorage((root) => root.leftMargin) ?? LEFT_MARGIN_DEFAULT;
  const setLeftMargin = useMutation(({ storage }, position: number) => {
    storage.set("leftMargin", position);
  }, []);

  const rightMargin =
    useStorage((root) => root.rightMargin) ?? RIGHT_MARGIN_DEFAULT;
  const setRightMargin = useMutation(({ storage }, position: number) => {
    storage.set("rightMargin", position);
  }, []);

  // Actual pixel width of the ruler track
  const [pageWidth, setPageWidth] = useState<number>(816);
  const rulerRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState<"left" | "right" | null>(null);

  // Measure the real width of the inner container
  useEffect(() => {
    const el = rulerRef.current?.querySelector<HTMLDivElement>("#ruler-inner");
    if (!el) return;

    const updateWidth = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setPageWidth(w);
    };

    updateWidth();

    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !rulerRef.current) return;

    const container =
      rulerRef.current.querySelector<HTMLDivElement>("#ruler-inner");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;

    // Clamp to [0, pageWidth]
    const x = Math.max(0, Math.min(pageWidth, relativeX));

    if (dragging === "left") {
      const maxLeft = pageWidth - rightMargin - MINIMUM_SPACE;
      const newLeft = Math.min(x, Math.max(0, maxLeft));
      setLeftMargin(newLeft);
    } else if (dragging === "right") {
      // rightMargin is stored as distance from right edge
      const newRight = Math.max(pageWidth - x, 0);
      const maxRight = pageWidth - (leftMargin + MINIMUM_SPACE);
      const constrained = Math.min(newRight, Math.max(0, maxRight));
      setRightMargin(constrained);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <div
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="w-full max-w-[816px] mx-auto h-6 border-b border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur relative select-none print:hidden"
    >
      <div
        id="ruler-inner"
        className="relative h-full w-full mx-auto"
        // This border is useful while debugging; remove if you want
        // style={{ outline: "1px solid red" }}
      >
        {/* Left marker: stored as distance from left */}
        <Marker
          x={leftMargin}
          isDragging={dragging === "left"}
          onMouseDown={() => setDragging("left")}
        />

        {/* Right marker: convert stored distance-from-right -> left coordinate */}
        <Marker
          x={pageWidth - rightMargin}
          isDragging={dragging === "right"}
          onMouseDown={() => setDragging("right")}
        />

        {/* Tick marks */}
        <div className="absolute inset-0">
          {markers.map((marker) => {
            const position = (marker * pageWidth) / (markers.length - 1);

            return (
              <div
                key={marker}
                className="absolute bottom-0"
                style={{ left: `${position}px` }}
              >
                {marker % 10 === 0 ? (
                  <>
                    <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500" />
                    <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                      {marker / 10 + 1}
                    </span>
                  </>
                ) : marker % 5 === 0 ? (
                  <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                ) : (
                  <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface MarkerProps {
  x: number;
  isDragging: boolean;
  onMouseDown: () => void;
}

const Marker = ({ x, isDragging, onMouseDown }: MarkerProps) => {
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5]"
      style={{
        left: `${x}px`,
        transform: "translateX(-50%)",
      }}
      onMouseDown={onMouseDown}
    >
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
      {isDragging && (
        <div
          className="absolute left-1/2 top-4 transform -translate-x-1/2"
          style={{
            height: "100vh",
            width: "1px",
            transform: "scaleX(0.5)",
            backgroundColor: "#3b72f6",
          }}
        />
      )}
    </div>
  );
};
