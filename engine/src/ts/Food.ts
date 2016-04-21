import { Vector } from './common/Vector';

/**
 * Created by food factory class.
 */
export class Food {
  public isOnGround: boolean = false;

  constructor (public position: Vector, public radius: number) {
	 this.isOnGround = true;
  }
}
