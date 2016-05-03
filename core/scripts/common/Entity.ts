import * as shortid from 'shortid';

import { Vector } from './Vector';

export abstract class Entity {
  private id: string;

  public render: Function; // updated
  public delete: Function; //
  public create: Function;

  constructor (protected position: Vector, protected radius: number) {
    this.id = shortid.generate();

    if (this.create) {
      this.create();
    }
  }

  // pass entity instead
  isAt (point: Vector, radius: number) {
    return point.distance(this.position) < this.radius + radius;
  }

  getId (): string { return this.id; }

  getPosition (): Vector { return this.position.round(); }
  setPosition (position: Vector) {
    this.position = position;
    if (this.render) {
      this.render(this);
    }
  };

  getRadius (): number { return this.radius; }
}
