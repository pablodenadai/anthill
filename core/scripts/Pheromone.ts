import { Entity } from './common/Entity';
import { Vector } from './common/Vector';

import { CONFIG } from './Config';

export class Pheromone extends Entity {
  public render: Function;
  public destroy: Function;

  private dissipationInterval: number;

  constructor (protected position: Vector, protected radius: number, public strength: number) {
    super(position, radius);

    this.dissipationInterval = setInterval(this.dissipate.bind(this), 1000);
  }

  dissipate () {
    let oldStrenghToColorMap = this.getStrenghToColorMap(this.strength);

    this.strength -= CONFIG.PHEROMONE.DISSIPATION_RATE;

    if (this.strength < CONFIG.PHEROMONE.DISAPPEAR_THRESHOLD) {
      this.strength = 0;

      clearInterval(this.dissipationInterval);
      if (this.destroy) {
        this.destroy(this);
        return;
      }
    }

    let newtrenghToColorMap = this.getStrenghToColorMap(this.strength);

    if (oldStrenghToColorMap !== newtrenghToColorMap) {
      if (this.render) {
        this.render(this);
      }
    }
  }

  // add (strength: number) {
  //   this.strength += strength;
  //
  //   if (this.render) {
  //     this.render(this);
  //   }
  // }

  getStrenghToColorMap (value: number,
    inMin: number = 0, inMax: number = 10,
    outMin: number = 0, outMax: number = 1) {
    let map: number = (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    return Math.round(map * 100) / 100;
  }

  /**
   * @deprecated
   */
  getColour () {
  	let transparency: number = this.getStrenghToColorMap(this.strength, 0, 10, 0, 1);
  	return `rgba(255, 0, 0, ${transparency})`;
  }

  /**
   * @deprecated
   */
  getZIndex () {
  	return 1;
  }
}
