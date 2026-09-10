"use client";

import { useEffect, useState } from "react";

export const VOICE_BAR_COUNT = 18;

function emptyLevels() {
  return Array.from({ length: VOICE_BAR_COUNT }, () => 0);
}

export function useVoiceLevels(stream: MediaStream | null, enabled: boolean) {
  const [levels, setLevels] = useState<number[]>(emptyLevels);

  useEffect(() => {
    if (!stream || !enabled) {
      return;
    }

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.68;
    source.connect(analyser);

    const buffer = new Uint8Array(analyser.fftSize);
    let frame = 0;
    const slice = Math.floor(buffer.length / VOICE_BAR_COUNT);

    const tick = () => {
      analyser.getByteTimeDomainData(buffer);
      const next = emptyLevels();

      for (let index = 0; index < VOICE_BAR_COUNT; index += 1) {
        let sum = 0;
        const start = index * slice;
        for (let offset = 0; offset < slice; offset += 1) {
          const sample = ((buffer[start + offset] ?? 128) - 128) / 128;
          sum += sample * sample;
        }
        const rms = Math.sqrt(sum / Math.max(slice, 1));
        const shaped = Math.min(1, rms * 4.4);
        const center = 1 - Math.abs(index - (VOICE_BAR_COUNT - 1) / 2) / (VOICE_BAR_COUNT / 2);
        next[index] = Math.min(1, shaped * (0.55 + center * 0.7));
      }

      setLevels(next);
      frame = window.requestAnimationFrame(tick);
    };

    void audioContext.resume().then(() => {
      frame = window.requestAnimationFrame(tick);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      source.disconnect();
      void audioContext.close();
      setLevels(emptyLevels());
    };
  }, [enabled, stream]);

  return levels;
}
