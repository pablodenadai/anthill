import { Entity } from './common/Entity';
import { Vector } from './common/Vector';

import { CONFIG } from './Config';

export class AntHill extends Entity {
  constructor (
    protected position: Vector = CONFIG.ANTHILL.POSITION,
    protected radius: number = CONFIG.ANTHILL.RADIUS
  ) {
    super(position, radius);
  }
}
