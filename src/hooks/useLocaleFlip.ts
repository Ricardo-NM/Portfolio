import type { RefObject } from "react";
import { useEffect, useLayoutEffect, useRef } from "react";

export const LOCALE_FLIP_CAPTURE_EVENT = "rn-locale-flip-capture";

const LOCALE_FLIP_DURATION_MS = 220;
const LOCALE_FLIP_EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";

type FlipStyleSnapshot = {
  transform: string;
  transition: string;
  willChange: string;
};

export function useLocaleFlip<T extends HTMLElement>(
  rootRef: RefObject<T | null>,
  dependencies: readonly unknown[],
) {
  const firstRectsRef = useRef(new Map<string, DOMRect>());
  const cleanupTimerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const captureFlipRects = () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      firstRectsRef.current.clear();

      root.querySelectorAll<HTMLElement>("[data-locale-flip-key]").forEach(
        (element) => {
          const key = element.dataset.localeFlipKey;

          if (key) {
            firstRectsRef.current.set(key, element.getBoundingClientRect());
          }
        },
      );
    };

    window.addEventListener(LOCALE_FLIP_CAPTURE_EVENT, captureFlipRects);

    return () => {
      window.removeEventListener(LOCALE_FLIP_CAPTURE_EVENT, captureFlipRects);
    };
  }, [rootRef]);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (
      !root ||
      document.documentElement.dataset.suppressEntryAnimations !== "locale" ||
      firstRectsRef.current.size === 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    if (cleanupTimerRef.current !== null) {
      window.clearTimeout(cleanupTimerRef.current);
    }

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }

    const animatedElements: Array<{
      element: HTMLElement;
      snapshot: FlipStyleSnapshot;
    }> = [];

    root.querySelectorAll<HTMLElement>("[data-locale-flip-key]").forEach(
      (element) => {
        const key = element.dataset.localeFlipKey;
        const firstRect = key ? firstRectsRef.current.get(key) : undefined;

        if (!firstRect) {
          return;
        }

        const lastRect = element.getBoundingClientRect();
        const deltaX = firstRect.left - lastRect.left;
        const deltaY = firstRect.top - lastRect.top;

        if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
          return;
        }

        animatedElements.push({
          element,
          snapshot: {
            transform: element.style.transform,
            transition: element.style.transition,
            willChange: element.style.willChange,
          },
        });

        element.style.setProperty("transition", "none", "important");
        element.style.setProperty(
          "transform",
          `translate3d(${deltaX}px, ${deltaY}px, 0)`,
          "important",
        );
        element.style.willChange = "transform";
      },
    );

    if (animatedElements.length === 0) {
      firstRectsRef.current.clear();
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(() => {
      animatedElements.forEach(({ element }) => {
        element.style.setProperty(
          "transition",
          `transform ${LOCALE_FLIP_DURATION_MS}ms ${LOCALE_FLIP_EASING}`,
          "important",
        );
        element.style.setProperty(
          "transform",
          "translate3d(0, 0, 0)",
          "important",
        );
      });

      animationFrameRef.current = null;
    });

    let restored = false;
    const restoreAnimatedElements = () => {
      if (restored) {
        return;
      }

      animatedElements.forEach(({ element, snapshot }) => {
        element.style.transform = snapshot.transform;
        element.style.transition = snapshot.transition;
        element.style.willChange = snapshot.willChange;
      });

      firstRectsRef.current.clear();
      restored = true;
    };

    cleanupTimerRef.current = window.setTimeout(() => {
      restoreAnimatedElements();
      cleanupTimerRef.current = null;
    }, LOCALE_FLIP_DURATION_MS + 80);

    return () => {
      if (cleanupTimerRef.current !== null) {
        window.clearTimeout(cleanupTimerRef.current);
        cleanupTimerRef.current = null;
      }

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      restoreAnimatedElements();
    };
  }, dependencies);
}
