export function Player({ game, config }) {
  this.game = game;
  this.width = config.playerWidth;
  this.height = config.playerHeight;
  this.x = Math.random() * (game.width - this.width); // Random start position
  this.y = Math.random() * (game.height - this.height);
  this.speed = config.playerSpeed; // Set a constant speed

  // TODO: Think about how to convert health to reflect on width and height
  this.health = 15;
  this.hasSpike = false;

  let angle = Math.random() * Math.PI * 2; // Random angle (0 to 2π)
  this.velocityX = this.speed * Math.cos(angle);
  this.velocityY = this.speed * Math.sin(angle);
}

Player.prototype.update = function ({ players }) {
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
      this.handleCollision(player);
    }
  }
};

// Standard AABB collision detection.
Player.prototype.isColliding = function (other) {
  return (
    this.x < other.x + other.width &&
    this.x + this.width > other.x &&
    this.y < other.y + other.height &&
    this.y + this.height > other.y
  );
};

Player.prototype.handleResizing = function (other) {
  if (!this.hasSpike && !other.hasSpike) {
    this.width -= 2;
    this.height -= 2;
    other.width -= 2;
    other.height -= 2;
  }
};

Player.prototype.drawSpikes = function (ctx) {
  // Define the number of spikes and spike size.
  const spikeCount = 8;
  const spikeLength = 10;
  const cx = this.x + this.width / 2;
  const cy = this.y + this.height / 2;
  const radius = Math.max(this.width, this.height) / 2;

  ctx.strokeStyle = 'darkred';
  ctx.lineWidth = 2;

  for (let i = 0; i < spikeCount; i++) {
    const angle = (i / spikeCount) * Math.PI * 2;
    // Start from the edge of the box.
    const startX = cx + radius * Math.cos(angle);
    const startY = cy + radius * Math.sin(angle);
    // Extend outward by spikeLength.
    const endX = cx + (radius + spikeLength) * Math.cos(angle);
    const endY = cy + (radius + spikeLength) * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
};

/**
 * Handle elastic collision reaction between two squares.
 * This version focuses on bounce-back direction by reflecting velocity and
 * iteratively repositioning the boxes to resolve overlap.
 */
Player.prototype.handleCollision = function (other) {
  // --- Reflect Velocities ---
  // (Here we simply swap velocities for a quick elastic reaction.)
  let tempX = this.velocityX;
  let tempY = this.velocityY;
  this.velocityX = other.velocityX;
  this.velocityY = other.velocityY;
  other.velocityX = tempX;
  other.velocityY = tempY;

  // --- Iterative Repositioning ---
  // Recalculate overlap on each iteration to avoid oscillations.
  let iterations = 0;
  const maxIterations = 2; // Safety to prevent an infinite loop.

  while (this.isColliding(other) && iterations < maxIterations) {
    // Recalculate current overlap for both axes:
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

    this.handleResizing(other);

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

Player.prototype.draw = function ({ ctx, color }) {
  ctx.fillStyle = color;
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

  if (this.hasSpikes) {
    drawSpikes(ctx); // You can implement this helper function.
  }
};
