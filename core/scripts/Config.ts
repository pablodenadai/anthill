import { Rectangle } from './common/Rectangle';
import { Vector } from './common/Vector';

export const CONFIG = {
  WORLD: {
    RECTANGLE: new Rectangle(0, 0, 100, 50),
    ANT_COUNT: 30
  },
  ANT: {
    // SENSE_DISTANCE: 10,
    // SPEED: 1,
    MAX_ROTATION: Math.PI / 6,
    RATIONALITY: 0.8
  },
  ANTHILL: {
    RADIUS: 1,
    POSITION: new Vector(50, 25)
  },
  FOOD: {
    RECTANGLE: new Rectangle(2, 2, 98, 48),
    MIN_RADIUS: 1,
    MAX_RADIUS: 2,
    MIN_AMOUNT: 5,
    MAX_AMOUNT: 12,
    SPREAD: 0,
    CREATE_PROBABILITY: 0.1
  },
  PHEROMONE: {
    DISSIPATION: 0.07,
    DISAPPEAR_THRESHOLD: 0.2,
    STRENGTH: 1,
    MULTIPLIER: 3
  }
};
