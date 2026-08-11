import type { CSSProperties } from "react";

type AnimatedTitleProps = {
  id: string;
  text: string;
};

export function getAnimatedLetterCount(text: string) {
  return Array.from(text).filter((letter) => !/\s/.test(letter)).length;
}

export default function AnimatedTitle({ id, text }: AnimatedTitleProps) {
  let letterIndex = 0;
  const parts = text.split(/(\s+)/).filter(Boolean);

  return (
    <h1 id={id} className="animated-title" aria-label={text}>
      {parts.map((part, partIndex) => {
        if (/^\s+$/.test(part)) {
          return " ";
        }

        return (
          <span
            aria-hidden="true"
            className="animated-title-word"
            key={`${part}-${partIndex}`}
          >
            {Array.from(part).map((letter) => {
              const currentIndex = letterIndex;
              letterIndex += 1;

              return (
                <span
                  className="animated-title-letter"
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
    </h1>
  );
}
