import { bindable } from 'aurelia-framework';
import { db } from '../../../db'

export class Items {

	public data: any[];

	// <slot, item>
	@bindable public items: Map<string, any>;

	constructor() {
		// slot names
		this.data = db.getSlotNames();
		// console.log("slot names : " + this.data);
	}


	attached() {
		// if (this.items.has("Chapeau"))
		// console.log("attached chapeau : " + this.items.get("Chapeau").name); // good works
	}

}
