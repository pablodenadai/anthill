import { Vector } from './common/Vector';

export class AntHill {
  constructor (public position: Vector, public radius: number) {}

  /**
   * @deprecated
   */
  getText () {
  	return 'h';
  }

  /**
   * @deprecated
   */
  getColour () {
  	return 'blue';
  }

  /**
   * @deprecated
   */
  getZIndex () {
  	return 3;
  }

  /**
   * @deprecated
   */
  getPosition () {
    return this.position;
  }
}
