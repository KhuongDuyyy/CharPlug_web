"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

export function useSafeBack(fallbackHref: string) {
  const router = useRouter();

  return useCallback(() => {
    if (typeof window === "undefined") {
      router.replace(fallbackHref, { scroll: false });
      return;
    }

    const { history, location } = window;
    const referrer = document.referrer;

    if (history.length > 1) {
      if (!referrer) {
        router.back();
        return;
      }

      try {
        const referrerUrl = new URL(referrer);
        if (referrerUrl.origin === location.origin) {
          router.back();
          return;
        }
      } catch {
        router.back();
        return;
      }
    }

    router.replace(fallbackHref, { scroll: false });
  }, [fallbackHref, router]);
}
