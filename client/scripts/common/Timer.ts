/**
* A ticking timer, for ASCII animation
*/

export class Timer {
	public intervalId: number;
	public tick: Function;

	constructor (public fps: number) {}

	start () {
		this.intervalId = setInterval(() => {
	    if (this.tick) {
				this.tick();
			}
	  }, 1000 / this.fps);
	}

	stop () {
	  if (this.intervalId) {
	    clearInterval(this.intervalId);
	    this.intervalId = null;
	  }
	}
}
