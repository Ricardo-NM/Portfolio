import type { CSSProperties } from "react";
import { getAnimatedLetterCount } from "./AnimatedTitle";

type AnimatedDescriptionProps = {
  className?: string;
  startDelay?: number;
  text: string;
  title: string;
};

const TITLE_LETTER_DELAY = 45;
const DESCRIPTION_EMPTY_TITLE_DELAY = 120;
const DESCRIPTION_LAST_TITLE_LETTER_OFFSET = 220;

export function getDescriptionStartDelay(title: string) {
  const letterCount = getAnimatedLetterCount(title);

  if (letterCount === 0) {
    return DESCRIPTION_EMPTY_TITLE_DELAY;
  }

  return (letterCount - 1) * TITLE_LETTER_DELAY + DESCRIPTION_LAST_TITLE_LETTER_OFFSET;
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

  return (
    <p
      className={className}
      style={
        {
          "--description-start-delay": `${delay}ms`,
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
