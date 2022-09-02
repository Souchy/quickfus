import { Router } from 'aurelia-router';
import { inject, bindable, computedFrom } from 'aurelia-framework';
import { db } from '../../../db';
//
// const styl = require('./slot1.css');
// 	styles = styl;


@inject(Router)
export class ItemSlot {

	public router: Router;

	// item object
	@bindable
	public item: any;

	// slot name
	@bindable
	public slotname: any;

	constructor(router: Router) {
		this.router = router;
	}

	// go search items
	public onclick() {
		// location.href = "/items";
		this.router.navigate("/items");
	}

	attached() {
		var itemname = this.item ? this.item.name : "undefined";
		// console.log("itemslot attached [" + itemname + "] : " + this.slotname); //this.getImgUrl());
	}

	@computedFrom('item')
	public get imgUrl(): string {
		return db.getImgUrl(this.item);
	}

	public test() {
		return "hi";;
	}

}
