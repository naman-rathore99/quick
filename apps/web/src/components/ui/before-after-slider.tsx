"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const onInteractionStart = (clientX: number) => {
    setIsDragging(true);
    handleMove(clientX);
  };

  const onInteractionEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", onInteractionEnd);
      window.addEventListener("touchend", onInteractionEnd);
    } else {
      window.removeEventListener("mouseup", onInteractionEnd);
      window.removeEventListener("touchend", onInteractionEnd);
    }
    return () => {
      window.removeEventListener("mouseup", onInteractionEnd);
      window.removeEventListener("touchend", onInteractionEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden rounded-xl bg-muted cursor-ew-resize select-none",
        className
      )}
      onMouseDown={(e) => onInteractionStart(e.clientX)}
      onMouseMove={onMouseMove}
      onTouchStart={(e) => onInteractionStart(e.touches[0].clientX)}
      onTouchMove={onTouchMove}
    >
      {/* Background (After Image / Clean) */}
      <img
        src={afterImage}
        alt="After"
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
        draggable={false}
      />

      {/* Foreground (Before Image / Dirty) clipped */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt="Before"
          className="absolute inset-0 h-[1000px] max-h-full w-[1000px] max-w-full object-cover object-center pointer-events-none"
          draggable={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-[1px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.5)] z-10 pointer-events-none transition-transform duration-75"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
      </div>
    </div>
  );
}
