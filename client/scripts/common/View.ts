// import * as _ from 'lodash';
// import * as $ from 'jquery';
//
// export class View {
// 	public $container: JQuery;
// 	public $elements: { [key: string]: JQuery };
// 	public $removedElements: { [key: string]: JQuery };
//
// 	constructor (id: string, public scale) {
// 		this.$container = $(`#${id}`);
// 		this.$elements = {};
// 		this.$removedElements = {};
// 	}
//
// 	draw (elements: Array<any>) {
// 		elements.forEach((element) => {
// 			let id: string = element.getId();
//
// 			let zIndex: number = element.getZIndex();
// 			let color: string = element.getColour();
// 			let left: number = Math.round(element.getPosition().x * this.scale * 100) / 100;
// 			let top: number = Math.round(element.getPosition().y * this.scale * 100) / 100;
// 			let size: number = element.getRadius() * 2;
//
// 			delete this.$removedElements[id];
//
// 			let $element: JQuery = this.$elements[id];
// 			if ($element) {
// 				$element
// 					.css('left', `${left}px`)
// 					.css('top', `${top}px`)
// 					.css('background-color', color);
// 				return;
// 			}
//
// 		 	$element = $(`
// 				<div style='
// 					z-index: ${zIndex};
// 					background-color: ${color};
// 					width: ${size}px;
// 					height: ${size}px;
// 					left: ${left}px;
// 					top: ${top}px;'>
// 				</div>`
// 			);
//
// 			this.$container.append($element);
// 			this.$elements[id] = $element;
// 		});
//
// 		_.forEach(this.$removedElements, ($element: JQuery) => {
// 			$element.remove();
// 		});
//
// 		this.$removedElements = _.clone(this.$elements);
// 	}
//
// 	destroy () {
// 		this.$container.empty();
// 	}
// }




import * as _ from 'lodash';
import * as $ from 'jquery';

export class View {
	public $container: JQuery;
	public $elements: { [key: string]: JQuery };

	constructor (id: string, public scale) {
		this.$container = $(`#${id}`);
		this.$elements = {};
	}

	draw ({updated, deleted}) {
		_.forEach(updated, (element) => {
			let id: string = element.getId();
			let zIndex: number = element.getZIndex();
			let color: string = element.getColour();
			let left: number = Math.round(element.getPosition().x * this.scale * 100) / 100;
			let top: number = Math.round(element.getPosition().y * this.scale * 100) / 100;
			let size: number = element.getRadius() * 2;

			let $element: JQuery = this.$elements[id];
			if ($element) {
				return $element.css({
					left: `${left}px`,
					top: `${top}px`,
					backgroundColor: color
				});
			}

		 	$element = $(`
				<div style='
					z-index: ${zIndex};
					background-color: ${color};
					width: ${size}px;
					height: ${size}px;
					left: ${left}px;
					top: ${top}px;'>
				</div>`
			);

			this.$container.append($element);
			this.$elements[id] = $element;
		});

		_.forEach(deleted, (element) => {
			let id = element.getId();

			let $element: JQuery = this.$elements[id];
			if ($element) {
				$element.remove();
			}
		});
	}

	destroy () {
		this.$container.empty();
	}
}
