import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import type { TechnologyItem } from "./types";

const VISIBLE_LOGO_COUNT = 3;
const LOGO_CHANGE_INTERVAL_MS = 3_400;
const technologyIconCache = new Map<string, HTMLImageElement>();

type TechnologyLogoCarouselProps = {
  items: TechnologyItem[];
};

function getTechnologyIconUrl(icon: string) {
  return `/assets/icons/Technologies/${icon}`;
}

function preloadTechnologyIcons(items: TechnologyItem[]) {
  items.forEach(({ icon }) => {
    const iconUrl = getTechnologyIconUrl(icon);

    if (technologyIconCache.has(iconUrl)) {
      return;
    }

    const image = new Image();
    image.decoding = "async";
    image.src = iconUrl;
    technologyIconCache.set(iconUrl, image);
  });
}

function TechnologyLogo({ item }: { item: TechnologyItem }) {
  return (
    <span
      aria-label={item.label}
      className="technology-carousel-logo"
      data-label={item.label}
      role="img"
      style={
        {
          "--technology-brand-color": item.color,
          "--technology-brand-color-dark": item.darkColor ?? item.color,
          "--technology-brand-color-light": item.lightColor ?? item.color,
          "--technology-icon-url": `url("${getTechnologyIconUrl(item.icon)}")`,
        } as CSSProperties
      }
    >
      <span aria-hidden="true" className="technology-carousel-icon" />
    </span>
  );
}

export default function TechnologyLogoCarousel({
  items,
}: TechnologyLogoCarouselProps) {
  const [step, setStep] = useState(0);
  const positions = useMemo(
    () => Array.from({ length: Math.min(VISIBLE_LOGO_COUNT, items.length) }),
    [items.length],
  );

  useEffect(() => {
    preloadTechnologyIcons(items);
  }, [items]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStep((currentStep) => currentStep + 1);
    }, LOGO_CHANGE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="technology-logo-carousel">
      {positions.map((_, positionIndex) => {
        const itemIndex =
          (positionIndex - (step % items.length) + items.length) % items.length;
        const item = items[itemIndex];

        return (
          <div className="technology-logo-carousel-column" key={positionIndex}>
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{
                  filter: "blur(0px)",
                  opacity: 1,
                  y: "0%",
                }}
                className="technology-logo-carousel-frame"
                exit={{
                  filter: "blur(6px)",
                  opacity: 0,
                  y: "-22%",
                }}
                initial={{
                  filter: "blur(8px)",
                  opacity: 0,
                  y: "18%",
                }}
                key={item.label}
                transition={{
                  damping: 20,
                  delay: positionIndex * 0.08,
                  mass: 1,
                  stiffness: 300,
                  type: "spring",
                }}
              >
                <TechnologyLogo item={item} />
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
