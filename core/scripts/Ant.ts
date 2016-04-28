import { Vector } from './common/Vector';

import { Food } from './Food';
import { PheromoneGrid } from './PheromoneGrid';
import { AntHill } from './AntHill';
import { World } from './World';

import { CONFIG } from './Config';

export class Ant {
  private direction: Vector;
  private carriedFood: Food;
  private pheromoneLimit: number;

  constructor (private position: Vector) {
    this.direction = Vector.randomUnitVector();
    this.resetPheromoneLimit();
  }

  getPosition () {
    return this.position.round();
  }

  isAtAntHill (antHill: AntHill): boolean {
    return this.position.distance(antHill.position) < antHill.radius;
  }

  canReleasePheromone (): boolean {
    return this.pheromoneLimit > 0;
  }

  resetPheromoneLimit () {
    this.pheromoneLimit = CONFIG.ANT.PHEROMONE_LIMIT;
  }

  isOnPheromone (pheromoneGrid: PheromoneGrid) {
    return pheromoneGrid.get(this.position.round()).strength > 0;
  }

  releasePheromone (pheromoneGrid: PheromoneGrid) {
    if (!this.canReleasePheromone()) return;
    return pheromoneGrid.add(this.position.round());
  }

  releaseStrongerPheromone (pheromoneGrid: PheromoneGrid) {
    if (!this.canReleasePheromone()) return;
    return pheromoneGrid.add(this.position.round(), CONFIG.ANT.PHEROMONE_MULTIPLIER);
  }

  isCarryingFood (): boolean {
    return !!this.carriedFood;
  }

  findFood (foods: Array<Food>): Food {
    return foods.filter((food: Food) => {
      return (food && food.isOnGround && this.position.distance(food.position) < food.radius);
    }).shift();
  }

  pickUpFood (food: Food) {
    if (this.carriedFood) {
      throw new Error('Already carrying food');
    }

    food.isOnGround = false;
    this.carriedFood = food;
  }

  dropFood (): Food {
    if (!this.carriedFood) {
      throw new Error('Not carrying food');
    }

    let food = this.carriedFood;
    this.carriedFood = null;

    return food;
  }

  canTurnRationally (world: World): boolean {
    let rationality: number =
      this.isOnPheromone(world.pheromoneGrid) ? CONFIG.ANT.RATIONALITY_ON_PHEROMONE :
      CONFIG.ANT.RATIONALITY;

    return Math.random() < rationality;
  }

  getRandomRotation (): Vector {
    let rotation = Math.random() * 2 * CONFIG.ANT.MAX_ROTATION - CONFIG.ANT.MAX_ROTATION;
    return this.direction.rotate(rotation);
  }

  turnBackDirection (direction: Vector): Vector {
    return Vector.null.subtract(direction);
  }

  /**
  * Sense a pheromone in an arc of 3/8 * pi radians in direction, right in front of the ant.
  * Returns the direction of the found pheromone, as a vector, or null if none were found ? TODO.
  * If there are more than one, return the direction of the strongest.
  */
  getDirectionFromPheromone (pheromoneGrid: PheromoneGrid, direction: Vector): Vector {
    let strongestDirection: number = 0;
    let strongestStrength: number = 0;

    let forward = direction.toRadians();

    for (let radians = forward - Math.PI / 8; radians <= forward + Math.PI / 8; radians += Math.PI / 8) {
      let point = this.position.add(Vector.fromRadians(radians));
      let strength = pheromoneGrid.get(point.round()).strength;

      if (strength > strongestStrength) {
        strongestStrength = strength;
        strongestDirection = radians;
      }
    }

    if (strongestStrength) {
      return Vector.fromRadians(strongestDirection);
    }

    return null;
  }

  step (world: World) {
    let newDirection: Vector = this.direction;

    let pheromoneDirection = this.getDirectionFromPheromone(world.pheromoneGrid, this.direction);
    if (pheromoneDirection) {
      newDirection = pheromoneDirection;
    }

    if (this.isCarryingFood()) {
      if (this.isAtAntHill(world.antHill)) {
        world.removeFood(this.dropFood());
        this.resetPheromoneLimit();
        newDirection = this.turnBackDirection(this.direction);
      }
    } else {
      let food = this.findFood(world.foods);
      if (food) {
        this.pickUpFood(food);
        this.resetPheromoneLimit();
        newDirection = this.turnBackDirection(this.direction);
      }
    }

    if (!this.canTurnRationally(world)) {
      newDirection = this.getRandomRotation();
    }

    while (!world.rectangle.contains(this.position.add(newDirection))) {
      newDirection = Vector.randomUnitVector();
    }

    this.direction = newDirection;
    this.position = this.position.add(this.direction);
    this.pheromoneLimit -= 1;

    if (this.isCarryingFood()) {
      this.carriedFood.position = this.position;
      this.releaseStrongerPheromone(world.pheromoneGrid);
    } else {
      this.releasePheromone(world.pheromoneGrid);
    }
  }

  /** @deprecated */
  getText () {
  	return 'a';
  }

  /** @deprecated */
  getColour () {
  	return 'black';
  }

  /** @deprecated */
  getZIndex () {
  	return 5;
  }
}
