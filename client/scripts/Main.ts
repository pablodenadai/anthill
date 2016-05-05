import { World } from '../../core/scripts/World';
import { Events } from '../../core/scripts/common/Events';

import { View } from './common/View';

export class Main {
  public world: World;
  public view: View;
  public started: boolean;

  constructor() {
    this.view = new View('stage');

    document
      .getElementById('start')
      .addEventListener('click', this.start.bind(this));
  }

  init () {
    this.world = new World();
    this.bindEvents();
    this.world.start();
  }

  bindEvents () {
    this.world.emitter.addListener(Events.Create, this.view.draw.bind(this.view));
    this.world.emitter.addListener(Events.Update, this.view.redraw.bind(this.view));
    this.world.emitter.addListener(Events.Delete, this.view.remove.bind(this.view));
  }

  unbindEvents () {
    this.world.emitter.removeAllListeners();
  }

  start () {
    if (this.started) {
      this.unbindEvents();
      this.view.destroy();
    }

    this.init();
    this.started = true;
  }
}
