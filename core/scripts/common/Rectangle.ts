import { Vector } from './Vector';

export class Rectangle {
  public topLeft: Vector;
  public bottomRight: Vector;

  constructor (arg1: number, arg2: number, arg3: number, arg4: number) {
    // if (typeof arg4 == "undefined") {
    //   this.topLeft = arg1;
    //   this.bottomRight = arg2;
    // }
    // else {
    //   this.topLeft = new Vector(arg1, arg2);
    //   this.bottomRight = new Vector(arg3, arg4);
    // }

    this.topLeft = new Vector(arg1, arg2);
    this.bottomRight = new Vector(arg3, arg4);
  }

  width () {
    return this.bottomRight.x - this.topLeft.x;
  }

  height () {
    return this.bottomRight.y - this.topLeft.y;
  }

  area () {
    return this.width() * this.height();
  }

  contains (point: Vector, includeTopLeft: boolean = false, includeBottomRight: boolean = false) {
    return (
      includeTopLeft ?
      this.topLeft.x <= point.x && this.topLeft.y <= point.y :
      this.topLeft.x < point.x && this.topLeft.y < point.y
    ) && (
      includeBottomRight ?
      this.bottomRight.x >= point.x && this.bottomRight.y >= point.y :
      this.bottomRight.x > point.x && this.bottomRight.y > point.y
    );
  }
}
