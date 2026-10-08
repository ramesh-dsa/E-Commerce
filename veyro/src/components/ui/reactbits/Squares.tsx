"use client";

import React, { useRef, useEffect } from "react";

interface SquaresProps {
  direction?: "diagonal" | "up" | "right" | "down" | "left";
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  className?: string;
}

/**
 * Official React Bits Squares background component.
 * Canvas-based interactive grid that continuously drifts in a customizable direction
 * and dynamically illuminates cells upon cursor hover.
 */
export function Squares({
  direction = "diagonal",
  speed = 0.5,
  borderColor = "rgba(255, 255, 255, 0.05)",
  squareSize = 44,
  hoverFillColor = "rgba(252, 208, 23, 0.18)",
  className = "",
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const mousePos = useRef<{ x: number; y: number } | null>(null);
  const isReducedMotion = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (typeof window !== "undefined") {
      isReducedMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(canvas);
    resizeCanvas();

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      const numSquaresX = Math.ceil(width / squareSize) + 2;
      const numSquaresY = Math.ceil(height / squareSize) + 2;

      const offsetX = gridOffset.current.x % squareSize;
      const offsetY = gridOffset.current.y % squareSize;

      for (let x = -1; x < numSquaresX; x++) {
        for (let y = -1; y < numSquaresY; y++) {
          const squareX = x * squareSize + offsetX;
          const squareY = y * squareSize + offsetY;

          // Check if mouse is hovering over this grid cell
          if (
            mousePos.current &&
            mousePos.current.x >= squareX &&
            mousePos.current.x < squareX + squareSize &&
            mousePos.current.y >= squareY &&
            mousePos.current.y < squareY + squareSize
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);

            // Subtle gold inner border gleam
            ctx.strokeStyle = "rgba(252, 208, 23, 0.4)";
            ctx.lineWidth = 1;
            ctx.strokeRect(squareX, squareY, squareSize, squareSize);
          } else {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(squareX, squareY, squareSize, squareSize);
          }
        }
      }

      // Drift physics (skip if prefers reduced motion)
      if (!isReducedMotion.current) {
        switch (direction) {
          case "right":
            gridOffset.current.x = (gridOffset.current.x + speed) % squareSize;
            break;
          case "left":
            gridOffset.current.x = (gridOffset.current.x - speed) % squareSize;
            break;
          case "up":
            gridOffset.current.y = (gridOffset.current.y - speed) % squareSize;
            break;
          case "down":
            gridOffset.current.y = (gridOffset.current.y + speed) % squareSize;
            break;
          case "diagonal":
            gridOffset.current.x = (gridOffset.current.x + speed * 0.7) % squareSize;
            gridOffset.current.y = (gridOffset.current.y + speed * 0.7) % squareSize;
            break;
        }
      }

      requestRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    requestRef.current = requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block pointer-events-auto ${className}`}
      aria-hidden="true"
    />
  );
}
