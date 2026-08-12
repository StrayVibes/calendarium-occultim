/** WebAudio engine: noise beds + rune / solfeggio tones. Browser only. */

export type NoiseKind = "white" | "pink" | "brown";

export interface Rune {
  name: string;
  glyph: string;
  hz: number;
  meaning: string;
}

/** Elder Futhark, 24 runes. Frequencies follow the common
 *  Futhark tuning ladder used in rune-chant practice (Hz). */
export const RUNES: Rune[] = [
  { name: "Fehu", glyph: "ᚠ", hz: 174, meaning: "Ricchezza, energia mobile" },
  { name: "Uruz", glyph: "ᚢ", hz: 187, meaning: "Forza primordiale, salute" },
  { name: "Thurisaz", glyph: "ᚦ", hz: 198, meaning: "Difesa, rottura" },
  { name: "Ansuz", glyph: "ᚨ", hz: 210, meaning: "Parola, ispirazione" },
  { name: "Raidho", glyph: "ᚱ", hz: 222, meaning: "Viaggio, ritmo" },
  { name: "Kenaz", glyph: "ᚲ", hz: 234, meaning: "Fiamma, conoscenza" },
  { name: "Gebo", glyph: "ᚷ", hz: 246, meaning: "Dono, scambio" },
  { name: "Wunjo", glyph: "ᚹ", hz: 258, meaning: "Gioia, armonia" },
  { name: "Hagalaz", glyph: "ᚺ", hz: 270, meaning: "Rottura necessaria" },
  { name: "Nauthiz", glyph: "ᚾ", hz: 285, meaning: "Bisogno, resistenza" },
  { name: "Isa", glyph: "ᛁ", hz: 297, meaning: "Ghiaccio, immobilità" },
  { name: "Jera", glyph: "ᛃ", hz: 309, meaning: "Raccolto, ciclo" },
  { name: "Eihwaz", glyph: "ᛇ", hz: 321, meaning: "Asse del mondo" },
  { name: "Perthro", glyph: "ᛈ", hz: 333, meaning: "Sorte, mistero" },
  { name: "Algiz", glyph: "ᛉ", hz: 345, meaning: "Protezione" },
  { name: "Sowilo", glyph: "ᛊ", hz: 357, meaning: "Sole, vittoria" },
  { name: "Tiwaz", glyph: "ᛏ", hz: 369, meaning: "Giustizia, coraggio" },
  { name: "Berkano", glyph: "ᛒ", hz: 384, meaning: "Nascita, cura" },
  { name: "Ehwaz", glyph: "ᛖ", hz: 396, meaning: "Movimento, fiducia" },
  { name: "Mannaz", glyph: "ᛗ", hz: 417, meaning: "Sé, umanità" },
  { name: "Laguz", glyph: "ᛚ", hz: 432, meaning: "Acqua, intuito" },
  { name: "Ingwaz", glyph: "ᛜ", hz: 444, meaning: "Seme, gestazione" },
  { name: "Dagaz", glyph: "ᛞ", hz: 528, meaning: "Alba, risveglio" },
  { name: "Othala", glyph: "ᛟ", hz: 639, meaning: "Eredità, casa" },
];

export const SOLFEGGIO = [174, 285, 396, 417, 528, 639, 741, 852, 963];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private tones = new Map<number, { osc: OscillatorNode; gain: GainNode }>();

  private ensure() {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.6;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return { ctx: this.ctx, master: this.master! };
  }

  setVolume(v: number) {
    const { master, ctx } = this.ensure();
    master.gain.setTargetAtTime(v, ctx.currentTime, 0.1);
  }

  startNoise(kind: NoiseKind, level = 0.4) {
    const { ctx, master } = this.ensure();
    this.stopNoise();
    const seconds = 4;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0,
      lastBrown = 0;
    for (let i = 0; i < data.length; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === "white") data[i] = w * 0.5;
      else if (kind === "pink") {
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.06;
        b6 = w * 0.115926;
      } else {
        lastBrown = (lastBrown + 0.02 * w) / 1.02;
        data[i] = lastBrown * 3.2;
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(gain).connect(master);
    src.start();
    gain.gain.setTargetAtTime(level, ctx.currentTime, 0.6);
    this.noiseNode = src;
    this.noiseGain = gain;
  }

  stopNoise() {
    if (this.noiseNode && this.noiseGain && this.ctx) {
      const node = this.noiseNode;
      this.noiseGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      setTimeout(() => {
        try {
          node.stop();
        } catch {
          /* already stopped */
        }
      }, 600);
    }
    this.noiseNode = null;
    this.noiseGain = null;
  }

  toggleTone(hz: number, level = 0.18) {
    if (this.tones.has(hz)) {
      this.stopTone(hz);
      return false;
    }
    const { ctx, master } = this.ensure();
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = hz;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(gain).connect(master);
    osc.start();
    gain.gain.setTargetAtTime(level, ctx.currentTime, 0.4);
    this.tones.set(hz, { osc, gain });
    return true;
  }

  stopTone(hz: number) {
    const entry = this.tones.get(hz);
    if (!entry || !this.ctx) return;
    entry.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    setTimeout(() => {
      try {
        entry.osc.stop();
      } catch {
        /* already stopped */
      }
    }, 600);
    this.tones.delete(hz);
  }

  stopAll() {
    this.stopNoise();
    [...this.tones.keys()].forEach((hz) => this.stopTone(hz));
  }

  get activeTones() {
    return [...this.tones.keys()];
  }
}

export const audioEngine = new AudioEngine();
