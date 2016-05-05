import { Entity } from './common/Entity';
import { Vector } from './common/Vector';
import { Events } from './common/Events';

import { CONFIG } from './Config';

export class Pheromone extends Entity {
  private dissipationInterval: number;

  constructor (protected position: Vector, protected radius: number, public strength: number) {
    super(position, radius);
    this.dissipationInterval = setInterval(this.dissipate.bind(this), 1000);
  }

  dissipate () {
    this.strength -= CONFIG.PHEROMONE.DISSIPATION_RATE;
    if (this.strength < CONFIG.PHEROMONE.DISAPPEAR_THRESHOLD) {
      this.strength = 0;
      clearInterval(this.dissipationInterval);
      this.emitter.emit(Events.Delete, this);
      return;
    }
  }
}
