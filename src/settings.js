const config = {
  gameMode: {
    CLASSIC: {
      canvasWidth: 800,
      canvasHeight: 800,
      playerCount: 4,
      playerWidth: 100,
      playerHeight: 100,
      playerSpeed: 5,
      playerHealth: 100,
      collisionDamage: 10,
      healthIncrease: 10,
    },
  },
};

export const settings = ({ mode }) => {
  return {
    config: config.gameMode[mode],
  };
};
