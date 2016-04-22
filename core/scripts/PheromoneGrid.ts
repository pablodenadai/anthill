import { Rectangle } from './common/Rectangle';
import { Vector } from './common/Vector';
import { Pheromone } from './Pheromone';

import { CONFIG } from './Config';

export class PheromoneGrid {
  public grid: Array<Array<number>>;

  /**
  * Pheromones are represented as values on a grid. The higher
  * the value, the stronger the pheromone at that particular square.
  */
  constructor (public rectangle: Rectangle) {
    let width = this.rectangle.width();
    let height = this.rectangle.height();

    this.grid = [];

    for (let i = 0; i < width; i++) {
      this.grid[i] = [];

      for (let j = 0; j < height; j++) {
        this.grid[i][j] = 0;
      }
    }
  }

  dissipate () {
    let width = this.rectangle.width();
    let height = this.rectangle.height();

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        this.grid[i][j] -= CONFIG.PHEROMONE.DISSIPATION;

        if (this.grid[i][j] < CONFIG.PHEROMONE.DISAPPEAR_THRESHOLD) {
          this.grid[i][j] = 0;
        }
      }
    }
  }

  add (point: Vector) {
    if (this.rectangle.contains(point)) {
      this.grid[point.x][point.y] += CONFIG.PHEROMONE.STRENGTH;
    }
  }

  get (point: Vector): number {
    if (this.rectangle.contains(point)) {
      return this.grid[point.x][point.y];
    }

    return 0;
  }

  /**
  * Return pheromones for rendering
  */
  getPheromones (): Array<Pheromone> {
    let pheromones = Array<Pheromone>();

    let width = this.rectangle.width();
    let height = this.rectangle.height();

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if(this.grid[i][j] > 0) {
          pheromones.push(new Pheromone(new Vector(i, j), this.grid[i][j]));
        }
      }
    }

    return pheromones;
  }

  empty (): boolean {
    let width = this.rectangle.width();
    let height = this.rectangle.height();

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (this.grid[i][j] > 0) {
          return false;
        }
      }
    }

    return true;
  }
}
