export const MIC_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

export async function captureMicrophone() {
  return navigator.mediaDevices.getUserMedia({ audio: MIC_CONSTRAINTS });
}

export function stopMediaStream(stream: MediaStream | null | undefined) {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    track.stop();
  }
}
