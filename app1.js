
function playPad(index) {
  if (!audioBuffer || !samples[index]) {
    alert("पहले गाने का विश्लेषण करें।");
    return;
  }

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  const ctx = new AudioContextClass();
  const source = ctx.createBufferSource();

  const start = samples[index];

  const segment = ctx.createBuffer(
    1,
    Math.floor(ctx.sampleRate * 0.8),
    ctx.sampleRate
  );

  const output = segment.getChannelData(0);
  const input = audioBuffer.getChannelData(0);

  const offset = Math.floor(start * audioBuffer.sampleRate);

  for (let i = 0; i < output.length; i++) {
    const position = offset +
      Math.floor(i * audioBuffer.sampleRate / ctx.sampleRate);

    output[i] = input[position] || 0;
  }

  source.buffer = segment;
  source.connect(ctx.destination);
  source.start();
}

function downloadAllPads() {
  if (!audioBuffer || samples.length === 0) {
    alert("पहले गाने का विश्लेषण करें।");
    return;
  }

  samples.forEach((time, index) => {
    setTimeout(() => downloadPad(index), index * 700);
  });
}
