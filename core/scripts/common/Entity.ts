import * as shortid from 'shortid';

import { Vector } from './Vector';

export abstract class Entity {
  private id: string;

  constructor (protected position: Vector, protected radius: number) {
    this.id = shortid.generate();
  }

  isAt (point: Vector, distance: number) {
    return point.distance(this.position) < this.radius + distance;
  }

  getId (): string { return this.id; }

  getPosition (): Vector { return this.position; }
  setPosition (point: Vector) { this.position = point; }

  getRadius (): number { return this.radius; }
}
