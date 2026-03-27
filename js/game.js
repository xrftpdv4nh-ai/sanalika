const world = document.getElementById("game-world");
const player = document.getElementById("player");
const playerSprite = document.getElementById("player-sprite");
const shadow = document.getElementById("player-shadow");

let playerX = 520;
let playerY = 370;

let targetX = playerX;
let targetY = playerY;

let facingScaleX = 1;
const speed = 2.2;

function setPlayerPosition() {
  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;

  shadow.style.left = `${playerX}px`;
  shadow.style.top = `${playerY - 6}px`;
}

function setIdle() {
  player.classList.remove("walking");
  player.classList.add("idle");

  shadow.style.width = "34px";
  shadow.style.height = "12px";
  shadow.style.opacity = "0.28";
}

function setWalking() {
  player.classList.remove("idle");
  player.classList.add("walking");

  shadow.style.width = "30px";
  shadow.style.height = "10px";
  shadow.style.opacity = "0.22";
}

function setDirection(moveX, moveY) {
  const absX = Math.abs(moveX);
  const absY = Math.abs(moveY);

  if (absX > absY) {
    player.dataset.dir = "side";

    if (moveX < 0) {
      facingScaleX = -1;
    } else {
      facingScaleX = 1;
    }

    playerSprite.style.transform = `scaleX(${facingScaleX})`;
  } else {
    if (moveY < 0) {
      player.dataset.dir = "up";
      playerSprite.style.transform = `scale(0.96)`;
    } else {
      player.dataset.dir = "down";
      playerSprite.style.transform = `scale(1)`;
    }
  }
}

function moveToPointer(clientX, clientY) {
  const rect = world.getBoundingClientRect();
  targetX = clientX - rect.left;
  targetY = clientY - rect.top;
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

setPlayerPosition();
setIdle();
update();
