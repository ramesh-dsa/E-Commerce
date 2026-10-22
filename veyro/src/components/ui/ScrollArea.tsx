"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  viewportClassName?: string;
  autoHide?: boolean;
}

export interface ScrollAreaRef {
  viewport: HTMLDivElement | null;
  scrollTo: (options: ScrollToOptions) => void;
  scrollTop: number;
  scrollHeight: number;
}

/**
 * ScrollArea: A scroll container with scrollbars that look the same in every browser.
 * The custom floating scrollbar shows smoothly while the pointer is over the area or actively scrolling.
 */
export const ScrollArea = forwardRef<ScrollAreaRef, ScrollAreaProps>(
  function ScrollArea(
    {
      className = "",
      viewportClassName = "",
      children,
      autoHide = true,
      ...props
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const [canScrollY, setCanScrollY] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    const isDraggingRef = useRef(false);
    const dragStartY = useRef(0);
    const dragStartScrollTop = useRef(0);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useImperativeHandle(ref, () => ({
      viewport: viewportRef.current,
      scrollTo: (options: ScrollToOptions) => viewportRef.current?.scrollTo(options),
      get scrollTop() {
        return viewportRef.current?.scrollTop || 0;
      },
      set scrollTop(val: number) {
        if (viewportRef.current) viewportRef.current.scrollTop = val;
      },
      get scrollHeight() {
        return viewportRef.current?.scrollHeight || 0;
      },
    }));

    // Update thumb position and dimensions directly on DOM without re-rendering (User Rule 7)
    const updateThumb = useCallback(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const { clientHeight, scrollHeight, scrollTop } = viewport;

      if (scrollHeight <= clientHeight) {
        setCanScrollY(false);
        return;
      }

      setCanScrollY(true);

      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!track || !thumb) return;

      const trackHeight = track.clientHeight;
      if (trackHeight === 0) return;

      const ratio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(24, Math.round(trackHeight * ratio));
      const availableScroll = scrollHeight - clientHeight;
      const availableTrack = trackHeight - thumbHeight;

      const scrollRatio = availableScroll > 0 ? scrollTop / availableScroll : 0;
      const thumbTop = Math.round(scrollRatio * availableTrack);

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translate3d(0, ${thumbTop}px, 0)`;
    }, []);

    // Handle scroll
    const handleScroll = useCallback(() => {
      updateThumb();

      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 750);
    }, [updateThumb]);

    // Handle track click (jump to scroll position)
    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === thumbRef.current) return;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!viewport || !track || !thumb) return;

      const trackRect = track.getBoundingClientRect();
      const clickY = e.clientY - trackRect.top;
      const trackHeight = trackRect.height;
      const thumbHeight = thumb.clientHeight;

      const targetTop = clickY - thumbHeight / 2;
      const availableTrack = trackHeight - thumbHeight;
      const availableScroll = viewport.scrollHeight - viewport.clientHeight;

      const targetScrollRatio = Math.max(0, Math.min(1, targetTop / availableTrack));
      viewport.scrollTo({
        top: targetScrollRatio * availableScroll,
        behavior: "smooth",
      });
    };

    // Handle thumb drag start
    const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartY.current = e.clientY;
      dragStartScrollTop.current = viewportRef.current?.scrollTop || 0;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDraggingRef.current || !viewportRef.current || !trackRef.current || !thumbRef.current) return;

        const deltaY = moveEvent.clientY - dragStartY.current;
        const trackHeight = trackRef.current.clientHeight;
        const thumbHeight = thumbRef.current.clientHeight;
        const availableTrack = trackHeight - thumbHeight;
        const availableScroll = viewportRef.current.scrollHeight - viewportRef.current.clientHeight;

        if (availableTrack > 0) {
          const scrollDelta = (deltaY / availableTrack) * availableScroll;
          viewportRef.current.scrollTop = dragStartScrollTop.current + scrollDelta;
        }
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    // ResizeObserver to track layout changes
    useEffect(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const ro = new ResizeObserver(() => {
        updateThumb();
      });

      ro.observe(viewport);
      if (viewport.firstElementChild) {
        ro.observe(viewport.firstElementChild);
      }

      updateThumb();

      return () => {
        ro.disconnect();
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }, [updateThumb]);

    // Position thumb as soon as track mounts
    useEffect(() => {
      if (canScrollY) {
        requestAnimationFrame(updateThumb);
      }
    }, [canScrollY, updateThumb]);

    const showScrollbar = !autoHide || isHovered || isDragging || isScrolling;

    return (
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative overflow-hidden flex flex-col group ${className}`}
        {...props}
      >
        {/* Scrollable Viewport with hidden native scrollbar */}
        <div
          ref={viewportRef}
          onScroll={handleScroll}
          className={`flex-1 min-h-0 w-full overflow-y-auto overscroll-contain max-h-[inherit] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${viewportClassName}`}
        >
          {children}
        </div>

        {/* Custom Overlay Scrollbar Track & Thumb */}
        {canScrollY && (
          <div
            ref={trackRef}
            onClick={handleTrackClick}
            className={`absolute right-0.5 top-1 bottom-1 w-2 z-30 transition-opacity duration-200 pointer-events-auto rounded-full ${
              showScrollbar ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              ref={thumbRef}
              onMouseDown={handleThumbMouseDown}
              className="w-1.5 mx-auto rounded-full bg-white/25 hover:bg-white/40 active:bg-white/50 cursor-pointer transition-colors"
              style={{
                willChange: "transform",
              }}
            />
          </div>
        )}
      </div>
    );
  }
);
