export type RealtimeServerEvent = {
  type: string;
  event_id?: string;
  error?: { message?: string; code?: string };
  transcript?: string;
  delta?: string;
  item_id?: string;
  call_id?: string;
  name?: string;
  arguments?: string;
  item?: {
    id?: string;
    type?: string;
    role?: string;
    call_id?: string;
    name?: string;
    arguments?: string;
    content?: Array<{ type?: string; transcript?: string; text?: string }>;
  };
  response?: {
    id?: string;
    status?: string;
    output?: Array<{
      type?: string;
      id?: string;
      call_id?: string;
      name?: string;
      arguments?: string;
    }>;
  };
};

export type RealtimeFunctionCall = {
  callId: string;
  name: string;
  arguments: string;
};

export function functionCallsFromResponse(
  event: RealtimeServerEvent,
): RealtimeFunctionCall[] {
  const output = event.response?.output ?? [];
  return output
    .filter((item) => item.type === "function_call" && item.name && item.call_id)
    .map((item) => ({
      callId: item.call_id as string,
      name: item.name as string,
      arguments: item.arguments ?? "{}",
    }));
}

export function functionCallOutputEvent(callId: string, output: string) {
  return {
    type: "conversation.item.create",
    item: {
      type: "function_call_output",
      call_id: callId,
      output,
    },
  };
}

export function textUserEvent(text: string) {
  return {
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "user",
      content: [{ type: "input_text", text }],
    },
  };
}

export function pageContextEvent(context: string) {
  return {
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: `[Silent page context for tools. Do not answer this message.]\n${context}`,
        },
      ],
    },
  };
}

export function responseCreateEvent() {
  return { type: "response.create" };
}
