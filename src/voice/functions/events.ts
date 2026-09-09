export const VOICE_FOCUS_EVENT = "portfolio:voice-focus";
export const VOICE_PLAY_DEMO_EVENT = "portfolio:voice-play-demo";
export const VOICE_SHOW_ACHIEVEMENT_EVENT = "portfolio:voice-show-achievement";
export const VOICE_EXPAND_EXPERIENCE_EVENT = "portfolio:voice-expand-experience";

export function dispatchVoiceFocus(id: string) {
  window.dispatchEvent(new CustomEvent(VOICE_FOCUS_EVENT, { detail: { id } }));
}

export function dispatchPlayProjectDemo(id: string) {
  window.dispatchEvent(new CustomEvent(VOICE_PLAY_DEMO_EVENT, { detail: { id } }));
}

export function dispatchShowAchievement(id: string) {
  window.dispatchEvent(
    new CustomEvent(VOICE_SHOW_ACHIEVEMENT_EVENT, { detail: { id } }),
  );
}

export function dispatchExpandExperience(id?: string) {
  window.dispatchEvent(
    new CustomEvent(VOICE_EXPAND_EXPERIENCE_EVENT, { detail: { id } }),
  );
}
