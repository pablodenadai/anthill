import * as _ from 'lodash';

export class View {
	public $container: JQuery;
	public $elements: { [key: string]: JQuery };

	constructor (id: string, public scale) {
		this.$container = $(`#${id}`);
		this.$elements = {};
	}

	draw (elements) {
		elements.forEach((element) => {
			let id: string = element.getId();

			let zIndex: number = element.getZIndex();
			let color: string = element.getColour();
			let top: number = element.getPosition().x * this.scale;
			let left: number = element.getPosition().y * this.scale;
			let size: number = element.getRadius() * 2;

			let $element: JQuery = this.$elements[id];

			if ($element) {
				$element
					.css('left', `${top}px`)
					.css('top', `${left}px`);
				return;
			}

		 	$element = $(`
				<div style='
					z-index: ${zIndex};
					background-color: ${color};
					width: ${size}px;
					height: ${size}px;
					left: ${top}px;
					top: ${left}px;'>
				</div>`
			);

			this.$container.append($element);
			this.$elements[id] = $element;
		});
	}

	doClear () {
		this.$container.empty();
	}

	destroy () {
		this.$container.empty();
	}
}
