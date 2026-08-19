type HomeProjectMediaProps = {
  alt: string;
  imageSrc: string;
  isVideoEnabled: boolean;
  loading?: "eager" | "lazy";
  videoSrc?: string;
};

export default function HomeProjectMedia({
  alt,
  imageSrc,
  isVideoEnabled,
  loading = "lazy",
  videoSrc,
}: HomeProjectMediaProps) {
  if (videoSrc && isVideoEnabled) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={imageSrc}
        aria-label={alt}
      >
        <source src={videoSrc} type="video/webm" />
      </video>
    );
  }

  return <img src={imageSrc} alt={alt} loading={loading} />;
}
