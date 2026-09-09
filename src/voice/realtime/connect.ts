import {
  functionCallOutputEvent,
  pageContextEvent,
  responseCreateEvent,
  textUserEvent,
  type RealtimeServerEvent,
} from "@/voice/realtime/events";

const REALTIME_CALLS_URL = "https://api.openai.com/v1/realtime/calls";

export type RealtimeHandlers = {
  onEvent: (event: RealtimeServerEvent) => void;
  onConnectionChange: (open: boolean) => void;
  onRemoteStream?: (stream: MediaStream | null) => void;
};

export type RealtimeConnection = {
  send: (payload: unknown) => void;
  sendText: (text: string) => void;
  sendPageContext: (context: string) => void;
  sendToolResults: (results: Array<{ callId: string; output: string }>) => void;
  close: () => void;
};

async function waitForIce(peer: RTCPeerConnection) {
  if (peer.iceGatheringState === "complete") return;
  await new Promise<void>((resolve) => {
    const timeout = window.setTimeout(() => resolve(), 1500);
    function onChange() {
      if (peer.iceGatheringState === "complete") {
        window.clearTimeout(timeout);
        peer.removeEventListener("icegatheringstatechange", onChange);
        resolve();
      }
    }
    peer.addEventListener("icegatheringstatechange", onChange);
  });
}

export async function connectRealtimeSession(
  clientSecret: string,
  handlers: RealtimeHandlers,
  localStream: MediaStream,
): Promise<RealtimeConnection> {
  const peer = new RTCPeerConnection();
  const audio = document.createElement("audio");
  audio.autoplay = true;
  audio.setAttribute("playsinline", "true");

  for (const track of localStream.getTracks()) {
    peer.addTrack(track, localStream);
  }

  peer.ontrack = (event) => {
    const stream = event.streams[0] ?? new MediaStream([event.track]);
    audio.srcObject = stream;
    handlers.onRemoteStream?.(stream);
    void audio.play().catch(() => undefined);
  };

  const channel = peer.createDataChannel("oai-events");

  channel.addEventListener("open", () => handlers.onConnectionChange(true));
  channel.addEventListener("close", () => handlers.onConnectionChange(false));
  channel.addEventListener("message", (event) => {
    if (typeof event.data !== "string") return;
    try {
      handlers.onEvent(JSON.parse(event.data) as RealtimeServerEvent);
    } catch {
      // Ignore malformed frames.
    }
  });

  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  await waitForIce(peer);

  const sdp = peer.localDescription?.sdp ?? offer.sdp;
  if (!sdp) {
    throw new Error("Failed to create a WebRTC offer");
  }

  const sdpResponse = await fetch(REALTIME_CALLS_URL, {
    method: "POST",
    body: sdp,
    headers: {
      Authorization: `Bearer ${clientSecret}`,
      "Content-Type": "application/sdp",
    },
  });

  if (!sdpResponse.ok) {
    const detail = await sdpResponse.text();
    throw new Error(`Realtime connect failed (${sdpResponse.status}): ${detail.slice(0, 280)}`);
  }

  const answer: RTCSessionDescriptionInit = {
    type: "answer",
    sdp: await sdpResponse.text(),
  };
  await peer.setRemoteDescription(answer);

  function send(payload: unknown) {
    if (channel.readyState !== "open") return;
    channel.send(JSON.stringify(payload));
  }

  return {
    send,
    sendText(text: string) {
      send(textUserEvent(text));
      send(responseCreateEvent());
    },
    sendPageContext(context: string) {
      send(pageContextEvent(context));
    },
    sendToolResults(results) {
      for (const result of results) {
        send(functionCallOutputEvent(result.callId, result.output));
      }
      if (results.length > 0) send(responseCreateEvent());
    },
    close() {
      handlers.onConnectionChange(false);
      handlers.onRemoteStream?.(null);
      channel.close();
      peer.close();
      audio.srcObject = null;
      audio.remove();
    },
  };
}
