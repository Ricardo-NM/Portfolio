import type { CSSProperties } from "react";
import { ChevronDown } from "lucide-react";

type HomeProjectGalleryTitleProps = {
  id: string;
  hint: string;
  hintVisible: boolean;
  text: string;
};

export default function HomeProjectGalleryTitle({
  hint,
  hintVisible,
  id,
  text,
}: HomeProjectGalleryTitleProps) {
  let letterIndex = 0;
  const parts = text.split(/(\s+)/).filter(Boolean);

  return (
    <div className="home-project-gallery-heading">
      <h2 id={id} className="home-project-gallery-title" aria-label={text}>
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
      </h2>

      <p className="home-project-gallery-hint" data-visible={hintVisible}>
        <span className="home-project-gallery-hint-content">
          <span>{hint}</span>
          <ChevronDown aria-hidden="true" size={15} strokeWidth={1.8} />
        </span>
      </p>
    </div>
  );
}
