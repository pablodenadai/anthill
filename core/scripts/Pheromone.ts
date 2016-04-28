import { Vector } from './common/Vector';

import { CONFIG } from './Config';

export class Pheromone {
  constructor (public position: Vector, public strength: number) {}

  dissipate () {
    this.strength -= CONFIG.PHEROMONE.DISSIPATION_RATE;
    if (this.strength < CONFIG.PHEROMONE.DISAPPEAR_THRESHOLD) {
      this.strength = 0;
    }
  }

  add (strength: number) {
    this.strength += strength;
  }

  /**
   * @deprecated
   */
  getText () {
  	return '●'; // this.strength.toFixed(0);
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

  /**
   * @deprecated
   */
  getPosition () {
    return this.position;
  }
}
