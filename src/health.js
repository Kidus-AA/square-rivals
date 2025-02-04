export function Health({ game }) {
  this.game = game;
  this.width = 25;
  this.height = 25;
  this.x = Math.random() * (game.width - this.width); // Random start position
  this.y = Math.random() * (game.height - this.height);
  this.image = document.getElementById('health');
}

Health.prototype.isColliding = function ({ player }) {
  return (
    this.x < player.x + player.width &&
    this.x + this.width > player.x &&
    this.y < player.y + player.height &&
    this.y + this.height > player.y
  );
};

Health.prototype.update = function ({ players, ctx }) {
  for (let player of players) {
    if (player !== this && this.isColliding({ player })) {
      this.handleCollision({ player });
      // ctx.clearRect(this.x, this.y, this.width, this.height);
    }
  }
};

Health.prototype.handleCollision = function ({ player }) {
  player.playerHealth = Math.max(0, player.playerHealth + 1);
  player.width = Math.ceil(player.baseWidth * (player.playerHealth / 5));
  player.height = Math.ceil(player.baseHeight * (player.playerHealth / 5));

  this.x = Math.random() * (this.game.width - this.width);
  this.y = Math.random() * (this.game.height - this.height);
};

Health.prototype.draw = function ({ ctx }) {
  ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
};
