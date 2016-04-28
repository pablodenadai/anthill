import { Rectangle } from './common/Rectangle';
import { Vector } from './common/Vector';
import { Pheromone } from './Pheromone';

import { CONFIG } from './Config';

export class PheromoneGrid {
  public grid: Array<Pheromone>;

  constructor () {
    this.grid = [];
  }

  dissipate () {
    this.grid = this.grid.filter((pheromone: Pheromone) => {
      let strength: number = pheromone.dissipate();
      return strength > 0;
    });
  }

  add (point: Vector, multiplier: number = 1) {
    let strength = CONFIG.PHEROMONE.STRENGTH * multiplier;

    let pheromone =
      this.findPheromone(point, 1) ||
      this.createPheromone(point);
    pheromone.add(strength);

    this.grid.push(pheromone);
  }

  createPheromone (point: Vector): Pheromone {
    return new Pheromone(point, CONFIG.PHEROMONE.RADIUS, 0);
  }

  findPheromone (position: Vector, radius): Pheromone {
    return this.grid.filter((pheromone: Pheromone) => {
      return (pheromone && position.distance(pheromone.getPosition()) < radius);
    }).shift();
  }

  getPheromones (): Array<Pheromone> {
    return this.grid;
  }
}
