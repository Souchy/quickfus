import { bindable } from 'aurelia-framework';
import { build } from '../../build';
import { db } from '../../../../db';

export class basestats {

	public statnames: string[];

	@bindable public stats: Map<string, number>;

	constructor() {
		this.statnames = db.getBaseStatNames();
	}

	public onchange(name) {
		// console.log("onchange base stat : " + JSON.stringify(name));
		// console.log("change : " + name + "=" + value);
		// console.log("agi : " + this.stats.get("Agilité"));

		// var name = event.target.id;

		var doc = document.getElementById("basestat-" + name) as HTMLInputElement;
		// console.log("onchange base stat : " + name + "=" + doc.valueAsNumber);

		build.setBaseStat(name, doc.valueAsNumber);
		// return true;
	}


	// public test() {
	// 	console.log("hi");
	// }

}
