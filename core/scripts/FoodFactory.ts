import { Vector } from './common/Vector';

import { Food } from './Food';
import { CONFIG } from './Config';

const FOOD = CONFIG.FOOD;
const WORLD = CONFIG.WORLD;

export abstract class FoodFactory {

  /**
  * Create a new cluster of foods. If force is true, a cluster
  * is definitely created. If false, it could be created based
  * on probability.
  */
  static create (render): Array<Food> {
    let foods: Array<Food> = [];

    let centreX = Math.random() * WORLD.RECTANGLE.width();
    let centreY = Math.random() * WORLD.RECTANGLE.height();
    let count = Math.floor(Math.random() * (FOOD.MAX_AMOUNT -	FOOD.MIN_AMOUNT)) +	FOOD.MIN_AMOUNT;

    for (let i = 0; i < count; i ++) {
      let position = new Vector(centreX, centreY);

      position = position.add(
        Vector.randomUnitVector()
        .multiply(FOOD.SPREAD)
        .multiply(Math.random())
      );

      let radius = Math.random() * (FOOD.MAX_RADIUS - FOOD.MIN_RADIUS) + FOOD.MIN_RADIUS;

      let food = new Food(position, radius);
      food.render = render;
      foods.push(food);
    }

    return foods;
  }
}
