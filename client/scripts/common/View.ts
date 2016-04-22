export class View {
	public $container: JQuery;
	public extraDrawActions: Array<any>;

	constructor (id: string, public scale) {
		this.$container = $(`#${id}`);
		this.extraDrawActions = [];
	}

	draw (elements) {
		this.doClear();

		elements.forEach((element) => {
			this.$container.append($(`
				<div style='
					z-index: ${element.getZIndex()};
					color: ${element.getColour()};
					left: ${(element.getPosition().x * this.scale)}px;
					top: ${(element.getPosition().y * this.scale)}px;'>
				${element.getText()}
				</div>`
			));
		});

		this.extraDrawActions.forEach((extraDrawAction) => {
			if (extraDrawAction.draw) {
				extraDrawAction.draw();
			}
		});
	}

	doClear () {
		this.$container.empty();
	}

	destroy () {
		this.$container.empty();
	}
}
