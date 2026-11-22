
function detectSongBeats(buffer) {
  const data = buffer.getChannelData(0);
  const rate = buffer.sampleRate;
  const windowSize = 512;
  const hop = 256;

  const energy = [];

  for (let i = 0; i < data.length - windowSize; i += hop) {
    let sum = 0;

    for (let j = 0; j < windowSize; j++) {
      sum += data[i + j] * data[i + j];
    }

    energy.push(Math.sqrt(sum / windowSize));
  }

  const onset = energy.map((v, i) =>
    i === 0 ? 0 : Math.max(0, v - energy[i - 1])
  );

  let bestLag = 0;
  let bestScore = -1;

  const frameRate = rate / hop;

  for (let bpm = 60; bpm <= 180; bpm++) {
    const lag = Math.round(frameRate * 60 / bpm);
    let score = 0;

    for (let i = lag; i < onset.length; i++) {
      score += onset[i] * onset[i - lag];
    }

    if (score > bestScore) {
      bestScore = score;
      bestLag = lag;
    }
  }

  const bpm = Math.round(frameRate * 60 / bestLag);

  return {
    bpm,
    beatInterval: 60 / bpm,
    duration: buffer.duration
  };
}

function generateBeatPattern(bpm) {
  const interval = 60 / bpm;
  const pattern = [];

  for (let bar = 0; bar < 4; bar++) {
    for (let beat = 0; beat < 4; beat++) {
      pattern.push({
        time: (bar * 4 + beat) * interval,
        sound: beat % 2 === 0 ? "kick" : "snare"
      });
    }
  }

  return pattern;
      }
