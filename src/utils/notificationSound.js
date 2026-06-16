// Subtle two-note "message" chime, synthesized with the Web Audio API so we
// don't need to bundle an audio asset. Used to give an audible cue when a new
// chat/support message arrives while the app is open.

let audioCtx = null;
let lastPlay = 0;

function getCtx() {
  if (typeof window === "undefined") return null;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = audioCtx || new Ctx();
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Play a short, gentle notification chime. Safe to call from anywhere — it
 * no-ops if audio is unavailable or blocked, and throttles bursts so a batch of
 * messages doesn't machine-gun the speaker.
 */
export function playMessageChime() {
  const ctx = getCtx();
  if (!ctx) return;

  const now = Date.now();
  if (now - lastPlay < 1200) return; // throttle
  lastPlay = now;

  try {
    // Browsers suspend the context until a user gesture; resume best-effort.
    if (ctx.state === "suspended") ctx.resume();

    const start = ctx.currentTime;
    // Two soft sine tones a musical third apart → a pleasant "ding-dong".
    const notes = [
      { freq: 880, at: 0 }, // A5
      { freq: 1174.66, at: 0.12 }, // D6
    ];

    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = note.freq;

      const t = start + note.at;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    }
  } catch {
    // Ignore autoplay/hardware errors — sound is a non-critical enhancement.
  }
}
