import { Vector } from './common/Vector';
import { Collection } from './common/Collection';

import { Ant } from './Ant';
import { AntHill } from './AntHill';
import { FoodCollection } from './FoodCollection';
import { PheromoneCollection } from './PheromoneCollection';

import { CONFIG } from './Config';

export class AntCollection extends Collection {

	constructor(
		private antHill: AntHill,
		private foodCollection: FoodCollection,
		private pheromoneCollection: PheromoneCollection
	) {
		super();
	}

	create (count: number = CONFIG.WORLD.ANT_COUNT) {
		if (!count) return;

		let interval = setInterval(() => {
			let ant: Ant = new Ant(this.antHill, this.foodCollection, this.pheromoneCollection);
			super.push(ant);

			ant.leaveAntHill();

			count--;
			if (!count) {
				clearInterval(interval);
			}
		}, CONFIG.WORLD.ANT_CREATION_INTERVAL);
	}
}
