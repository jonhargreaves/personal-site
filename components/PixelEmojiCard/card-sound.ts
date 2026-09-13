// A family of short, layered percussion sounds, with a different voice per emoji.
const voices = {
  smile: { notes: [660, 990], decay: 0.1, bend: 0.8, texture: 0.025 },
  heart: { notes: [196, 294], decay: 0.14, bend: 0.65, texture: 0.01 },
  hands: { notes: [880, 1320], decay: 0.18, bend: 0.99, texture: 0.015 },
  eyes: { notes: [440, 660], decay: 0.085, bend: 0.72, texture: 0.035 },
  ok: { notes: [784, 1176], decay: 0.075, bend: 0.9, texture: 0.05 },
  fire: { notes: [330, 495], decay: 0.11, bend: 0.55, texture: 0.07 },
} as const;

export type CardSound = keyof typeof voices;

let context: AudioContext | undefined;
let output: GainNode | undefined;
const active = new Set<GainNode>();
export async function playCardSound(sound: CardSound) {
  if (typeof window === "undefined" || !window.AudioContext) return;

  try {
    // Create/resume only from an explicit click; never autoplay on page load.
    context ??= new AudioContext({ latencyHint: "interactive" });
    const audio = context;
    if (!output) {
      output = audio.createGain();
      output.gain.value = 0.35;
      output.connect(audio.destination);
    }
    if (audio.state !== "running") await audio.resume();
    if (audio.state !== "running") return;

    const voice = voices[sound];
    const now = audio.currentTime;
    const pitch = 2 ** ((Math.random() - 0.5) * 0.7 / 12);
    const duration = voice.decay * (0.95 + Math.random() * 0.1);
    const bus = audio.createGain();
    bus.gain.value = 0.9 + Math.random() * 0.1;
    bus.connect(output);
    // Keep rapid clicking from building up a loud stack of tails.
    if (active.size >= 4) {
      const oldest = active.values().next().value;
      if (oldest) {
        oldest.gain.setTargetAtTime(0, now, 0.005);
        active.delete(oldest);
      }
    }
    active.add(bus);

    let remaining = voice.notes.length + 1;
    const release = () => {
      if (--remaining === 0) {
        bus.disconnect();
        active.delete(bus);
      }
    };

    voice.notes.forEach((note, index) => {
      const oscillator = audio.createOscillator();
      const envelope = audio.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(note * pitch, now);
      oscillator.frequency.exponentialRampToValueAtTime(note * pitch * voice.bend, now + duration);
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(index === 0 ? 0.22 : 0.07, now + 0.003);
      envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(envelope).connect(bus);
      oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
        release();
      };
      oscillator.start(now);
      oscillator.stop(now + duration + 0.01);
    });

    // A filtered, very short noise layer gives the notes a tactile attack.
    const noise = audio.createBufferSource();
    const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * 0.025), audio.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const filter = audio.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1800;
    const envelope = audio.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(voice.texture, now + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);
    noise.connect(filter).connect(envelope).connect(bus);
    noise.onended = () => {
      noise.disconnect();
      filter.disconnect();
      envelope.disconnect();
      release();
    };
    noise.start(now);
  } catch {
    // Unavailable or blocked audio must never prevent the color interaction.
  }
}
