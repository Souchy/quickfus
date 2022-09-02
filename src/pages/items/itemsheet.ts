import { bindable, inject } from 'aurelia-framework';
import { build } from '../build/build';
import { itemsearch } from '../items/itemsearch';
import { Router } from 'aurelia-router';
import { db } from '../../db';

@inject(Router)
export class itemsheet {

	// @bindable property with <element property.bind="item"></element>
	@bindable private data: any = {};

	// check if this item has conditions
	// private hasConditions: boolean = false;

	public router: Router;

	public hidden = "hidden";


	// Ctor
	constructor(router: Router) {
		this.router = router;
		// this.hasConditions = "conditions" in this.data;
		// console.log("itemsheet");
	}

	public isntPseudo(effect) {
		let name: string = effect.name;
		return name.includes("(isntPseudo)");
	}

	public test() {
		// console.log("click " + this.data.name);
		if (!build.inst) {
			// build.inst = new build(() => this.router);
			window.setTimeout(() => build.setItem(this.data), 300);
		} else {
			build.setItem(this.data);
		}
		this.router.navigate("/build");
		// console.log("after nav");
		// window.setTimeout(() => build.setItem(this.data), 300);
	}

	public getImgUrl() {
		return db.getImgUrl(this.data);
	}

	// when binding is done
	attached() {
		// console.log("sheet data " + this.data);
		if (this.data && this.data.statistics) {
			// console.log("sheet stats " + this.data.statistics);
			this.data.statistics.forEach(element => {
				// console.log("sheet stat : " + JSON.stringify(element));
				element.style = db.getStatColor(element.name);
			});
		}

		// if (itemsearch.inst) itemsearch.inst.loadedCount++;
		if (itemsearch.inst) itemsearch.inst.onLoadedSheet();
		this.hidden = "";
	}

}
