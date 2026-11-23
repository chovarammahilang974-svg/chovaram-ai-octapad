
let recordingDestination = null;
let mediaRecorder = null;
let recordedChunks = [];
let audioBuffer = null;
let samples = [];

const status = document.getElementById("status");
const songInput = document.getElementById("song");

function setStatus(message) {
  status.innerText = message;
}

async function analyze() {
  const file = document.getElementById("song").files[0];

  if (!file) {
    alert("पहले गाना अपलोड करें।");
    return;
  }

  try {
    setStatus("गाने का AI विश्लेषण हो रहा है...");

    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    const ctx = new AudioContextClass();
    const data = await file.arrayBuffer();

    audioBuffer = await ctx.decodeAudioData(data);

    const result = detectSongBeats(audioBuffer);

    const pattern = generateBeatPattern(result.bpm);

    setStatus(
      "विश्लेषण पूरा!\n" +
      "BPM: " + result.bpm +
      "\nगाने की अवधि: " +
      result.duration.toFixed(2) +
      " सेकंड\nबीट पैटर्न: " +
      pattern.length + " स्टेप"
    );

    window.currentBeatPattern = pattern;
    window.currentSongBpm = result.bpm;

  } catch (error) {
    console.error(error);
    setStatus("गाना विश्लेषण नहीं हो पाया।");
  }
}
  

// CHOVARAM AI OCTAPAD - DJ SOUND ENGINE

let padAudioContext;

function playPad(sound) {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!padAudioContext) {
    padAudioContext = new AudioContextClass();
  }

  if (padAudioContext.state === "suspended") {
    padAudioContext.resume();
  }

  const ctx = padAudioContext;
  const now = ctx.currentTime;

  function tone(freq, endFreq, duration, type, volume) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(1, endFreq), now + duration
    );

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(
      0.001, now + duration
    );

    osc.connect(gain);
    gain.connect(ctx.destination);
if (recordingDestination) {
  gain.connect(recordingDestination);
}
    if (recordingDestination) {
  gain.connect(recordingDestination);
}
    osc.start(now);
    osc.stop(now + duration);
  }

  if (sound === "kick") {
    tone(150, 40, 0.35, "sine", 0.9);
  }

  if (sound === "bass") {
    tone(90, 45, 0.5, "triangle", 0.8);
  }

  if (sound === "dhol") {
    tone(110, 55, 0.22, "sine", 0.8);
    tone(180, 100, 0.12, "triangle", 0.35);
  }

  if (sound === "tasha") {
    tone(420, 160, 0.16, "triangle", 0.8);
  }

  if (sound === "nagada") {
    tone(100, 35, 0.5, "sine", 1);
  }

  if (sound === "clap") {
    tone(1000, 300, 0.08, "square", 0.5);
  }

  if (sound === "snare") {
    tone(220, 100, 0.18, "triangle", 0.7);
  }

  if (sound === "cymbal") {
    tone(8000, 3000, 0.3, "sawtooth", 0.25);
  }
}
  

// CHOVARAM AUTO BEAT SYSTEM

let autoBeatTimer = null;
let autoBeatIndex = 0;

function startAutoBeat() {
  const pattern = window.currentBeatPattern;
  const bpm = window.currentSongBpm;

  if (!pattern || !pattern.length || !bpm) {
    alert("पहले गाना अपलोड करके Analyze Song दबाएँ।");
    return;
  }

  stopAutoBeat();
  autoBeatIndex = 0;

  const interval = 60000 / bpm;

  function playNextBeat() {
    const beat = pattern[autoBeatIndex];

    if (beat) {
      playPad(beat.sound);
    }

    autoBeatIndex = (autoBeatIndex + 1) % pattern.length;
  }

  playNextBeat();
  autoBeatTimer = setInterval(playNextBeat, interval);

  setStatus("🎵 Auto Beat चालू है!");
}

function stopAutoBeat() {
  if (autoBeatTimer !== null) {
    clearInterval(autoBeatTimer);
    autoBeatTimer = null;
  }

  setStatus("⏹ Auto Beat बंद है।");
}

function startRecording() {
  const ctx = padAudioContext;

  if (!ctx) {
    alert("पहले किसी DJ पैड को दबाएँ।");
    return;
  }

  if (!window.MediaRecorder) {
    alert("आपका ब्राउजर रिकॉर्डिंग सपोर्ट नहीं करता।");
    return;
  }

  recordingDestination = ctx.createMediaStreamDestination();
  recordedChunks = [];

  mediaRecorder = new MediaRecorder(
    recordingDestination.stream
  );

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, {
      type: "audio/webm"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Chovaram-DJ-Recording.webm";
    link.click();

    URL.revokeObjectURL(url);
    recordingDestination = null;
  };

  mediaRecorder.start();
  alert("🔴 Recording चालू है!");
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    alert("Recording सेव हो रही है!");
  }
}
