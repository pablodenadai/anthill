import { Entity } from './common/Entity';
import { Vector } from './common/Vector';

import { CONFIG } from './Config';

export class Pheromone extends Entity {
  constructor (protected position: Vector, protected radius: number, public strength: number) {
    super(position, radius);
  }

  dissipate (): number {
    this.strength -= CONFIG.PHEROMONE.DISSIPATION_RATE;
    if (this.strength < CONFIG.PHEROMONE.DISAPPEAR_THRESHOLD) {
      this.strength = 0;
    }

    return this.strength;
  }

  add (strength: number) {
    this.strength += strength;
  }

  /**
   * @deprecated
   */
  getColour () {
    let map = function (value, inMin, inMax, outMin, outMax) {
      return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    };
  	let transparency: number = map(this.strength, 0, 15, 0, 1);
  	return `rgba(255, 0, 0, ${transparency})`;
  }

  /**
   * @deprecated
   */
  getZIndex () {
  	return 1;
  }
}
