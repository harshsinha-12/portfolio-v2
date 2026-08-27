import Image from "next/image";
import type { CSSProperties } from "react";

type NoteConfig = {
  src: string;
  width: number;
  height: number;
  dx: string;
  dy: string;
  rot: string;
  scale: number;
  dur: string;
  delay: string;
};

// Notes emit from the left edge of the headphones (see .note-burst-item in
// globals.css) and drift out sideways. sticker-headphones rotates 11deg
// clockwise (src/data/portfolio.ts), which carries this layer with it, so dx
// stays negative throughout and dy is kept small (a near-horizontal local
// vector stays near-horizontal on screen after the rotation).
//
// A pool of 6 with each note's own cycle spending a brief stretch invisible
// (see the note-drift keyframe's 68%-100% hold in globals.css) keeps this
// from reading as a constant swarm while still surfacing a note often --
// delays are spread roughly a third of a cycle apart, tight enough that a
// new one appears before the last one fully clears, and dx/dy carry them
// well out for a free-feeling drift.
const NOTES: NoteConfig[] = [
  { src: "/assets/notes/note-1.webp", width: 96, height: 137, dx: "-2.8rem", dy: "-1.8rem", rot: "-20deg", scale: 0.85, dur: "3.8s", delay: "0s" },
  { src: "/assets/notes/note-4.webp", width: 96, height: 96, dx: "-2.0rem", dy: "0.7rem", rot: "12deg", scale: 0.7, dur: "4.2s", delay: "0.6s" },
  { src: "/assets/notes/note-2.webp", width: 96, height: 142, dx: "-3.2rem", dy: "-0.5rem", rot: "-10deg", scale: 0.95, dur: "4.0s", delay: "1.2s" },
  { src: "/assets/notes/note-3.webp", width: 96, height: 98, dx: "-1.8rem", dy: "-2.3rem", rot: "16deg", scale: 0.78, dur: "4.4s", delay: "1.8s" },
  { src: "/assets/notes/note-1.webp", width: 96, height: 137, dx: "-2.5rem", dy: "0.9rem", rot: "-8deg", scale: 0.88, dur: "3.6s", delay: "2.4s" },
  { src: "/assets/notes/note-2.webp", width: 96, height: 142, dx: "-3.0rem", dy: "-1.2rem", rot: "8deg", scale: 0.8, dur: "4.0s", delay: "3.0s" },
];

export function NoteBurst() {
  return (
    <div className="note-burst" aria-hidden="true">
      {NOTES.map((note, index) => (
        <span
          key={index}
          className="note-burst-item"
          style={{
            "--note-dx": note.dx,
            "--note-dy": note.dy,
            "--note-rot": note.rot,
            "--note-scale": note.scale,
            "--note-dur": note.dur,
            "--note-delay": note.delay,
          } as CSSProperties}
        >
          <Image
            src={note.src}
            alt=""
            width={note.width}
            height={note.height}
            sizes="20px"
            unoptimized
            draggable={false}
            className="h-auto w-full"
          />
        </span>
      ))}
    </div>
  );
}
