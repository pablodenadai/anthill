import { Vector } from './common/Vector';

export class Pheromone {
  constructor (public position: Vector, public strength: number) {}

  /**
   * @deprecated
   */
  getText () {
  	return 'p';
  }

  /**
   * @deprecated
   */
  getColour () {
  	var strength = Math.max(1 - this.strength * .4, 0);

  	return `rgb(237, ${Math.round(strength * 218)}, ${Math.round(strength * 164)})`;
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
