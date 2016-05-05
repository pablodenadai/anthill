import { EventEmitter } from 'fbemitter';

import { Events } from './Events';
import { Entity } from './Entity';

export abstract class Collection extends Array {

	public emitter: EventEmitter;

	constructor () {
		super();
		this.emitter = new EventEmitter();
	}

	push (entity: Entity): number {
		if (this.indexOf(entity) >= 0) return;

		entity.emitter.addListener(Events.Update, (data: any) => this.emitter.emit(Events.Update, data));
		entity.emitter.addListener(Events.Delete, (data: any) => this.delete(data));

		this.emitter.emit(Events.Create, entity);

		return super.push(entity);
	}

	delete (entity: Entity) {
		let index: number = this.indexOf(entity);
		if (index < 0) return;
		this.emitter.emit(Events.Delete, entity);
		this.splice(index, 1);
	}
}
