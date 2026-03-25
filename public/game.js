const game = document.getElementById("game");
const player = document.getElementById("player");
const playerBody = player.querySelector(".body");

let playerX = 300;
let playerY = 520;

let targetX = playerX;
let targetY = playerY;

const speed = 2.2;

function setPlayerPosition() {
  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;
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

  if (distance > 2) {
    const moveX = (dx / distance) * speed;
    const moveY = (dy / distance) * speed;

    playerX += moveX;
    playerY += moveY;

    if (moveX > 0.15) {
      playerBody.style.transform = "scaleX(1)";
    } else if (moveX < -0.15) {
      playerBody.style.transform = "scaleX(-1)";
    }

    player.classList.add("walking");
    setPlayerPosition();
  } else {
    player.classList.remove("walking");
  }

  requestAnimationFrame(update);
}

update();
