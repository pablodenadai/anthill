import { View } from './View';
import { Timer } from './Timer';

export class Controller {
	public timer: Timer;
	public onComplete: Function;

	private previousElements: Array<any>;

	constructor (public model, public view: View, fps: number) {
		this.timer = new Timer(fps);
		this.timer.tick = () => {
			this.step();
		};

		this.previousElements = [];

		this.model.onComplete = () => {
			this.timer.stop();
			if (this.onComplete) {
				// a final draw
				this.view.draw(this.getElements());
				this.onComplete();
			}
		};
	}

	getElements () {
		// let keyValue = (element) => {
		// 	return {
		// 		[element.id]: element
		// 	}
		// // };
		//
		//
		// let previousElements = this.previousElements; //.map(keyValue);
		// let currentElements = this.model.elements; //.map(keyValue);
		//
		// let created = this.model.elements.filter((element) =>
		// 	this.previousElements.indexOf(element) < 0 );
		//
		// let updated
		//
		// this.previousElements = currentElements;
		//
		// return {
		// 	created,
		// 	updated,
		// 	deleted
		// };

		return this.model.elements();
	}

	start () {
	  this.view.draw(this.getElements());
	  this.timer.start();
	}

	step () {
	  this.model.step();
	  this.view.draw(this.getElements());
	}

	destroy () {
	  this.timer.stop(); // clear old timer
	  this.view.destroy();
	  this.model.destroy();
	}
}
