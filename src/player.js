export function Player({ game, color, config }) {
  this.game = game;

  this.baseWidth = config.playerWidth;
  this.baseHeight = config.playerHeight;

  this.width = this.baseWidth;
  this.height = this.baseHeight;

  this.x = Math.random() * (game.width - this.width); // Random start position
  this.y = Math.random() * (game.height - this.height);

  this.speed = config.playerSpeed; // Set a constant speed
  this.color = color;

  this.playerHealth = 5;
  this.hasSpike = false;

  let angle = Math.random() * Math.PI * 2; // Random angle (0 to 2π)
  this.velocityX = this.speed * Math.cos(angle);
  this.velocityY = this.speed * Math.sin(angle);
}

Player.prototype.update = function ({ players, config }) {
  // Update position
  this.x += this.velocityX;
  this.y += this.velocityY;

  // Bounce off left/right walls
  if (this.x <= 0 || this.x + this.width >= this.game.width) {
    this.velocityX *= -1;
    this.x = Math.max(0, Math.min(this.x, this.game.width - this.width));
  }

  // Bounce off top/bottom walls
  if (this.y <= 0 || this.y + this.height >= this.game.height) {
    this.velocityY *= -1;
    this.y = Math.max(0, Math.min(this.y, this.game.height - this.height));
  }

  // Check collisions with other players
  for (let player of players) {
    if (player !== this && this.isColliding(player)) {
      console.log(`COLLISION ${this.color}`, this.playerHealth);
      this.handleCollision({ other: player, config });
    }
  }
};

Player.prototype.isColliding = function (other) {
  return (
    this.x < other.x + other.width &&
    this.x + this.width > other.x &&
    this.y < other.y + other.height &&
    this.y + this.height > other.y
  );
};

Player.prototype.handleResizing = function ({ other }) {
  if (!this.hasSpike && !other.hasSpike) {
    this.playerHealth = Math.max(0, this.playerHealth - 1);
    other.playerHealth = Math.max(0, other.playerHealth - 1);

    // this.playerHealth = Math.min(this.playerHealth, 5);
    // other.playerHealth = Math.min(other.playerHealth, 5);

    console.log(`health of ${this.color}`, this.playerHealth);
    console.log(`health of ${other.color}`, other.playerHealth);

    this.width = Math.ceil(this.baseWidth * (this.playerHealth / 5));
    this.height = Math.ceil(this.baseHeight * (this.playerHealth / 5));

    other.width = Math.ceil(other.baseWidth * (other.playerHealth / 5));
    other.height = Math.ceil(other.baseHeight * (other.playerHealth / 5));
  }
};

// Handle elastic collision between two squares
Player.prototype.handleCollision = function ({ other, config }) {
  // --- Reflect Velocities ---
  // (Here we simply swap velocities for a quick elastic reaction.)
  let tempX = this.velocityX;
  let tempY = this.velocityY;
  this.velocityX = other.velocityX;
  this.velocityY = other.velocityY;
  other.velocityX = tempX;
  other.velocityY = tempY;

  // Recalculate overlap on each iteration to avoid oscillations.
  let iterations = 0;
  const maxIterations = 1; // Safety to prevent an infinite loop.

  while (this.isColliding(other) && iterations < maxIterations) {
    // Recalculate current overlap for both axise
    let currentOverlapX, currentOverlapY;
    if (this.x < other.x) {
      currentOverlapX = this.x + this.width - other.x;
    } else {
      currentOverlapX = other.x + other.width - this.x;
    }
    if (this.y < other.y) {
      currentOverlapY = this.y + this.height - other.y;
    } else {
      currentOverlapY = other.y + other.height - this.y;
    }

    this.handleResizing({ other, config });

    // Determine the axis with the minimal penetration
    if (currentOverlapX < currentOverlapY) {
      // Correct along x-axis
      let shift = currentOverlapX / 2;
      if (this.x < other.x) {
        this.x -= shift;
        other.x += shift;
      } else {
        this.x += shift;
        other.x -= shift;
      }
    } else {
      // Correct along y-axis
      let shift = currentOverlapY / 2;
      if (this.y < other.y) {
        this.y -= shift;
        other.y += shift;
      } else {
        this.y += shift;
        other.y -= shift;
      }
    }
    iterations++;
  }
};

Player.prototype.draw = function ({ ctx }) {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width - 5, this.height - 5);
  ctx.strokeStyle = 'BLACK';
  ctx.lineWidth = 5;
  ctx.strokeRect(this.x, this.y, this.width - 5, this.height - 5);

  ctx.font = '30px ariel';
  ctx.strokeText(
    `${this.width}, ${this.height}`,
    this.x + this.width / 2,
    this.y + this.height / 2
  );
};
