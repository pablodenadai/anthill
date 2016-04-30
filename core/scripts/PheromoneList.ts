import * as _ from 'lodash';

import { Rectangle } from './common/Rectangle';
import { Vector } from './common/Vector';
import { Pheromone } from './Pheromone';

import { CONFIG } from './Config';

export class PheromoneList extends Array<Pheromone> {

  dissipate () {
    let index = this.length - 1;

    while (index >= 0) {
      let pheromone: Pheromone = this[index];
      let strength: number = pheromone.dissipate();

      if (strength <= 0) {
        this.splice(index, 1);
      }

      index--;
    }
  }

  add (point: Vector, multiplier: number = 1) {
    let strength = CONFIG.PHEROMONE.STRENGTH * multiplier;

    let pheromone = this.find(point, 1).shift() || this.create(point);
    pheromone.add(strength);

    this.push(pheromone);
  }

  create (point: Vector): Pheromone {
    return new Pheromone(point, CONFIG.PHEROMONE.RADIUS, 0);
  }

  find (position: Vector, radius): Array<Pheromone> {
    return _.filter(this, (pheromone: Pheromone) => {
      return (pheromone && position.distance(pheromone.getPosition()) < pheromone.getRadius() + radius);
    });
  }


}
