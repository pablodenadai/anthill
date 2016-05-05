import { Entity } from './common/Entity';
import { Vector } from './common/Vector';
import { Rectangle } from './common/Rectangle';

import { Food } from './Food';
import { FoodCollection } from './FoodCollection';
import { Pheromone } from './Pheromone';
import { PheromoneCollection } from './PheromoneCollection';
import { AntHill } from './AntHill';
import { World } from './World';

import { CONFIG } from './Config';

export class Ant extends Entity {
  private direction: Vector;
  private carriedFood: Food;
  private pheromoneLimit: number;

  private stepInterval: number;

  constructor (
    private antHill: AntHill,
    private foodCollection: FoodCollection,
    private pheromoneCollection: PheromoneCollection,

    protected position: Vector = CONFIG.ANTHILL.POSITION,
    protected radius: number = CONFIG.ANT.RADIUS,
    protected rectangle: Rectangle = CONFIG.WORLD.RECTANGLE
  ) {
    super(position, radius);

    this.direction = Vector.randomUnitVector();
    this.resetPheromoneLimit();
  }

  leaveAntHill () {
    this.step();
    this.stepInterval = setInterval(this.step.bind(this), 100);
  }

  isAtAntHill (): boolean {
    return this.antHill.isAt(this);
  }

  isOnPheromone () {
    let pheromone: Pheromone = this.pheromoneCollection.findOneAt(this);
    return !!pheromone;
  }

  canReleasePheromone (): boolean {
    return this.pheromoneLimit > 0;
  }

  resetPheromoneLimit () {
    this.pheromoneLimit = CONFIG.ANT.PHEROMONE_LIMIT;
  }

  releasePheromone () {
    if (!this.canReleasePheromone()) return;
    this.pheromoneLimit--;
    let stronger: boolean = this.isCarryingFood();
    return this.pheromoneCollection.create(this.position.subtract(this.direction.multiply(this.radius)), stronger);
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

  canTurnRationally (): boolean {
    let rationality: number = this.isOnPheromone() ? this.isCarryingFood() ? 1 :
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

  getPheromoesUnderAntenna (antennaPoint: Entity): { direction: Vector, strength: number } {
    let direction: Vector;
    let strength: number = 0;

    let pheromonesUnderAntenna: Array<Pheromone> = this.pheromoneCollection.findAnyAt(antennaPoint);
    if (pheromonesUnderAntenna.length) {
      let vectors: Array<Vector> = pheromonesUnderAntenna.map((p: Pheromone) => p.getPosition() );

      direction = this.position.meanDirectionTo(vectors);
      strength = pheromonesUnderAntenna.reduce((x: number, v: Pheromone) => x + v.strength, 0);
    }

    return { direction, strength };
  };

  /**
  * Sense a pheromone in an arc of 3/8 * pi radians in direction, right in front of the ant.
  * Returns the direction of the found pheromone, as a vector, or null if none were found ? TODO.
  * If there are more than one, return the direction of the strongest.
  */
  directionToPheromone (direction: Vector): Vector {
    let antennaLength: number = this.radius + 1;
    let antennaRadius: number = 1;

    let forward: number = direction.toRadians();
    let left: Vector = Vector.fromRadians(forward - Math.PI / 8, antennaLength);
    let right: Vector = Vector.fromRadians(forward + Math.PI / 8, antennaLength);

    let antennaLeft: Entity = new Entity(this.position.add(left), antennaRadius);
    let antennaRight: Entity = new Entity(this.position.add(right), antennaRadius);

    let pheromonesLeft = this.getPheromoesUnderAntenna(antennaLeft);
    let pheromonesRight = this.getPheromoesUnderAntenna(antennaRight);

    // If can't detect pheromone or both strength are the same
    if (pheromonesLeft.strength === pheromonesRight.strength) {
      return null;
    }

    return pheromonesLeft.strength > pheromonesRight.strength ?
      pheromonesLeft.direction : pheromonesRight.direction;
  }

  setPosition (newDirection: Vector) {
    let stepSize = 2;

    let redirectTries: number = 5;
    while (!this.rectangle.contains(this.position.add(newDirection.multiply(stepSize))) && redirectTries > 0) {
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
      if (this.isAtAntHill()) {
        this.foodCollection.delete(this.dropFood());
        this.resetPheromoneLimit();
        return this.oppositeDirection(this.direction);
      }
    } else {
      let food = this.foodCollection.findOneAt(this);
      if (food) {
        this.pickUpFood(food);
        this.resetPheromoneLimit();
        return this.oppositeDirection(this.direction);
      }
    }

    let newDirection: Vector = this.direction;

    if (this.canTurnRationally()) {
      let pheromoneDirection = this.directionToPheromone(this.direction);
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
    this.releasePheromone();
    this.setPosition(newDirection);
  }
}
