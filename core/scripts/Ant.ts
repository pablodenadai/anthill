import { Vector } from './common/Vector';

import { Food } from './Food';
import { PheromoneGrid } from './PheromoneGrid';
import { AntHill } from './AntHill';
import { World } from './World';

import { CONFIG } from './Config';

export class Ant {
  public direction: Vector;
  public carriedFood: Food;

  constructor (public position: Vector) {
    this.direction = Vector.randomUnitVector();
  }

  isAtAntHill (antHill: AntHill): boolean {
    return this.position.distance(antHill.position) < antHill.radius;
  }

  isOnPheromone (pheromoneGrid: PheromoneGrid) {
    return pheromoneGrid.get(this.position) > 0;
  }

  releasePheromone (pheromoneGrid: PheromoneGrid) {
    return pheromoneGrid.add(this.position);
  }

  releaseStrongerPheromone (pheromoneGrid: PheromoneGrid) {
    return pheromoneGrid.add(this.position, CONFIG.PHEROMONE.MULTIPLIER);
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

  canTurnRationally (): boolean {
    return Math.random() < CONFIG.ANT.RATIONALITY;
  }

  getRandomRotation (): Vector {
    let rotation = Math.random() * 2 * CONFIG.ANT.MAX_ROTATION - CONFIG.ANT.MAX_ROTATION;
    return this.direction.rotate(rotation);
  }

  // turnaround () {
  //   return this.direction.rotate(Math.PI);
  // }

  /**
  * Sense a pheromone in an arc of 3/8 * pi radians in direction, right in front of the ant.
  * Returns the direction of the found pheromone, as a vector, or null if none were found ? TODO.
  * If there are more than one, return the direction of the strongest.
  */
  sensePheromoneInDirection (pheromoneGrid: PheromoneGrid, direction: Vector): Vector {
    let strongestDirection: number = 0;
    let strongestStrength: number = 0;

    let forward = direction.toRadians();

    for (let radians = forward - Math.PI / 8; radians <= forward + Math.PI / 8; radians += Math.PI / 8) {
      let point = this.position.add(Vector.fromRadians(radians)).round();
      let strength = pheromoneGrid.get(point);

      if (strength > strongestStrength) {
        strongestStrength = strength;
        strongestDirection = radians;
      }
    }

    return Vector.fromRadians(strongestDirection);
  }

  step (world: World) {
    let newDirection: Vector;

    if (this.isCarryingFood()) {
      this.releaseStrongerPheromone(world.pheromoneGrid);

      if (this.isAtAntHill(world.antHill)) {
        world.removeFood(this.dropFood());
        newDirection = this.getRandomRotation();
      } else if (this.isOnPheromone(world.pheromoneGrid)) {
        // review this - direction ?
        newDirection = this.sensePheromoneInDirection(world.pheromoneGrid, this.direction);
      }
    } else {
      this.releasePheromone(world.pheromoneGrid);

      let food = this.findFood(world.foods);
      if (food) {
        this.pickUpFood(food);
        // newDirection = this.getPrevious();
        // go back
      }
    }

    if (!newDirection) {
      // go straight ahead
    }

    if (!this.canTurnRationally()) {
      newDirection = this.getRandomRotation();
    }

    if (!world.rectangle.contains(this.position)) {
      newDirection = this.position.directionTo(world.antHill.position);
    }


    this.direction = newDirection;
    this.position = this.position
      .add(this.direction)
      .round();

    if (this.isCarryingFood()) {
      this.carriedFood.position = this.position;
    }


    // let newDirection: Vector;
    //
    // this.position = this.position.add(this.direction).round();
    //
    // if (this.isCarryingFood()) {
    //   this.carriedFood.position = this.position;
    //
    //   if (this.isAtAntHill(world.antHill)) {
    //     world.removeFood(this.dropFood());
    //   }	else {
    //     if (this.isNextToAntHill(world.antHill)) {
    //       newDirection = this.position.directionTo(world.antHill.position);
    //     }	else if (this.isOnPheromone(world.pheromoneGrid)) {
    //       newDirection = this.sensePheromoneInDirection(world.pheromoneGrid, this.position.directionTo(world.antHill.position));
    //     } else {
    //       newDirection = this.position.directionTo(world.antHill.position);
    //     }
    //
    //     world.pheromoneGrid.add(this.position);
    //   }
    // } else {
    //   let food = this.findFood(world.foods);
    //
    //   if (food) {
    //     this.pickUpFood(food);
    //     this.position = food.position;
    //
    //     world.pheromoneGrid.add(this.position);
    //     newDirection = this.position.directionTo(world.antHill.position);
    //   }	else {
    //     if (this.isOnPheromone(world.pheromoneGrid)) {
    //       newDirection = this.sensePheromoneInDirection(world.pheromoneGrid, this.direction);
    //     } else {
    //       newDirection = this.senseDistantPheromone(world.pheromoneGrid);
    //     }
    //   }
    // }
    //
    // if (!world.rectangle.contains(this.position, false, false)) {
    //   newDirection = this.position.directionTo(world.antHill.position);
    // }
    //
    // if (newDirection && this.turnRationally()) {
    //   this.direction = newDirection;
    // }	else {
    //   this.turnRandomly();
    // }
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
