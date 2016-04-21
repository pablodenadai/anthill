import { Vector } from './common/Vector';

import { Food } from './Food';
import { CONFIG } from './Config';

const FOOD = CONFIG.FOOD;

export class FoodFactory {
  /**
   * Create a new cluster of foods. If force is true, a cluster
   * is definitely created. If false, it could be created based
   * on probability.
   */
  create (force: boolean): Array<Food> {
    let foods = Array<Food>();

  	if (force || Math.random() < FOOD.CREATE_PROBABILITY) {
  		let centreX = Math.random() * FOOD.RECTANGLE.width() + FOOD.RECTANGLE.topLeft.x;
  		let centreY = Math.random() * FOOD.RECTANGLE.height() + 	FOOD.RECTANGLE.topLeft.y;
  		let count = Math.floor(Math.random() * (FOOD.MAX_AMOUNT -	FOOD.MIN_AMOUNT)) +	FOOD.MIN_AMOUNT;

  		for (let i = 0; i < count; i ++) {
  			let position = new Vector(centreX, centreY);

        position = position.add(
          Vector.randomUnitVector()
  					.multiply(FOOD.SPREAD)
  					.multiply(Math.random())
        ).round();

  			let radius = Math.random() * (FOOD.MAX_RADIUS - FOOD.MIN_RADIUS) + FOOD.MIN_RADIUS;

  			foods.push(new Food(position, radius));
  		}
  	}

    return foods
  }
}
