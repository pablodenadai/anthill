import { Rectangle } from './common/Rectangle';
import { Vector } from './common/Vector';

export const CONFIG = {
  WORLD: {
    RECTANGLE: new Rectangle(0, 0, 500, 250),
    ANT_COUNT: 15,
    ANT_CREATION_INTERVAL: 500,
    FOOD_COUNT: 40
  },
  ANT: {
    RADIUS: 5,
    MAX_ROTATION: Math.PI / 6,
    RATIONALITY: 0.8,
    RATIONALITY_ON_PHEROMONE: 0.8,
    PHEROMONE_MULTIPLIER: 2,
    PHEROMONE_LIMIT: 250
  },
  ANTHILL: {
    RADIUS: 15,
    POSITION: new Vector(205, 125)
  },
  FOOD: {
    MIN_RADIUS: 5,
    MAX_RADIUS: 5,
    MIN_AMOUNT: 3,
    MAX_AMOUNT: 10,
    SPREAD: 0,
    CREATE_PROBABILITY: 0.1
  },
  PHEROMONE: {
    RADIUS: 1,
    DISSIPATION_RATE: 0.02,
    DISAPPEAR_THRESHOLD: 0,
    STRENGTH: 1
  }
};
