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

  private stepInterval: number;

  constructor (protected position: Vector, protected radius: number, private world: World) {
    super(position, radius);

    this.direction = Vector.randomUnitVector();
    this.resetPheromoneLimit();
  }

  leaveAntHill () {
    this.stepInterval = setInterval(this.step.bind(this), 100);
  }

  isAtAntHill (antHill: AntHill): boolean {
    return antHill.isAt(this.getPosition(), this.radius);
  }

  isOnPheromone (pheromoneList: PheromoneList) {
    let pheromone: Pheromone = pheromoneList.find(this.getPosition());
    return !!pheromone;
  }

  canReleasePheromone (): boolean {
    return this.pheromoneLimit > 0;
  }

  resetPheromoneLimit () {
    this.pheromoneLimit = CONFIG.ANT.PHEROMONE_LIMIT;
  }

  releasePheromone (pheromoneList: PheromoneList) {
    if (!this.canReleasePheromone()) return;
    this.pheromoneLimit--;
    let multiplier: number = this.isCarryingFood() ? CONFIG.ANT.PHEROMONE_MULTIPLIER : 1;
    return pheromoneList.add(this.getPosition(), multiplier);
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
      this.isOnPheromone(world.pheromoneList) ?
        this.isCarryingFood() ? 1 :
        CONFIG.ANT.RATIONALITY_ON_PHEROMONE :
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
    let left = forward - Math.PI / 5;
    let right = forward + Math.PI / 5;

    [left, right].forEach((radians: number) => {
      let antennaDirection: Vector = Vector.fromRadians(radians, this.radius + 2);
      let antennaPoint: Vector = this.position.add(antennaDirection);

      let pheromonesUnderAntenna: Array<Pheromone> = pheromoneList.filterP(antennaPoint, 1);
      if (pheromonesUnderAntenna.length) {
        // debugger;
        let vectors: Array<Vector> = pheromonesUnderAntenna.map((p: Pheromone) => p.getPosition() );
        let strength: number = pheromoneList.reduce((x: number, v: Pheromone) => x + v.strength, 0);

        // if (this.isCarryingFood()) {
        //   if (strength > 0 && strength < strongestStrength) {
        //     strongestStrength = strength;
        //     strongestDirection = this.position.meanDirectionTo(vectors).toRadians();
        //   }
        // } else {
          if (strength > strongestStrength) {
            strongestStrength = strength;
            strongestDirection = this.position.meanDirectionTo(vectors).toRadians();
          // }
        }
      }
    });

    if (strongestStrength) {
      return Vector.fromRadians(strongestDirection);
    }

    return null;
  }

  setPosition (newDirection: Vector) {
    let stepSize = 2;
    let redirectTries: number = 5;

    while (!this.world.rectangle.contains(this.position.add(newDirection.multiply(stepSize))) && redirectTries > 0) {
      newDirection = Vector.randomUnitVector();
      redirectTries--;
      if (!redirectTries) {
        newDirection = this.oppositeDirection(this.direction);
      }
    }

    let newPosition = this.position.add(newDirection.multiply(stepSize));

    if (this.isCarryingFood()) {
      this.carriedFood.setPosition(newPosition);
    }

    this.direction = newDirection;
    super.setPosition(newPosition);
  }

  getNewDirection (): Vector {
    if (this.isCarryingFood()) {
      if (this.isAtAntHill(this.world.antHill)) {
        this.world.foodList.remove(this.dropFood());
        this.resetPheromoneLimit();
        return this.oppositeDirection(this.direction);
      }
    }

    let food = this.world.foodList.find(this.position, this.radius);
    if (food) {
      this.pickUpFood(food);
      this.resetPheromoneLimit();
      return this.oppositeDirection(this.direction);
    }

    let newDirection: Vector = this.direction;

    if (this.canTurnRationally(this.world)) {
      let pheromoneDirection = this.directionToPheromone(this.world.pheromoneList, this.direction);
      if (pheromoneDirection) {
        newDirection = pheromoneDirection;
      }
    } else {
      newDirection = this.randomRotation();
    }

    return newDirection;
  }

  step () {
    let newDirection: Vector = this.getNewDirection();
    this.releasePheromone(this.world.pheromoneList);
    this.setPosition(newDirection);
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
