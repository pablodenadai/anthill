import { Rectangle } from './common/Rectangle';
import { Vector } from './common/Vector';

export const CONFIG = {
  WORLD: {
    RECTANGLE: new Rectangle(0, 0, 50, 25),
    ANT_COUNT: 1
  },
  ANT: {
    MAX_ROTATION: Math.PI / 6,
    RATIONALITY: 0.8
  },
  ANTHILL: {
    RADIUS: 1,
    POSITION: new Vector(25, 12)
  },
  FOOD: {
    RECTANGLE: new Rectangle(2, 2, 48, 23),
    MIN_RADIUS: 1,
    MAX_RADIUS: 1,
    MIN_AMOUNT: 5,
    MAX_AMOUNT: 12,
    SPREAD: 0,
    CREATE_PROBABILITY: 0.1
  },
  PHEROMONE: {
    DISSIPATION: 0.03,
    DISAPPEAR_THRESHOLD: 0.05,
    STRENGTH: 1,
    MULTIPLIER: 2.5
  }
};
