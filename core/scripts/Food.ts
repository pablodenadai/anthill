import { Entity } from './common/Entity';
import { Vector } from './common/Vector';

/**
* Created by food factory class.
*/
export class Food extends Entity {
  public isOnGround: boolean = false;

  constructor (protected position: Vector, public radius: number) {
    super(position, radius);

    this.isOnGround = true;
  }

  /**
   * @deprecated
   */
  getColour () {
  	return 'green';
  }

  /**
   * @deprecated
   */
  getZIndex () {
  	return 7;
  }
}
