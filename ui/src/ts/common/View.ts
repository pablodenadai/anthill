export class View {
	public $container: HTMLElement;
	public extraDrawActions: Array<>;

	constructor (id: string, public scale, public clear: boolean = true, public viewArea) {
		this.$container = $("#" + id);
	  this.extraDrawActions = [];
	}

	draw (elements) {
	  if (this.clear) {
	    this.doClear();
		}

		elements.forEach((element) => {
			if (element && (!this.viewArea || this.viewArea.contains(element.getPosition))) {
	      this.$container.append($(`
					<div
						style='z-index: ${element.getZIndex()};
	                 color: ${element.getColour()};
									 left: ${(element.getPosition().x * this.scale)}px;
	 								 top: ${(element.getPosition().y * this.scale)}px;
					>
						${element.getText()}
					</div>`
				));
	    }
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
