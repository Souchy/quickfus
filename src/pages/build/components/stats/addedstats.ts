import { bindable } from 'aurelia-framework';
import { db } from '../../../../db';
import { build } from '../../build';

export class addedstats {

	// Static data
	public modsSections: Map<string, string[]>;

	// custom exos
	@bindable
	public stats: Map<string, number>;

	constructor() {
		this.modsSections = db.getStatNames();
	}

	/*
	public addStatMod(that, event, blockid: number) {
		// this.blocks[blockid].mods.push(new ModFilter());
		this.stats.set("", )

		let ele: HTMLElement = event.target;
		console.log("addStatMod : " + ele.parentElement.children.item(1));

		$(ele.parentElement.children.item(1)).show();
		// $(event.target).closest(".searchable").find("dl section dd").show();
		// $(event.target).closest(".searchable").find("input").focus();
	}
	*/

	public onChangeExo(name) {
		console.log("onChangeExo stat : " + name + "=" + doc.valueAsNumber);
		var doc = document.getElementById("exostat-" + name) as HTMLInputElement;
    build.setExo(name, doc.valueAsNumber);
    build.inst.save();
	}

	public onModInputFocus(that, event, blockid, modid) {
		console.log("onFocusModInput [" + blockid + "," + modid + "] : " + that);
		$(event.target).closest(".searchable").find("dl").show();
		$(event.target).closest(".searchable").find("dl section dd").show();
	}
	public onModInputBlur(that, event, blockid, modid) {
		console.log("onModInputBlur [" + blockid + "," + modid + "] : " + that);
		// let that = this;
		setTimeout(function() {
			$(event.target).closest(".searchable").find("dl").hide();
		}, 300);
	}
	public oninput(that, event) {
		console.log("oninput : " + that + " - " + event.target);
		console.log("blocks : " + JSON.stringify(Array.from(this.stats.entries())));  //JSON.stringify(this.blocks[0]));
	}
	public onDDHover(that, event, blockid, modid, modname) {
		console.log("onDDHover : " + JSON.stringify(Array.from(this.stats.entries())));  //JSON.stringify(this.blocks));
		$(event.target).closest(".searchable").find("dl section dd.selected").removeClass("selected");
		$(event.target).addClass("selected");
	}
	public onDDClick(that, event, oldname, modname) {
		console.log("onDDClick : " + event);
		// console.log("blocks : " + JSON.stringify(filter.inst.blocks));
		// this is the DD list element
		let ele: HTMLElement = event.target; //event.currentTarget;

		// if(!this.stats.has(modname)){
		// 		// si le mod n'existait pas avant, ça veut dire que c'est un nouveau
		// 		// donc on doit remettre un champs vide pour
		// }

		// this.blocks[blockid].mods[modid].name = modname;
		if (oldname == "new") {
			this.stats.set(modname, 0);
		} else {
			let oldval = this.stats.get(oldname);
			this.stats.delete(oldname);
			this.stats.set(modname, oldval);
		}

		let input = $(ele).closest(".searchable").find("input");
		input.blur();

		console.log("blocks : " + JSON.stringify(Array.from(this.stats.entries()))); //filter.inst.blocks[0]));
	}



}
