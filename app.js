
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
  
