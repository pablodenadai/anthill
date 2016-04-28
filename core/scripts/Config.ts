import { Rectangle } from './common/Rectangle';
import { Vector } from './common/Vector';

export const CONFIG = {
  WORLD: {
    RECTANGLE: new Rectangle(0, 0, 500, 250),
    ANT_COUNT: 2
  },
  ANT: {
    RADIUS: 5,
    MAX_ROTATION: Math.PI / 6,
    RATIONALITY: 1, // 0.8,
    RATIONALITY_ON_PHEROMONE: 1, // 0.95,
    PHEROMONE_MULTIPLIER: 2,
    PHEROMONE_LIMIT: 250
  },
  ANTHILL: {
    RADIUS: 5,
    POSITION: new Vector(205, 125)
  },
  FOOD: {
    MIN_RADIUS: 5,
    MAX_RADIUS: 5,
    MIN_AMOUNT: 10,
    MAX_AMOUNT: 20,
    SPREAD: 0,
    CREATE_PROBABILITY: 0.1
  },
  PHEROMONE: {
    RADIUS: 3,
    DISSIPATION_RATE: 0.001,
    DISAPPEAR_THRESHOLD: 0,
    STRENGTH: 1
  }
};
