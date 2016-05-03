import * as _ from 'lodash';

import { Vector } from './common/Vector';

import { Food } from './Food';
import { FoodFactory } from './FoodFactory';

export class FoodList extends Array<Food> {

  public render: Function;

  create (n: number = 1) {
    for (let i = 0; i < n; i++) {
      let foods = FoodFactory.create(this.render.bind(this));
      this.push.apply(this, foods);
    }
  }

  remove (food: Food) {
    this.splice(this.indexOf(food), 1);
  }

  find (position: Vector, radius: number): Food {
    return _.find(this, (food: Food) => {
      return (food && food.isOnGround && food.isAt(position, radius));
    });
  }
}
