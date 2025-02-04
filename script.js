import { Player } from './src/player.js';
import { Health } from './src/health.js';
import { settings } from './src/settings.js';

window.addEventListener('load', function () {
  const canvas = this.document.getElementById('canvas');
  const gameMode = 'CLASSIC';
  const colors = ['red', 'blue', 'green', 'teal'];

  const ctx = canvas.getContext('2d');
  const { config } = settings({ mode: gameMode });

  let gameover = false;

  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.players = [...new Array(config.playerCount)].map(
        () => new Player({ game: this, color: colors.pop(), config })
      );
      this.health = new Health({ game: this });
    }

    update() {
      this.players.forEach((player) => {
        player.update({ players: this.players, config });
      });

      this.health.update({ players: this.players, ctx });
      this.players = this.players.filter((player) => {
        return player.playerHealth > 0;
      });

      if (this.players.length === 1) {
        console.log('PLAYER WON!!!');
        gameover = true;
      } else if (this.players.length === 0) {
        console.log('DRAW...');
        gameover = true;
      }
    }

    draw({ ctx }) {
      this.health.draw({ ctx });
      this.players.forEach((player) => {
        player.draw({ ctx });
      });
    }
  }
  const game = new Game(canvas.width, canvas.height);

  function animate() {
    if (!gameover) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      game.update();
      game.draw({ ctx });
      requestAnimationFrame(animate);
    }
  }

  animate();
});
