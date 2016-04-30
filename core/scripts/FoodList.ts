import * as _ from 'lodash';

import { Vector } from './common/Vector';

import { Food } from './Food';
import { FoodFactory } from './FoodFactory';

export class FoodList extends Array<Food> {
  create (force: boolean = false) {
    this.push.apply(this, FoodFactory.create(force));
  }

  remove (food: Food) {
    this.splice(this.indexOf(food), 1);
  }

  find (position: Vector): Food {
    return _.find(this, (food: Food) => {
      return (food && food.isOnGround && position.distance(food.getPosition()) < food.radius);
    });
  }
}
