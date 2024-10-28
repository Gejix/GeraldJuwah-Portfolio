const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to match the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ship properties
let ship = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  speed: 8,
  dx: 0
};

// Arrays to store lasers and enemies
let lasers = [];
let enemies = [];

// Draw ship on canvas
function drawShip() {
  ctx.fillStyle = 'white';
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// Move ship left or right
function moveShip() {
  ship.x += ship.dx;

  // Boundary detection to keep ship within canvas
  if (ship.x < 0) {
    ship.x = 0;
  }
  if (ship.x + ship.width > canvas.width) {
    ship.x = canvas.width - ship.width;
  }
}

// Shoot laser from ship
function shootLaser() {
  lasers.push({
    x: ship.x + ship.width / 2 - 2.5,
    y: ship.y,
    width: 5,
    height: 20,
    speed: 10
  });
}

// Draw lasers on canvas
function drawLasers() {
  ctx.fillStyle = 'red';
  lasers.forEach((laser, index) => {
    ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    laser.y -= laser.speed;

    // Remove laser if it goes off screen
    if (laser.y + laser.height < 0) {
      lasers.splice(index, 1);
    }
  });
}

// Spawn enemies at random positions
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

// Draw enemies on canvas
function drawEnemies() {
  ctx.fillStyle = 'green';
  enemies.forEach((enemy, index) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    enemy.y += enemy.speed;

    // Remove enemy if it goes off screen
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });
}

// Detect collisions between lasers and enemies
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

// Update game elements and redraw canvas
function update() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw and update game elements
  drawShip();
  moveShip();
  drawLasers();
  drawEnemies();
  detectCollisions();

  // Spawn new enemies
  spawnEnemies();

  // Request the next frame
  requestAnimationFrame(update);
}

// Handle keydown events
function keyDown(e) {
  if (e.key === 'ArrowRight' || e.key === 'd') {
    ship.dx = ship.speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'a') {
    ship.dx = -ship.speed;
  } else if (e.key === ' ') {
    shootLaser();
  }
}

// Handle keyup events
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

// Event listeners for key presses
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Start the game loop
update();
