export function Spike({ game }) {
  this.game = game;
  this.x = Math.random() * (game.width - this.width); // Random start position
  this.y = Math.random() * (game.height - this.height);
}

Spike.prototype.update = function ({ players }) {};

Spike.prototype.draw = function ({ ctx }) {};
