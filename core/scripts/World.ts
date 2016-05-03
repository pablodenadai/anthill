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

  // public previousElements: Array<Entity>;

  public render: Function;
  public destroy: Function;

  constructor () {
    this.rectangle = CONFIG.WORLD.RECTANGLE;
  };

  init() {
    this.antHill = new AntHill(
      CONFIG.ANTHILL.POSITION,
      CONFIG.ANTHILL.RADIUS
    );
    this.render(this.antHill);

    this.foodList = new FoodList();
    this.foodList.render = this.render.bind(this);
    this.foodList.create(CONFIG.WORLD.FOOD_COUNT);
    _.forEach(this.foodList, (f) => {
      this.render(f);
    });

    this.pheromoneList = new PheromoneList();
    this.pheromoneList.render = this.render.bind(this);
    this.pheromoneList.destroy = this.destroy.bind(this);

    this.ants = [];
    for (let i = 0; i < CONFIG.WORLD.ANT_COUNT; i++) {
      let ant: Ant = new Ant(this.antHill.getPosition(), CONFIG.ANT.RADIUS, this);
      ant.render = this.render.bind(this);
      this.ants.push(ant);
    }
  }

  start () {
    let ants = this.ants;
    let antIndex = this.ants.length - 1;
    let antCreationInterval: number = setInterval(() => {
      /** TODO ant list */
      ants[antIndex].leaveAntHill();

      if (antIndex === 0) {
        clearInterval(antCreationInterval);
      }

      antIndex--;
    }, CONFIG.WORLD.ANT_CREATION_INTERVAL);

  }
}
