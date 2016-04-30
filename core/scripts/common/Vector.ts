export class Vector {
  constructor (public x: number = 0, public y: number = 0) {}

  equals (vector2: Vector): boolean {
    return this.x === vector2.x && this.y === vector2.y;
  }

  distance (vector2: Vector): number {
    return Math.sqrt(
      Math.pow(this.x - vector2.x, 2) +
      Math.pow(this.y - vector2.y, 2)
    );
  }

  length (): number {
    return this.distance(Vector.null);
  }

  add (vector2: Vector) {
    return new Vector(
      this.x + vector2.x,
      this.y + vector2.y
    );
  }

  subtract (vector2: Vector): Vector {
    return new Vector(
      this.x - vector2.x,
      this.y - vector2.y
    );
  }

  multiply (scalar: number): Vector {
    return new Vector(
      this.x * scalar,
      this.y * scalar
    );
  }

  divide (scalar: number): Vector {
    return new Vector(
      this.x / scalar,
      this.y / scalar
    );
  }

  power (scalar: number): Vector {
    return new Vector(
      Math.pow(this.x, scalar),
      Math.pow(this.y, scalar)
    );
  }

  rotate (radians: number): Vector {
    return new Vector(
      this.x * Math.cos(radians) - this.y * Math.sin(radians),
      this.x * Math.sin(radians) + this.y * Math.cos(radians)
    );
  }

  directionTo (vector2: Vector): Vector {
    return Vector.fromRadians(Math.atan2(vector2.y - this.y, vector2.x - this.x));
  }

  meanDirectionTo (vectors: Array<Vector>): Vector {
    let vector2: Vector = Vector.mean(vectors);
    return Vector.fromRadians(Math.atan2(vector2.y - this.y, vector2.x - this.x));
  }

  /**
  * 0 <= radians < 2 * pi
  */
  toRadians (): number {
    let radians = Math.atan2(this.y, this.x);

    if (radians < 0) {
      radians = radians + 2 * Math.PI;
    }

    return radians;
  }

  round (): Vector {
    return new Vector(
      Math.round(this.x),
      Math.round(this.y)
    );
  }

  static up = new Vector(0, -1);
  static right = new Vector(1, 0);
  static down = new Vector(0, 1);
  static left = new Vector(-1, 0);
  static null = new Vector();

  static mean(vectors: Array<Vector>): Vector {
    return new Vector(
      vectors.reduce((x: number, v: Vector) => x + v.x, 0) / vectors.length,
      vectors.reduce((y: number, v: Vector) => y + v.y, 0) / vectors.length
    );
  }

  static randomUnitVector () {
    let angle = Math.random() * 2 * Math.PI;

    return new Vector(
      Math.cos(angle),
      Math.sin(angle)
    );
  }

  static fromRadians (radians: number, length: number = 1) {
    return new Vector(
      Math.cos(radians) * length,
      Math.sin(radians) * length
    );
  }
}
