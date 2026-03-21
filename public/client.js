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

function drawRoom() {
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;

  ctx.clearRect(0, 0, w, h);

  const scaleX = w / room.width;
  const scaleY = h / room.height;

  ctx.save();
  ctx.scale(scaleX, scaleY);

  ctx.fillStyle = "#22304a";
  ctx.fillRect(0, 0, room.width, room.height);

  ctx.fillStyle = "#2d3d5a";
  for (let x = 0; x < room.width; x += 80) {
    for (let y = 0; y < room.height; y += 80) {
      ctx.fillRect(x + 2, y + 2, 2, 2);
    }
  }

  ctx.fillStyle = "#334155";
  ctx.fillRect(100, 100, 220, 60);
  ctx.fillRect(480, 240, 260, 60);
  ctx.fillRect(860, 140, 200, 60);

  ctx.fillStyle = "#64748b";
  ctx.font = "20px Arial";
  ctx.fillText("Stage 1 Room", 20, 30);

  Object.values(players).forEach((player) => {
    ctx.beginPath();
    ctx.fillStyle = player.color || "#60a5fa";
    ctx.arc(player.x, player.y, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(player.name, player.x, player.y - 28);

    if (currentPlayer && player.id === currentPlayer.id) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 24, 0, Math.PI * 2);
      ctx.stroke();
    }
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

  if (currentPlayer && data.id === currentPlayer.id) {
    currentPlayer.x = data.x;
    currentPlayer.y = data.y;
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
