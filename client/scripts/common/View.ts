import * as _ from 'lodash';
import * as $ from 'jquery';

export class View {
	public $container: JQuery;
	public $elements: { [key: string]: JQuery };

	constructor (id: string) {
		this.$container = $(`#${id}`);
		this.$elements = {};
	}

	draw (element) {
		let id: string = element.getId();
		let zIndex: number = element.getZIndex();
		let color: string = element.getColour();
		let {x, y} = element.getPosition();
		let size: number = element.getRadius() * 2;

		let $element: JQuery = this.$elements[id];
		if ($element) {
			return $element.css({
				left: `${x}px`,
				top: `${y}px`,
				backgroundColor: color
			});
		}

	 	$element = $(`
			<div style='
				z-index: ${zIndex};
				background-color: ${color};
				width: ${size}px;
				height: ${size}px;
				left: ${x}px;
				top: ${y}px;'>
			</div>`
		);

		this.$container.append($element);
		this.$elements[id] = $element;
	}

	remove(e) {
		this.$elements[e.getId()].remove();
	}

	destroy () {
		this.$container.empty();
	}
}
