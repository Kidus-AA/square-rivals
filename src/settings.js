const config = {
  gameMode: {
    CLASSIC: {
      canvasWidth: 800,
      canvasHeight: 800,
      playerCount: 4,
      playerWidth: 200,
      playerHeight: 200,
      playerSpeed: 5,
      playerMaxHealth: 5,
      collisionDamage: 10,
      healthIncrease: 1,
    },
  },
};

export const settings = ({ mode }) => {
  return {
    config: config.gameMode[mode],
  };
};
