import * as $ from 'jquery';
import * as PIXI from 'pixi.js';

import { World } from '../../core/scripts/World';

import { View } from './common/View';

export class Main {
  public world: World;
  public view: View;
  public started: boolean;

  constructor() {
    // this.init();

    $('#startAnts').click(this.start.bind(this));
  }

  init () {
    this.view = new View('ants');

    this.world = new World();
    this.world.render = this.view.draw.bind(this.view);
    this.world.destroy = this.view.remove.bind(this.view);
    this.world.init();
    this.world.start();
  }

  start () {
    if (this.started) {
      this.view.destroy();
    }

    this.init();
    this.started = true;
  }
}

// export class Game {
//   constructor() {
//     this.init();
//   }
//
//   init () {
//     let renderer = PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0x1099bb });
//     document.body.appendChild(renderer.view);
//
//     // create the root of the scene graph
//     let stage = new PIXI.Container();
//
//     // create a texture from an image path
//     let texture = PIXI.Texture.fromImage('images/bunny.png');
//
//     // create a new Sprite using the texture
//     let bunny = new PIXI.Sprite(texture);
//
//     // center the sprite's anchor point
//     bunny.anchor.x = 0.5;
//     bunny.anchor.y = 0.5;
//
//     // move the sprite to the center of the screen
//     bunny.position.x = 200;
//     bunny.position.y = 150;
//
//     stage.addChild(bunny);
//
//     // start animating
//     animate();
//
//     function animate() {
//       requestAnimationFrame(animate);
//
//       // just for fun, let's rotate mr rabbit a little
//       bunny.rotation += 0.1;
//
//       // render the container
//       renderer.render(stage);
//     }
//   }
// }
