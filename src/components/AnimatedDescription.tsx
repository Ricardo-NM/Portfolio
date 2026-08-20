import type { CSSProperties } from "react";
import { getAnimatedLetterCount } from "./AnimatedTitle";

type AnimatedDescriptionProps = {
  className?: string;
  startDelay?: number;
  text: string;
  title: string;
};

const TITLE_LETTER_DELAY = 45;
const MOBILE_TITLE_LETTER_DELAY = 20;
const DESCRIPTION_LETTER_DELAY = 12;
const MOBILE_TITLE_ANIMATION_DURATION = 420;
const MOBILE_CONTENT_AFTER_DESCRIPTION_DELAY = 140;
const DESCRIPTION_EMPTY_TITLE_DELAY = 120;
const DESCRIPTION_LAST_TITLE_LETTER_OFFSET = 220;

export function getDescriptionStartDelay(
  title: string,
  titleLetterDelay = TITLE_LETTER_DELAY,
) {
  const letterCount = getAnimatedLetterCount(title);

  if (letterCount === 0) {
    return DESCRIPTION_EMPTY_TITLE_DELAY;
  }

  return (
    (letterCount - 1) * titleLetterDelay + DESCRIPTION_LAST_TITLE_LETTER_OFFSET
  );
}

export function getMobileDescriptionStartDelay(title: string) {
  const letterCount = getAnimatedLetterCount(title);

  if (letterCount === 0) {
    return DESCRIPTION_EMPTY_TITLE_DELAY;
  }

  const titleAnimationDuration =
    (letterCount - 1) * MOBILE_TITLE_LETTER_DELAY +
    MOBILE_TITLE_ANIMATION_DURATION;

  return Math.round(titleAnimationDuration / 2);
}

export function getMobileContentStartDelay(title: string, description: string) {
  const descriptionStartDelay = getMobileDescriptionStartDelay(title);
  const descriptionLetterCount = getAnimatedLetterCount(description);

  if (descriptionLetterCount === 0) {
    return descriptionStartDelay;
  }

  return (
    descriptionStartDelay +
    (descriptionLetterCount - 1) * DESCRIPTION_LETTER_DELAY +
    MOBILE_CONTENT_AFTER_DESCRIPTION_DELAY
  );
}

export default function AnimatedDescription({
  className = "animated-description",
  startDelay,
  text,
  title,
}: AnimatedDescriptionProps) {
  let letterIndex = 0;
  const parts = text.split(/(\s+)/).filter(Boolean);
  const delay = startDelay ?? getDescriptionStartDelay(title);
  const mobileDelay = startDelay ?? getMobileDescriptionStartDelay(title);

  return (
    <p
      className={className}
      style={
        {
          "--description-start-delay": `${delay}ms`,
          "--description-start-delay-mobile": `${mobileDelay}ms`,
        } as CSSProperties
      }
    >
      <span className="screen-reader-text">{text}</span>
      <span aria-hidden="true">
        {parts.map((part, partIndex) => {
          if (/^\s+$/.test(part)) {
            return " ";
          }

          return (
            <span
              className="animated-description-word"
              key={`${part}-${partIndex}`}
            >
              {Array.from(part).map((letter) => {
                const currentIndex = letterIndex;
                letterIndex += 1;

                return (
                  <span
                    className="animated-description-letter"
                    key={`${text}-${currentIndex}-${letter}`}
                    style={
                      {
                        "--letter-index": currentIndex,
                      } as CSSProperties
                    }
                  >
                    {letter}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </p>
  );
}
