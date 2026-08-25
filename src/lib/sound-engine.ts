let audioContext: AudioContext | null = null;
const bufferCache = new Map<string, AudioBuffer>();

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export async function decodeAudioData(dataUri: string): Promise<AudioBuffer> {
  const cached = bufferCache.get(dataUri);
  if (cached) return cached;

  const ctx = getAudioContext();
  const response = await fetch(dataUri);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  bufferCache.set(dataUri, audioBuffer);
  return audioBuffer;
}

export interface PlaySoundOptions {
  volume?: number;
  playbackRate?: number;
  onEnd?: () => void;
}

export interface SoundPlayback {
  stop: () => void;
}

function startPlayback(
  ctx: AudioContext,
  buffer: AudioBuffer,
  options: PlaySoundOptions,
): SoundPlayback {
  const { volume = 1, playbackRate = 1, onEnd } = options;
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();

  source.buffer = buffer;
  source.playbackRate.value = playbackRate;
  gain.gain.value = volume;

  source.connect(gain);
  gain.connect(ctx.destination);

  source.onended = () => {
    onEnd?.();
  };

  source.start(0);

  return {
    stop: () => {
      try {
        source.stop();
      } catch {
        // No-op if already stopped.
      }
    },
  };
}

/** Play immediately if the buffer is already decoded. Returns null if it still needs decoding. */
export function playSoundNow(
  dataUri: string,
  options: PlaySoundOptions = {},
): SoundPlayback | null {
  const buffer = bufferCache.get(dataUri);
  if (!buffer) return null;

  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    void ctx.resume().then(() => {
      startPlayback(ctx, buffer, options);
    });
    return { stop: () => {} };
  }

  return startPlayback(ctx, buffer, options);
}

export async function playSound(
  dataUri: string,
  options: PlaySoundOptions = {},
): Promise<SoundPlayback> {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const buffer = await decodeAudioData(dataUri);
  return startPlayback(ctx, buffer, options);
}
