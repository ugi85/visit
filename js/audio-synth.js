/**
 * AudioSynthAdventure - Web Audio API procedural instrumental generator
 * Produces an uplifting, energetic adventure / trekking theme
 * No external mp3 dependency required; works 100% offline & without CORS.
 */
class AdventureAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentStep = 0;
    this.timerId = null;
    this.tempo = 118; // 118 BPM upbeat trekking stride
    this.masterGain = null;
    this.listeners = [];

    // Scale: Pentatonic major / cheerful adventure (D Major: D, E, F#, A, B)
    this.freqs = {
      D3: 146.83, E3: 164.81, Fs3: 185.00, G3: 196.00, A3: 220.00, B3: 246.94,
      D4: 293.66, E4: 329.63, Fs4: 369.99, G4: 392.00, A4: 440.00, B4: 493.88,
      D5: 587.33, E5: 659.25, Fs5: 739.99, A5: 880.00
    };

    // Bassline (16 steps)
    this.bassPattern = [
      'D3', null, 'D3', null, 'A3', null, 'B3', null,
      'G3', null, 'G3', null, 'A3', 'A3', 'D3', null
    ];

    // Marimba/Arp melody pattern
    this.arpPattern = [
      'D4', 'Fs4', 'A4', 'Fs4', 'E4', 'A4', 'B4', 'A4',
      'D5', 'A4', 'Fs4', 'D4', 'E4', 'Fs4', 'A4', 'E4'
    ];

    // Soaring Lead Motif (triggers every 32 steps)
    this.leadPattern = [
      'A4', null, 'D5', null, 'E5', null, 'Fs5', null,
      'E5', 'D5', 'B4', null, 'A4', null, null, null,
      'Fs4', 'A4', 'D5', 'Fs5', 'E5', null, 'D5', null,
      'B4', null, 'A4', 'Fs4', 'D4', null, null, null
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime); // gentle background volume

      // Master lowpass filter for warm acoustic sound
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(4500, this.ctx.currentTime);

      this.masterGain.connect(this.filter);
      this.filter.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playDrumKick(time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.12);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  playShaker(time) {
    if (!this.ctx) return;
    // White noise burst simulating trail footsteps / shaker
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const bq = this.ctx.createBiquadFilter();
    bq.type = 'highpass';
    bq.frequency.value = 6000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(bq);
    bq.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  playBass(note, time) {
    if (!note || !this.ctx) return;
    const freq = this.freqs[note];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  playArp(note, time) {
    if (!note || !this.ctx) return;
    const freq = this.freqs[note];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Warm bell / marimba timbre
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.28, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.2);
  }

  playLead(note, time) {
    if (!note || !this.ctx) return;
    const freq = this.freqs[note];
    if (!freq) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Slight chorus detune
    osc1.type = 'sawtooth';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.004, time);

    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(2200, time);

    gain.gain.setValueAtTime(0.18, time);
    gain.gain.linearRampToValueAtTime(0.22, time + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.42);

    osc1.connect(f);
    osc2.connect(f);
    f.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.45);
    osc2.stop(time + 0.45);
  }

  tick() {
    if (!this.isPlaying || !this.ctx) return;

    const stepTime = this.ctx.currentTime + 0.05;
    const step16 = this.currentStep % 16;
    const step32 = this.currentStep % 32;

    // Drum beat: kick on 0, 4, 8, 12; shaker on every 2 steps
    if (step16 % 4 === 0) {
      this.playDrumKick(stepTime);
    }
    this.playShaker(stepTime);

    // Bass
    this.playBass(this.bassPattern[step16], stepTime);

    // Arpeggio
    this.playArp(this.arpPattern[step16], stepTime);

    // Melody lead
    this.playLead(this.leadPattern[step32], stepTime);

    this.currentStep++;

    const stepIntervalMs = (60 / this.tempo / 4) * 1000;
    this.timerId = setTimeout(() => this.tick(), stepIntervalMs);
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;
    this.tick();
    this.notifyListeners(true);
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notifyListeners(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  onStateChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners(state) {
    this.listeners.forEach(cb => cb(state));
  }
}

// Global instance
window.AdventureAudio = new AdventureAudioEngine();
