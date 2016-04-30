import { Entity } from './common/Entity';
import { Rectangle } from './common/Rectangle';
import { Vector } from './common/Vector';

import { Ant } from './Ant';
import { AntHill } from './AntHill';
import { FoodList } from './FoodList';
import { PheromoneList } from './PheromoneList';

import { CONFIG } from './Config';

export class World {
  public rectangle: Rectangle;

  public ants: Array<Ant>;
  public antHill: AntHill;
  public foodList: FoodList;
  public pheromoneList: PheromoneList;

  public previousElements: Array<Entity>;

  constructor () {
    this.rectangle = CONFIG.WORLD.RECTANGLE;
  }

  start () {
    this.antHill = new AntHill(
      CONFIG.ANTHILL.POSITION,
      CONFIG.ANTHILL.RADIUS
    );

    this.foodList = new FoodList();
    for (let i = 0; i < CONFIG.WORLD.FOOD_COUNT; i++) {
      this.foodList.create(true);
    }

    this.pheromoneList = new PheromoneList();

    this.ants = [];
    let antCreationInterval: number = setInterval(() => {
      /** TODO ant list */
      this.ants.push(new Ant(this.antHill.getPosition(), CONFIG.ANT.RADIUS));

      if (this.ants.length === CONFIG.WORLD.ANT_COUNT) {
        clearInterval(antCreationInterval);
      }
    }, CONFIG.WORLD.ANT_CREATION_INTERVAL);

    this.previousElements = [];
  }

  step () {
    this.ants.forEach((ant: Ant) => ant.step(this));
    this.pheromoneList.dissipate();
  }

  /**
   * @deprecated
   */
  elements () {
    // Note: a bit of a work-around here.
    // `FoodList` and `PheromoneList` are both extension of the `Array` class.
    // Extending native interfaces seems to be a problem in ES5 (which is our current target).
    // Perhaps we need to work on getting TypeScript to generate ES2015 (ES6) instead,
    // but it seems like Browserify doesn't work with ES2015. Oh lordy!
    let elements: Array<Entity> = [...this.ants, this.antHill, ...[...this.foodList], ...[...this.pheromoneList]];

    let updated: Array<Entity> = elements;
    let deleted: Array<Entity> = _.difference(this.previousElements, elements);

    this.previousElements = elements;

    return { updated, deleted };

    // return elements;
  }

  /**
   * @deprecated
   */
  destroy () { }
}
