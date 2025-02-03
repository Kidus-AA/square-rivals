import { Player } from './src/player.js';
import { Health } from './src/health.js';
import { settings } from './src/settings.js';

window.addEventListener('load', function () {
  const canvas = this.document.getElementById('canvas');
  const gameMode = 'CLASSIC';

  const ctx = canvas.getContext('2d');
  const { config } = settings({ mode: gameMode });

  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.players = [...new Array(config.playerCount)].map(
        () => new Player({ game: this, config })
      );
      this.health = new Health({ game: this });
    }

    update() {
      this.players.forEach((player) => {
        player.update({ players: this.players });
      });
      this.health.update({ players: this.players, ctx });
    }

    draw({ ctx }) {
      // TODO: Get the picked colors from an html input
      this.health.draw({ ctx });
      const colors = ['red', 'blue', 'green', 'teal'];
      this.players.forEach((player) => {
        player.draw({ ctx, color: colors.pop() });
      });
    }
  }
  const game = new Game(canvas.width, canvas.height);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw({ ctx });
    requestAnimationFrame(animate);
  }

  animate();
});
