import { View } from './View';
import { Timer } from './Timer';

export class Controller {
	public timer: Timer;
	public onComplete: Function;

	constructor (public model, public view: View, fps: number) {
		this.timer = new Timer(fps);

		this.timer.tick = () => {
			this.step();
		};

		this.model.onComplete = () => {
			this.timer.stop();
			if (this.onComplete) {
				// a final draw
				this.view.draw(this.model.elements());
				this.onComplete();
			}
		}
	}

	start () {
	  this.view.draw(this.model.elements());
	  this.timer.start();
	}

	step () {
	  this.model.step();
	  this.view.draw(this.model.elements());
	}

	destroy () {
	  this.timer.stop(); // clear old timer
	  this.view.destroy();
	  this.model.destroy();
	}
}
