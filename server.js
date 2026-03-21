const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const ROOM_WIDTH = 1200;
const ROOM_HEIGHT = 700;
const PLAYER_SPEED = 4;

const players = {};
const messages = [];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinGame", (playerName) => {
    const safeName =
      typeof playerName === "string" && playerName.trim()
        ? playerName.trim().slice(0, 20)
        : "Guest";

    players[socket.id] = {
      id: socket.id,
      name: safeName,
      x: Math.floor(Math.random() * (ROOM_WIDTH - 100)) + 50,
      y: Math.floor(Math.random() * (ROOM_HEIGHT - 100)) + 50,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    };

    socket.emit("currentPlayer", {
      player: players[socket.id],
      room: {
        width: ROOM_WIDTH,
        height: ROOM_HEIGHT
      },
      messages
    });

    socket.emit("allPlayers", players);

    socket.broadcast.emit("playerJoined", players[socket.id]);

    io.emit("systemMessage", `${safeName} joined the room`);
  });

  socket.on("move", (data) => {
    const player = players[socket.id];
    if (!player) return;

    let dx = 0;
    let dy = 0;

    if (data.left) dx -= PLAYER_SPEED;
    if (data.right) dx += PLAYER_SPEED;
    if (data.up) dy -= PLAYER_SPEED;
    if (data.down) dy += PLAYER_SPEED;

    player.x = clamp(player.x + dx, 20, ROOM_WIDTH - 20);
    player.y = clamp(player.y + dy, 20, ROOM_HEIGHT - 20);

    io.emit("playerMoved", {
      id: player.id,
      x: player.x,
      y: player.y
    });
  });

  socket.on("chatMessage", (text) => {
    const player = players[socket.id];
    if (!player) return;

    const safeText =
      typeof text === "string" ? text.trim().slice(0, 200) : "";

    if (!safeText) return;

    const msg = {
      id: Date.now() + Math.random(),
      sender: player.name,
      text: safeText,
      time: new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    messages.push(msg);

    if (messages.length > 50) {
      messages.shift();
    }

    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    const player = players[socket.id];
    if (player) {
      io.emit("playerLeft", socket.id);
      io.emit("systemMessage", `${player.name} left the room`);
      delete players[socket.id];
    }

    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
