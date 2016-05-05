import * as _ from 'lodash';

import { Entity } from './common/Entity';
import { Collection } from './common/Collection';
import { Vector } from './common/Vector';

import { Food } from './Food';

import { CONFIG } from './Config';

export class FoodCollection extends Collection {

  create (count: number = CONFIG.WORLD.FOOD_COUNT) {
    while (count) {
      let centreX = Math.random() * CONFIG.WORLD.RECTANGLE.width();
      let centreY = Math.random() * CONFIG.WORLD.RECTANGLE.height();
      let amount = Math.floor(Math.random() * (CONFIG.FOOD.MAX_AMOUNT -	CONFIG.FOOD.MIN_AMOUNT)) +	CONFIG.FOOD.MIN_AMOUNT;

      for (let i = 0; i < amount; i ++) {
        let position = new Vector(centreX, centreY);

        position = position.add(
          Vector.randomUnitVector()
          .multiply(CONFIG.FOOD.SPREAD)
          .multiply(Math.random())
        );

        let radius = Math.random() * (CONFIG.FOOD.MAX_RADIUS - CONFIG.FOOD.MIN_RADIUS) + CONFIG.FOOD.MIN_RADIUS;
        this.push(new Food(position, radius));
      }

      count--;
    }
  }

  findOneAt (other: Entity): Food {
    return _(this).find((food: Food) => food.isOnGround && food.isAt(other));
  }
}
