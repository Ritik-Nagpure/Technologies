// Canvas API
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "green";
ctx.fillRect(10, 10, 100, 50);
ctx.font = "16px Arial";
ctx.fillStyle = "black";
ctx.fillText("Hello Canvas", 10, 80);

// SVG Manipulation
const circle = document.getElementById("circle");
let growing = true;
setInterval(() => {
  let r = parseInt(circle.getAttribute("r"));
  r = growing ? r + 1 : r - 1;
  if (r > 40 || r < 20) growing = !growing;
  circle.setAttribute("r", r);
}, 50);

// CSS + JS Animation
const box = document.getElementById("box");
let pos = 0;
function animateBox() {
  pos += 1;
  box.style.left = pos + "px";
  if (pos < 150) requestAnimationFrame(animateBox);
}
animateBox();

// Image Loading & Manipulation
const imageCanvas = document.getElementById("imageCanvas");
const imageCtx = imageCanvas.getContext("2d");

const img = new Image();

// Must be set before src
// When you load an image from another domain (like Wikimedia, Unsplash, or Google) without
// setting crossOrigin = "anonymous", the browser marks the canvas as "tainted". This means:

img.crossOrigin = "anonymous";
img.src =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/200px-PNG_transparency_demonstration_1.png";

img.onload = () => {
  imageCtx.drawImage(img, 0, 0, 200, 150);
  const imageData = imageCtx.getImageData(0, 0, 200, 150);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const avg =
      (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = avg;
  }
  imageCtx.putImageData(imageData, 0, 0);
};

// Mouse Events on Canvas
const mouseCanvas = document.getElementById("mouseCanvas");
const mouseCtx = mouseCanvas.getContext("2d");
mouseCanvas.addEventListener("mousedown", (e) => {
  const rect = mouseCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  mouseCtx.fillStyle = "blue";
  mouseCtx.beginPath();
  mouseCtx.arc(x, y, 5, 0, Math.PI * 2);
  mouseCtx.fill();
});
