export class ModFilter {
	public name: string;
	public min: number;
	public max: number;
	public activate: boolean = true;
	public constructor() {
	}
}

export class statmod {

	public name: string;
	public min: number;
	public max: number;
	public activate: boolean = true;
	public boxCount: number = 2; // if 1 or 2 number inputs. (exo stat or min/max setting)


	public modsref: statmod[];

	public constructor() {

	}

	public onModInputFocus(that, event, blockid, modid) {
		// console.log("onFocusModInput [" + blockid + "," + modid + "] : " + that);
		$(event.target).closest(".searchable").find("dl").show();
		$(event.target).closest(".searchable").find("dl section dd").show();
	}
	public onModInputBlur(that, event, blockid, modid) {
		// console.log("onModInputBlur [" + blockid + "," + modid + "] : " + that);
		setTimeout(function() {
			$(event.target).closest(".searchable").find("dl").hide();
		}, 300);
	}
	public oninput(that, event) {
		// console.log("oninput : " + that + " - " + event.target);
		// console.log("blocks : " + JSON.stringify(this.blocks[0]));
	}
	public onDDHover(that, event, blockid, modid, modname) {
		// console.log("onHover : " + JSON.stringify(this.blocks));
		$(event.target).closest(".searchable").find("dl section dd.selected").removeClass("selected");
		$(event.target).addClass("selected");
	}
	public onDDClick(that, event, blockid, modid, modname) {
		// console.log("onDDClick : " + event);
		// console.log("blocks : " + JSON.stringify(filter.inst.blocks));
		// this is the DD list element
		let ele: HTMLElement = event.target; //event.currentTarget;

		// this.blocks[blockid].mods[modid].name = modname; //$(ele).text();
		this.modsref[modid].name = modname;

		let input = $(ele).closest(".searchable").find("input");
		input.blur();

		// console.log("blocks : " + JSON.stringify(filter.inst.blocks[0]));
	}


}
