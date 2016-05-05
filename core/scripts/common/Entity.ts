import * as shortid from 'shortid';
import { EventEmitter } from 'fbemitter';

import { Events } from './Events';
import { Vector } from './Vector';

export class Entity {
  private id: string;

	public emitter: EventEmitter;

  constructor (protected position: Vector, protected radius: number) {
    this.id = shortid.generate();
		this.emitter = new EventEmitter();
  }

	getId (): string { return this.id; }
	getRadius (): number { return this.radius; }

  isAt (other: Entity) {
    return other.position.distance(this.position) < this.radius + other.radius;
  }

  getPosition (): Vector { return this.position.round(); }
  setPosition (position: Vector) {
    this.position = position;
		this.emitter.emit(Events.Update, this);
  }
}
