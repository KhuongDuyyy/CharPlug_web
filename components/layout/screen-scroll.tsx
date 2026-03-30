"use client";

import { useEffect, useRef } from "react";

import { useMockApp } from "@/providers/mock-app-provider";
import { cn } from "@/lib/utils/cn";

export function ScreenScroll({
  id,
  children,
  className,
  contentClassName,
  restoreToken,
  initialScrollTop
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  restoreToken?: string | number;
  initialScrollTop?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const { getScrollPosition, setScrollPosition } = useMockApp();

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const nextScrollTop = initialScrollTop ?? getScrollPosition(id);
    node.scrollTop = nextScrollTop;
    setScrollPosition(id, nextScrollTop);
  }, [getScrollPosition, id, initialScrollTop, restoreToken, setScrollPosition]);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const handleScroll = () => {
      setScrollPosition(id, node.scrollTop);
    };

    const handlePageHide = () => {
      setScrollPosition(id, node.scrollTop);
    };

    node.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      setScrollPosition(id, node.scrollTop);
      node.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [id, setScrollPosition]);

  return (
    <main ref={ref} className={cn("cp-scroll h-full overflow-y-auto", className)}>
      <div className={cn("flex min-h-full flex-col gap-4 px-5 pt-5 pb-24", contentClassName)}>{children}</div>
    </main>
  );
}
