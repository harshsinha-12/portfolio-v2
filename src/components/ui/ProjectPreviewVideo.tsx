"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { track } from "@/lib/analytics";

type ProjectPreviewVideoProps = {
  video: string;
  poster: string;
  title: string;
  projectId: string;
  sizes: string;
};

function useProjectPreviewVideo(projectId: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover)");
    const updateCanHover = () => setCanHover(media.matches);
    updateCanHover();
    media.addEventListener("change", updateCanHover);
    return () => media.removeEventListener("change", updateCanHover);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        video.preload = "auto";
        video.load();
        observer.disconnect();
      },
      { rootMargin: "200px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const stopVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
  }, []);

  const playVideo = useCallback(
    async (trigger: "hover" | "tap") => {
      const video = videoRef.current;
      if (!video) return;
      try {
        await video.play();
        setIsPlaying(true);
        track("project_video_play", { project_id: projectId, trigger });
      } catch {
        setIsPlaying(false);
      }
    },
    [projectId],
  );

  const toggleVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      stopVideo();
      return;
    }
    void playVideo("tap");
  }, [playVideo, stopVideo]);

  const onMouseEnter = canHover ? () => void playVideo("hover") : undefined;
  const onMouseLeave = canHover ? stopVideo : undefined;
  const onClick = canHover ? undefined : toggleVideo;

  return {
    containerRef,
    videoRef,
    isPlaying,
    canHover,
    onMouseEnter,
    onMouseLeave,
    onClick,
    toggleVideo,
  };
}

export function ProjectPreviewVideo({
  video,
  poster,
  title,
  projectId,
  sizes,
}: ProjectPreviewVideoProps) {
  const {
    containerRef,
    videoRef,
    isPlaying,
    canHover,
    onMouseEnter,
    onMouseLeave,
    onClick,
    toggleVideo,
  } = useProjectPreviewVideo(projectId);

  return (
    <div
      ref={containerRef}
      className={`relative mb-1.5 aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-md)] border-2 border-[var(--color-sticker-outline)] bg-[var(--color-paper-muted)]${
        canHover ? "" : " cursor-pointer"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onKeyDown={
        canHover
          ? undefined
          : (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleVideo();
              }
            }
      }
      role={canHover ? undefined : "button"}
      tabIndex={canHover ? undefined : 0}
      aria-label={canHover ? undefined : `Play ${title} demo`}
    >
      <Image src={poster} alt="" fill sizes={sizes} className="object-cover" />
      <video
        ref={videoRef}
        src={video}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-label={`${title} demo`}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
