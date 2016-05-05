import 'svg.js';

import { Pheromone } from '../../../core/scripts/Pheromone';

export class View {
	public stage: svgjs.Doc;
	public $elements: { [key: string]: svgjs.Shape };

	private shapes = {
		AntHill: ({id, cx, cy, radius}) =>
			this.stage.circle(radius * 2).attr({ id, cx, cy, radius, fill: 'blue' }),

		Food: ({id, cx, cy, radius}) =>
			this.stage.circle(radius * 2).attr({ id, cx, cy, radius, fill: 'green' }),

		Ant: ({id, cx, cy, radius}) =>
			this.stage.circle(radius * 2).attr({ id, cx, cy, radius, fill: 'black' }),

		Pheromone: ({ id, cx, cy, radius, stronger }) =>
			this.stage.circle(radius * 2).attr({ id, cx, cy, radius, fill: 'red', class: `pheromone ${stronger ? 'stronger' : ''}` }),
	};

	constructor (id: string) {
		this.stage = SVG(id).size(500, 250);
		this.$elements = {};
	}

	getElementProperties (element) {
		let id: string = element.getId();
		let {x, y} = element.getPosition();
		let radius: number = element.getRadius();

		return {id, cx: x, cy: y, radius};
	}

	draw (element) {
		let {id, cx, cy, radius} = this.getElementProperties(element);
		this.$elements[id] = this.shapes[element.constructor.name]({id, cx, cy, radius});
	}

	redraw (element) {
		let {id, cx, cy} = this.getElementProperties(element);

		let $element: svgjs.Shape =  this.$elements[id];
		if (!$element) {
			console.warn('Trying to redraw nonexistent element', element);
			return;
		}

		$element.move(cx, cy);
	}

	remove(element) {
		let {id} = this.getElementProperties(element);
		this.$elements[id].remove();
	}

	destroy () {
		this.stage.clear();
		this.$elements = {};
	}
}
