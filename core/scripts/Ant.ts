import { Entity } from './common/Entity';
import { Vector } from './common/Vector';

import { Food } from './Food';
import { Pheromone } from './Pheromone';
import { PheromoneGrid } from './PheromoneGrid';
import { AntHill } from './AntHill';
import { World } from './World';

import { CONFIG } from './Config';

export class Ant extends Entity {
  private direction: Vector;
  private carriedFood: Food;
  private pheromoneLimit: number;

  constructor (protected position: Vector, protected radius: number) {
    super(position, radius);

    this.direction = Vector.randomUnitVector();
    this.resetPheromoneLimit();
  }

  isAtAntHill (antHill: AntHill): boolean {
    return this.position.distance(antHill.getPosition()) < antHill.radius + this.radius;
  }

  isOnPheromone (pheromoneGrid: PheromoneGrid) {
    let pheromone: Pheromone = pheromoneGrid.findPheromone(this.position, 1 + this.radius);
    return !!pheromone;
  }

  canReleasePheromone (): boolean {
    return this.pheromoneLimit > 0;
  }

  resetPheromoneLimit () {
    this.pheromoneLimit = CONFIG.ANT.PHEROMONE_LIMIT;
  }

  releasePheromone (pheromoneGrid: PheromoneGrid) {
    if (!this.canReleasePheromone()) return;
    return pheromoneGrid.add(this.position);
  }

  releaseStrongerPheromone (pheromoneGrid: PheromoneGrid) {
    if (!this.canReleasePheromone()) return;
    return pheromoneGrid.add(this.position, CONFIG.ANT.PHEROMONE_MULTIPLIER);
  }

  isCarryingFood (): boolean {
    return !!this.carriedFood;
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
      let point: Vector = this.position.add(Vector.fromRadians(radians));
      let pheromone: Pheromone = pheromoneGrid.findPheromone(point, 1);
      let strength: number = pheromone ? pheromone.strength : 0;

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
      let food = world.findFood(this.position);
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
      this.carriedFood.setPosition(this.position);
      this.releaseStrongerPheromone(world.pheromoneGrid);
    } else {
      this.releasePheromone(world.pheromoneGrid);
    }
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
