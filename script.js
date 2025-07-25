const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const captureBtn = document.getElementById("captureBtn");
const result = document.getElementById("result");

const palettes = [
  {
    name: "Flan",
    colors: [
      [178, 154, 59],
      [211, 166, 45],
    ],
  },
  {
    name: "Nickel",
    colors: [
      [226, 183, 44],
      [244, 194, 58],
    ],
  },
  {
    name: "Noyé",
    colors: [
      [242, 212, 102],
      [234, 225, 124],
    ],
  },
];

// Activer la caméra
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    alert("Impossible d'accéder à la caméra : " + err);
  });

// Capturer et analyser
captureBtn.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // moyenne des couleurs
  let r = 0,
    g = 0,
    b = 0,
    count = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  const avg = [r / count, g / count, b / count];

  // comparer à la palette
  let bestMatch = null;
  let minDist = Infinity;

  palettes.forEach((palette) => {
    palette.colors.forEach((c) => {
      const dist = Math.sqrt(
        Math.pow(avg[0] - c[0], 2) +
          Math.pow(avg[1] - c[1], 2) +
          Math.pow(avg[2] - c[2], 2)
      );
      if (dist < minDist) {
        minDist = dist;
        bestMatch = palette.name;
      }
    });
  });

  result.innerHTML = `Ton pastis est : <strong>${bestMatch}</strong>`;
});
