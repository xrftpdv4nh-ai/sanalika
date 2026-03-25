const game = document.getElementById("game");
const player = document.getElementById("player");

let playerX = 300;
let playerY = 500;

let targetX = playerX;
let targetY = playerY;

function setPlayerPosition() {
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";
}

setPlayerPosition();

game.addEventListener("click", (e) => {
  const rect = game.getBoundingClientRect();

  targetX = e.clientX - rect.left;
  targetY = e.clientY - rect.top;
});

function update() {
  const dx = targetX - playerX;
  const dy = targetY - playerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const speed = 4;

  if (distance > 1) {
    playerX += (dx / distance) * speed;
    playerY += (dy / distance) * speed;
    setPlayerPosition();
  }

  requestAnimationFrame(update);
}

update();
