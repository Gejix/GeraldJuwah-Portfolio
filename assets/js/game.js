const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ship = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  speed: 8,
  dx: 0
};

let lasers = [];
let enemies = [];

function drawShip() {
  ctx.fillStyle = 'white';
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

function moveShip() {
  ship.x += ship.dx;

  // Boundary detection
  if (ship.x < 0) {
    ship.x = 0;
  }
  if (ship.x + ship.width > canvas.width) {
    ship.x = canvas.width - ship.width;
  }
}

function shootLaser() {
  lasers.push({
    x: ship.x + ship.width / 2 - 2.5,
    y: ship.y,
    width: 5,
    height: 20,
    speed: 10
  });
}

function drawLasers() {
  ctx.fillStyle = 'red';
  lasers.forEach(laser => {
    ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    laser.y -= laser.speed;
  });
}

function spawnEnemies() {
  if (Math.random() < 0.02) {
    enemies.push({
      x: Math.random() * (canvas.width - 50),
      y: -50,
      width: 50,
      height: 50,
      speed: 4
    });
  }
}

function drawEnemies() {
  ctx.fillStyle = 'green';
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    enemy.y += enemy.speed;
  });
}

function detectCollisions() {
  // Laser-enemy collision
  for (let i = lasers.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (
        lasers[i].x < enemies[j].x + enemies[j].width &&
        lasers[i].x + lasers[i].width > enemies[j].x &&
        lasers[i].y < enemies[j].y + enemies[j].height &&
        lasers[i].y + lasers[i].height > enemies[j].y
      ) {
        // Remove both laser and enemy
        lasers.splice(i, 1);
        enemies.splice(j, 1);
        break;
      }
    }
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawShip();
  moveShip();
  drawLasers();
  drawEnemies();
  detectCollisions();

  spawnEnemies();

  requestAnimationFrame(update);
}

function keyDown(e) {
  if (e.key === 'ArrowRight' || e.key === 'd') {
    ship.dx = ship.speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'a') {
    ship.dx = -ship.speed;
  } else if (e.key === ' ') {
    shootLaser();
  }
}

function keyUp(e) {
  if (
    e.key === 'ArrowRight' ||
    e.key === 'ArrowLeft' ||
    e.key === 'd' ||
    e.key === 'a'
  ) {
    ship.dx = 0;
  }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

update();
