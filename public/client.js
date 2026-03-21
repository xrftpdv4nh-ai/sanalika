const socket = io();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const nameModal = document.getElementById("nameModal");
const nameInput = document.getElementById("nameInput");
const joinBtn = document.getElementById("joinBtn");

const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

let room = { width: 1200, height: 700 };
let currentPlayer = null;
let players = {};

const keys = {
  up: false,
  down: false,
  left: false,
  right: false
};

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
setTimeout(resizeCanvas, 100);

function addMessage(html, className = "") {
  const div = document.createElement("div");
  div.className = `msg ${className}`;
  div.innerHTML = html;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawSpeechBubble(text, x, y) {
  if (!text) return;

  ctx.save();
  ctx.font = "14px Arial";
  const safeText = text.length > 24 ? text.slice(0, 24) + "..." : text;
  const textWidth = ctx.measureText(safeText).width;
  const paddingX = 12;
  const bubbleWidth = textWidth + paddingX * 2;
  const bubbleHeight = 34;
  const bubbleX = x - bubbleWidth / 2;
  const bubbleY = y - 88;

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 14);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x - 8, bubbleY + bubbleHeight - 2);
  ctx.lineTo(x, bubbleY + bubbleHeight + 8);
  ctx.lineTo(x + 8, bubbleY + bubbleHeight - 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(safeText, x, bubbleY + bubbleHeight / 2 + 1);
  ctx.restore();
}

function drawCharacter(player) {
  const x = player.x;
  const y = player.y;
  const dir = player.direction === "left" ? -1 : 1;
  const look = player.look || {};
  const skin = look.skin || "#f2c7a5";
  const hair = look.hair || "#2b2b2b";
  const shirt = look.shirt || "#60a5fa";
  const pants = look.pants || "#1f2937";

  ctx.save();
  ctx.translate(x, y);

  if (dir === -1) {
    ctx.scale(-1, 1);
  }

  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(0,0,0,0.18)";

  ctx.fillStyle = pants;
  ctx.fillRect(-10, 16, 8, 18);
  ctx.fillRect(2, 16, 8, 18);

  ctx.fillStyle = "#111827";
  ctx.fillRect(-11, 33, 10, 4);
  ctx.fillRect(1, 33, 10, 4);

  ctx.fillStyle = shirt;
  roundRect(-16, -6, 32, 26, 8);
  ctx.fill();

  ctx.fillStyle = skin;
  ctx.fillRect(-20, -2, 6, 18);
  ctx.fillRect(14, -2, 6, 18);

  ctx.beginPath();
  ctx.fillStyle = skin;
  ctx.arc(0, -22, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = hair;
  ctx.arc(0, -27, 15, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-15, -27, 30, 8);

  ctx.fillStyle = "#1f2937";
  ctx.beginPath();
  ctx.arc(-5, -23, 1.4, 0, Math.PI * 2);
  ctx.arc(5, -23, 1.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = "#7c2d12";
  ctx.lineWidth = 1.5;
  ctx.arc(0, -18, 4, 0.2, Math.PI - 0.2);
  ctx.stroke();

  if (currentPlayer && player.id === currentPlayer.id) {
    ctx.beginPath();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.arc(0, 5, 28, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(player.name, x, y - 48);
  ctx.restore();

  if (player.bubbleText && player.bubbleUntil && Date.now() < player.bubbleUntil) {
    drawSpeechBubble(player.bubbleText, x, y);
  }
}

function drawRoom() {
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;

  ctx.clearRect(0, 0, w, h);

  const scaleX = w / room.width;
  const scaleY = h / room.height;

  ctx.save();
  ctx.scale(scaleX, scaleY);

  ctx.fillStyle = "#173f73";
  ctx.fillRect(0, 0, room.width, room.height);

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let x = 0; x < room.width; x += 80) {
    for (let y = 0; y < room.height; y += 80) {
      ctx.fillRect(x + 2, y + 2, 2, 2);
    }
  }

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(100, 80, 220, 90);
  ctx.fillRect(480, 240, 260, 100);
  ctx.fillRect(860, 140, 200, 80);

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0, room.height - 65, room.width, 65);

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Social Room - Stage 1", 20, 32);

  Object.values(players).forEach((player) => {
    drawCharacter(player);
  });

  ctx.restore();
}

function gameLoop() {
  drawRoom();

  if (currentPlayer) {
    socket.emit("move", keys);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

function joinGame() {
  const name = nameInput.value.trim() || "Guest";
  socket.emit("joinGame", name);
  nameModal.classList.add("hidden");
  chatInput.focus();
}

joinBtn.addEventListener("click", joinGame);

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") joinGame();
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  socket.emit("chatMessage", text);
  chatInput.value = "";
});

window.addEventListener("keydown", (e) => {
  const tag = document.activeElement.tagName.toLowerCase();
  const isTyping = tag === "input" || tag === "textarea";

  if (!isTyping) {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = true;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = true;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = false;
  if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = false;
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
});

socket.on("currentPlayer", (data) => {
  currentPlayer = data.player;
  room = data.room;
  data.messages.forEach((msg) => {
    addMessage(
      `<div class="meta">${msg.sender} • ${msg.time}</div><div>${escapeHtml(msg.text)}</div>`
    );
  });
});

socket.on("allPlayers", (serverPlayers) => {
  players = serverPlayers;
});

socket.on("playerJoined", (player) => {
  players[player.id] = player;
});

socket.on("playerMoved", (data) => {
  if (!players[data.id]) return;
  players[data.id].x = data.x;
  players[data.id].y = data.y;
  if (data.direction) players[data.id].direction = data.direction;

  if (currentPlayer && data.id === currentPlayer.id) {
    currentPlayer.x = data.x;
    currentPlayer.y = data.y;
    currentPlayer.direction = data.direction;
  }
});

socket.on("playerBubble", (data) => {
  if (!players[data.id]) return;
  players[data.id].bubbleText = data.text;
  players[data.id].bubbleUntil = data.bubbleUntil;

  if (currentPlayer && data.id === currentPlayer.id) {
    currentPlayer.bubbleText = data.text;
    currentPlayer.bubbleUntil = data.bubbleUntil;
  }
});

socket.on("playerLeft", (playerId) => {
  delete players[playerId];
});

socket.on("chatMessage", (msg) => {
  addMessage(
    `<div class="meta">${msg.sender} • ${msg.time}</div><div>${escapeHtml(msg.text)}</div>`
  );
});

socket.on("systemMessage", (text) => {
  addMessage(`<div>${escapeHtml(text)}</div>`, "system");
});

function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}
