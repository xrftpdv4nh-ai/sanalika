const world = document.getElementById("game-world");
const player = document.getElementById("player");
const playerSprite = document.getElementById("player-sprite");
const shadow = document.getElementById("player-shadow");
const roomBg = document.getElementById("room-bg");

let bgWidth = 1166;
let bgHeight = 700;

let playerX = 520;
let playerY = 370;

let targetX = playerX;
let targetY = playerY;

const speed = 2.15;

function updateBounds() {
  bgWidth = roomBg.clientWidth;
  bgHeight = roomBg.clientHeight;

  if (playerX > bgWidth) playerX = bgWidth * 0.5;
  if (playerY > bgHeight) playerY = bgHeight * 0.5;

  setPlayerPosition();
}

function setPlayerPosition() {
  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;

  shadow.style.left = `${playerX}px`;
  shadow.style.top = `${playerY - 4}px`;
}

function setIdle() {
  player.classList.remove("walking");
  player.classList.add("idle");

  shadow.style.width = window.innerWidth < 768 ? "20px" : "26px";
  shadow.style.height = window.innerWidth < 768 ? "8px" : "10px";
  shadow.style.opacity = "0.28";
}

function setWalking() {
  player.classList.remove("idle");
  player.classList.add("walking");

  shadow.style.width = window.innerWidth < 768 ? "17px" : "22px";
  shadow.style.height = window.innerWidth < 768 ? "7px" : "8px";
  shadow.style.opacity = "0.22";
}

function setDirection(moveX, moveY) {
  const absX = Math.abs(moveX);
  const absY = Math.abs(moveY);

  playerSprite.style.filter = "none";

  if (absY > absX) {
    if (moveY < 0) {
      player.dataset.dir = "up";
      playerSprite.style.transform = "scale(.88,1)";
      playerSprite.style.filter = "brightness(0.88)";
    } else {
      player.dataset.dir = "down";
      playerSprite.style.transform = "scale(1)";
    }
  } else {
    if (moveX > 0) {
      player.dataset.dir = "right";
      playerSprite.style.transform = "scale(.72,1)";
    } else {
      player.dataset.dir = "left";
      playerSprite.style.transform = "scale(-.72,1)";
    }
  }
}

function clampTarget() {
  const minX = 20;
  const maxX = bgWidth - 20;
  const minY = 20;
  const maxY = bgHeight - 10;

  if (targetX < minX) targetX = minX;
  if (targetX > maxX) targetX = maxX;
  if (targetY < minY) targetY = minY;
  if (targetY > maxY) targetY = maxY;
}

function moveToPointer(clientX, clientY) {
  const rect = world.getBoundingClientRect();
  targetX = clientX - rect.left;
  targetY = clientY - rect.top;
  clampTarget();
}

world.addEventListener("click", (e) => {
  moveToPointer(e.clientX, e.clientY);
});

world.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  moveToPointer(touch.clientX, touch.clientY);
}, { passive: true });

function update() {
  const dx = targetX - playerX;
  const dy = targetY - playerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 1.5) {
    const moveX = (dx / distance) * speed;
    const moveY = (dy / distance) * speed;

    playerX += moveX;
    playerY += moveY;

    setDirection(moveX, moveY);
    setWalking();
    setPlayerPosition();
  } else {
    setIdle();
  }

  requestAnimationFrame(update);
}

window.addEventListener("load", updateBounds);
window.addEventListener("resize", updateBounds);

setPlayerPosition();
setIdle();
update();
