import { World } from '../../core/scripts/World';

import { View } from './common/View';
import { Controller } from './common/Controller';

export class Main {
  public world: World;
  public view: View;
  public controller: Controller;
  public started: boolean;

  constructor() {
    this.init();

    $('#startAnts').click(this.start.bind(this));
  }

  init () {
    this.world = new World();
    this.world.start();

    for (let i = 0; i < 100; i++) {
      this.world.step();
    }

    for (let i = 0; i < 8; i++) {
      this.world.createFood(true);
    }

    this.view = new View('ants', 10);
    this.controller = new Controller(this.world, this.view, 10);
  }

  start () {
    if (this.started) {
      this.controller.destroy();
      this.init();
    }

    this.controller.start();
    this.started = true;
  }
}
