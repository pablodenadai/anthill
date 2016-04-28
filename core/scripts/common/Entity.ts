import * as shortid from 'shortid';

import { Vector } from './Vector';

export class Entity {
  private id: string;

  constructor (protected position: Vector, protected radius: number) {
    this.id = shortid.generate();
  }

  getId (): string { return this.id; }

  getPosition (): Vector { return this.position; }
  setPosition (point: Vector) { this.position = point; }

  getRadius (): number { return this.radius; }
}
