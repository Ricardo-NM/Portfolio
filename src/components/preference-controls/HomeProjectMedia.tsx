import type { MouseEvent } from "react";

type HomeProjectMediaProps = {
  alt: string;
  imageSrc: string;
  isVideoEnabled: boolean;
  loading?: "eager" | "lazy";
  playback?: "auto" | "hover";
  videoSrc?: string;
};

export default function HomeProjectMedia({
  alt,
  imageSrc,
  isVideoEnabled,
  loading = "lazy",
  playback = "auto",
  videoSrc,
}: HomeProjectMediaProps) {
  if (videoSrc && isVideoEnabled) {
    const handleMouseEnter = (event: MouseEvent<HTMLVideoElement>) => {
      if (playback === "hover") {
        void event.currentTarget.play();
      }
    };

    const handleMouseLeave = (event: MouseEvent<HTMLVideoElement>) => {
      if (playback === "hover") {
        event.currentTarget.pause();
      }
    };

    return (
      <video
        autoPlay={playback === "auto"}
        muted
        loop
        playsInline
        preload="metadata"
        poster={imageSrc}
        aria-label={alt}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <source src={videoSrc} type="video/webm" />
      </video>
    );
  }

  return <img src={imageSrc} alt={alt} loading={loading} />;
}
