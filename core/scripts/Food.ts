import { Vector } from './common/Vector';

/**
* Created by food factory class.
*/
export class Food {
  public isOnGround: boolean = false;

  constructor (public position: Vector, public radius: number) {
    this.isOnGround = true;
  }

  /**
   * @deprecated
   */
  getText () {
  	return "f";
  }

  /**
   * @deprecated
   */
  getColour () {
  	return "green";
  }

  /**
   * @deprecated
   */
  getZIndex () {
  	return 7;
  }

  /**
   * @deprecated
   */
  getPosition () {
    return this.position;
  }
}
