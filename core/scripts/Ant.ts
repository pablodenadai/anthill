import { Vector } from './common/Vector';

import { Food } from './Food';
import { PheromoneGrid } from './PheromoneGrid';
import { World } from './World';

import { CONFIG } from './Config';

export class Ant {
  public direction: Vector;
  public carriedFood: Food;

  constructor (public position: Vector) {
    this.direction = Vector.randomUnitVector();
  }

  isOnPheromone (pheromoneGrid: PheromoneGrid) {
    return pheromoneGrid.get(this.position) > 0;
  }

  /**
  * Will the ant turn according to rules, or just randomly?
  */
  turnRationally (): boolean {
    return Math.random() < CONFIG.ANT.RATIONALITY;
  }

  turnRandomly () {
    let rotation = Math.random() * 2 * CONFIG.ANT.MAX_ROTATION - CONFIG.ANT.MAX_ROTATION;
    this.direction = this.direction.rotate(rotation);
  }

  findFood (foods: Array<Food>): Food {
    return foods.filter((food: Food) => {
      return (food && food.isOnGround && this.position.distance(food.position) < food.radius);
    }).shift();
  }

  isAtAntHill (antHill): boolean {
    return this.position.distance(antHill.position) < antHill.radius;
  }

  isNextToAntHill (antHill): boolean {
    return this.position.distance(antHill.position) < (antHill.radius + 1);
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

  isCarryingFood (): boolean {
    return !!this.carriedFood;
  }

  /**
  * Sense a pheromone in an arc of 3/8 * pi radians in direction,
  * right in front of the ant.
  * Returns the direction of the found pheromone, as a vector, or
  * null if none were found.
  * If there are more than one, return the direction of the strongest.
  */
  sensePheromoneInDirection (pheromoneGrid: PheromoneGrid, direction: Vector): Vector {
    let strongestDirection: number = 0;
    let strongestStrength: number = 0;

    let forward = direction.toRadians()

    for (let radians = forward - Math.PI / 8; radians <= forward + Math.PI / 8; radians += Math.PI / 8) {
      let point = this.position.add(Vector.fromRadians(radians)).round();
      let strength = pheromoneGrid.get(point);

      if (strength > strongestStrength) {
        strongestStrength = strength
        strongestDirection = radians;
      }
    }

    return Vector.fromRadians(strongestDirection);
  }

  /**
  * Sense pheromone by "looking" in eight directions.
  * Return the direction that has the most pheromones in it.
  * All pheromones are equally weighted (strength not taken
  * into consideration), but the fact that coverage is decreasing
  * exponentially the further out from the ant you get
  * effectively means that pheromone further away is less
  * important.
  * Returns a vector or null.
  */
  senseDistantPheromone (pheromoneGrid): Vector {
    let directionStrengths = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let length = 0; length < CONFIG.ANT.SENSE_DISTANCE; length ++) {
      for (let direction = 0; direction < 8; direction ++) {
        let radians = direction * 2 * Math.PI / 8;
        let point = this.position.add(Vector.fromRadians(radians, length)).round();

        directionStrengths[direction] += pheromoneGrid.get(point);
      }
    }

    let strongestDirection = null;
    let strongestStrength = 0;

    for (let i = 0; i < 8; i++) {
      if (directionStrengths[i] > strongestStrength) {
        strongestDirection = i;
        strongestStrength = directionStrengths[i];
      }
    }

    if (strongestDirection === null) {
      return null;
    }

    return Vector.fromRadians(strongestDirection * 2 * Math.PI / 8);
  }

  /**
  * Apply the rules described in README.
  */
  step (world: World) {
    let newDirection: Vector;

    this.position = this.position.add(this.direction).round();

    if (this.isCarryingFood()) {
      this.carriedFood.position = this.position;

      if (this.isAtAntHill(world.antHill)) {
        world.removeFood(this.dropFood());
      }	else {
        if (this.isNextToAntHill(world.antHill)) {
          newDirection = this.position.directionTo(world.antHill.position);
        }	else if (this.isOnPheromone(world.pheromoneGrid)) {
          newDirection = this.sensePheromoneInDirection(world.pheromoneGrid, this.position.directionTo(world.antHill.position));
        } else {
          newDirection = this.position.directionTo(world.antHill.position);
        }

        world.pheromoneGrid.add(this.position);
      }
    } else {
      let food = this.findFood(world.foods);

      if (food) {
        this.pickUpFood(food);
        this.position = food.position;

        world.pheromoneGrid.add(this.position);
        newDirection = this.position.directionTo(world.antHill.position);
      }	else {
        if (this.isOnPheromone(world.pheromoneGrid)) {
          newDirection = this.sensePheromoneInDirection(world.pheromoneGrid, this.direction);
        } else {
          newDirection = this.senseDistantPheromone(world.pheromoneGrid);
        }
      }
    }

    if (!world.rectangle.contains(this.position, false, false)) {
      newDirection = this.position.directionTo(world.antHill.position);
    }

    if (newDirection && this.turnRationally()) {
      this.direction = newDirection;
    }	else {
      this.turnRandomly();
    }
  }

  /**
   * @deprecated
   */
  getText () {
  	return 'a';
  }

  /**
   * @deprecated
   */
  getColour () {
  	return 'black';
  }

  /**
   * @deprecated
   */
  getZIndex () {
  	return 5;
  }

  /**
   * @deprecated
   */
  getPosition () {
    return this.position;
  }
}
