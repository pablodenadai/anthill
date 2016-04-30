import { Entity } from './common/Entity';
import { Vector } from './common/Vector';

import { Food } from './Food';
import { Pheromone } from './Pheromone';
import { PheromoneList } from './PheromoneList';
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
    return antHill.isAt(this.position, this.radius);
  }

  isOnPheromone (pheromoneList: PheromoneList) {
    let pheromones: Array<Pheromone> = pheromoneList.find(this.position, 1);
    return !!pheromones.length;
  }

  canReleasePheromone (): boolean {
    return this.pheromoneLimit > 0;
  }

  resetPheromoneLimit () {
    this.pheromoneLimit = CONFIG.ANT.PHEROMONE_LIMIT;
  }

  releasePheromone (pheromoneList: PheromoneList, stronger: boolean = false) {
    if (!this.canReleasePheromone()) return;

    let point: Vector = this.position;

    let multiplier: number = stronger ?
      CONFIG.ANT.PHEROMONE_MULTIPLIER : 1;

    return pheromoneList.add(point, multiplier);
  }

  releaseStrongerPheromone (pheromoneList: PheromoneList) {
    return this.releasePheromone(pheromoneList, true);
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
      this.isOnPheromone(world.pheromoneList) ? CONFIG.ANT.RATIONALITY_ON_PHEROMONE :
      CONFIG.ANT.RATIONALITY;

    return Math.random() < rationality;
  }

  randomRotation (): Vector {
    let rotation = Math.random() * 2 * CONFIG.ANT.MAX_ROTATION - CONFIG.ANT.MAX_ROTATION;
    return this.direction.rotate(rotation);
  }

  oppositeDirection (direction: Vector): Vector {
    return Vector.null.subtract(direction);
  }

  /**
  * Sense a pheromone in an arc of 3/8 * pi radians in direction, right in front of the ant.
  * Returns the direction of the found pheromone, as a vector, or null if none were found ? TODO.
  * If there are more than one, return the direction of the strongest.
  */
  directionToPheromone (pheromoneList: PheromoneList, direction: Vector): Vector {
    let strongestDirection: number = 0;
    let strongestStrength: number = 0;

    let forward = direction.toRadians();
    let left = forward - Math.PI / 8;
    let right = forward + Math.PI / 8;

    [left, right].forEach((radians: number) => {
      let antennaDirection: Vector = Vector.fromRadians(radians, 3);
      let antennaPoint: Vector = this.position.add(antennaDirection);

      let pheromonesUnderAntenna: Array<Pheromone> = pheromoneList.find(antennaPoint, 1);
      if (pheromonesUnderAntenna.length) {
        // debugger;
        let vectors: Array<Vector> = pheromonesUnderAntenna.map((p: Pheromone) => p.getPosition() );
        let strength: number = pheromoneList.reduce((x: number, v: Pheromone) => x + v.strength, 0);

        if (strength > strongestStrength) {
          strongestStrength = strength;
          strongestDirection = this.position.meanDirectionTo(vectors).toRadians();
        }
      }
    });

    if (strongestStrength) {
      return Vector.fromRadians(strongestDirection);
    }

    return null;
  }

  step (world: World) {
    let newDirection: Vector = this.direction;

    let pheromoneDirection = this.directionToPheromone(world.pheromoneList, this.direction);
    if (pheromoneDirection) {
      newDirection = pheromoneDirection;
    }

    if (this.isCarryingFood()) {
      if (this.isAtAntHill(world.antHill)) {
        world.foodList.remove(this.dropFood());
        this.resetPheromoneLimit();
        newDirection = this.oppositeDirection(this.direction);
      }
    } else {
      let food = world.foodList.find(this.position);
      if (food) {
        this.pickUpFood(food);
        this.resetPheromoneLimit();
        newDirection = this.oppositeDirection(this.direction);
      }
    }

    if (!this.canTurnRationally(world)) {
      newDirection = this.randomRotation();
    }

    while (!world.rectangle.contains(this.position.add(newDirection))) {
      newDirection = Vector.randomUnitVector();
    }

    if (this.isCarryingFood()) {
      this.releaseStrongerPheromone(world.pheromoneList);
    } else {
      this.releasePheromone(world.pheromoneList);
    }

    this.direction = newDirection;
    this.position = this.position.add(this.direction);
    if (this.isCarryingFood()) {
      this.carriedFood.setPosition(this.position);
    }
    this.pheromoneLimit -= 1;
  }

  /** @deprecated */
  getColour () {
  	return 'rgb(0, 0, 0)';
  }

  /** @deprecated */
  getZIndex () {
  	return 5;
  }
}
