import * as _ from 'lodash';

import { Rectangle } from './common/Rectangle';
import { Vector } from './common/Vector';
import { Pheromone } from './Pheromone';

import { CONFIG } from './Config';

export class PheromoneList extends Array<Pheromone> {

  public render: Function;
  public destroy: Function;

  add (point: Vector, multiplier: number = 1) {
    let pheromone = this.create(point, CONFIG.PHEROMONE.STRENGTH * multiplier);
    this.push(pheromone);
  }

  remove (p: Pheromone) {
    this.splice(this.indexOf(p), 1);
    if (this.destroy) {
      this.destroy(p);
    }
  }

  create (point: Vector, strength: number): Pheromone {
    let p = new Pheromone(point, CONFIG.PHEROMONE.RADIUS, strength);
    p.render = this.render.bind(this);
    p.destroy = this.remove.bind(this);
    this.render(p);
    return p;
  }

  find (position: Vector): Pheromone {
    return _.find(this, (pheromone: Pheromone) => {
      return (pheromone && pheromone.getPosition().equals(position));
    });
  }

  filterP (position: Vector, radius: number): Array<Pheromone> {
    return _.filter(this, (pheromone: Pheromone) => {
      return pheromone.isAt(position, radius);
    });
  }


}
