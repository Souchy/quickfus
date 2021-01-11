import { bindable } from 'aurelia-framework';
import { db } from '../../../../db';

export class totalstats {

	@bindable public stats: Map<string, number>;

	public sections: Map<string, any>;

	constructor() {
		this.sections = db.getStatNames();
		// console.log("hello totals, sections : " + JSON.stringify(Array.from(db.getStatNames().entries())));
	}

	public get(name) {
		if (this.stats.has(name))
			return this.stats.get(name);
		else
			return 0;
	}

	public getIcon(mod): string {
		return db.getIconStyle(mod);
	}


	// public get sections() {
	// 	return db.getStatNames();
	// }


}
