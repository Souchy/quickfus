import { bindable, inject } from 'aurelia-framework';
import { build } from '../build/build';
import { setsearch } from '../sets/setsearch';
import { Router } from 'aurelia-router';
import { db } from '../../db';

@inject(Router)
export class setsheet {

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

	// equip the set
	public equip() {
		for (let item of this.data.items) {
			// console.log("equip " + item.name.fr);
			if (!build.inst) {
				// build.inst = new build(() => this.router);
				window.setTimeout(() => build.setItem(item), 300);
			} else {
				build.setItem(item);
			}
		}
		this.router.navigate("/build");
		// console.log("after nav");
		// window.setTimeout(() => build.setItem(this.data), 300);
	}

	// when binding is done
	attached() {
		// if (setsearch.inst) setsearch.inst.loadedCount++;
		if (setsearch.inst) setsearch.inst.onLoadedSheet();
		this.hidden = "";
	}

	public getStatColor(stat) {
		return db.getStatColor(stat);
	}

	public hoverSet() {
		// console.log("hover set");
	}
	public hoverItem() {
		// console.log("hover item");
	}

  public getImgUrl(item) {
    return db.getImgUrl(item);
  }

}
