import { Entity } from './common/Entity';
import { Vector } from './common/Vector';

export class AntHill extends Entity {
  constructor (protected position: Vector, public radius: number) {
    super(position, radius);
  }

  /**
   * @deprecated
   */
  getText () {
  	return '●';
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
}
