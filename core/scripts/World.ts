import { Rectangle } from './common/Rectangle';

import { Food } from './Food';
import { FoodFactory } from './FoodFactory';
import { Ant } from './Ant';
import { AntHill } from './AntHill';
import { PheromoneGrid } from './PheromoneGrid';

import { CONFIG } from './Config';

export class World {
  public ants: Array<Ant>;
  public antHill: AntHill;
  public foods: Array<Food>;
  public foodFactory: FoodFactory;
  public rectangle: Rectangle;
  public pheromoneGrid: PheromoneGrid;

  constructor () {
    this.rectangle = CONFIG.WORLD.RECTANGLE;
  }

  start () {
    this.antHill = new AntHill(
      CONFIG.ANTHILL.POSITION.round(),
      CONFIG.ANTHILL.RADIUS
    );

    this.pheromoneGrid = new PheromoneGrid();

    this.foods = [];
    this.foodFactory = new FoodFactory();

    this.ants = [];
    for (let i = 0; i < CONFIG.WORLD.ANT_COUNT; i++) {
      this.ants.push(new Ant(this.antHill.position));
    }
  }

  createFood (force: boolean = false) {
    let newFoods: Array<Food> = this.foodFactory.create(force);
    newFoods.forEach((food: Food) => this.foods.push(food));
  }

  removeFood (food: Food) {
    this.foods.splice(this.foods.indexOf(food), 1);
  }

  step () {
    this.ants.forEach((ant: Ant) => ant.step(this));
    this.pheromoneGrid.dissipate();
  }

  /**
   * @deprecated
   */
  elements () {
    return [...this.ants, this.antHill, ...this.foods, ...this.pheromoneGrid.getPheromones()];
  }

  /**
   * @deprecated
   */
  destroy () { }
}
