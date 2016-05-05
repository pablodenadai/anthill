import * as _ from 'lodash';

import { Rectangle } from './common/Rectangle';
import { Vector } from './common/Vector';
import { Collection } from './common/Collection';
import { Entity } from './common/Entity';

import { Pheromone } from './Pheromone';

import { CONFIG } from './Config';

export class PheromoneCollection extends Collection {

  create (point: Vector, stronger: boolean) {
    let strength: number = CONFIG.PHEROMONE.STRENGTH;
    if (stronger) {
      strength *= CONFIG.ANT.PHEROMONE_MULTIPLIER;
    }
    this.push(new Pheromone(point, CONFIG.PHEROMONE.RADIUS, strength));
  }

  findOneAt (other: Entity): Pheromone {
    return _.find(this, (pheromone: Pheromone) => pheromone.isAt(other));
  }

  findAnyAt (other: Entity): Array<Pheromone> {
    return _.filter(this, (pheromone: Pheromone) => pheromone.isAt(other));
  }
}
