import { inject, bindable, View, observable } from 'aurelia-framework';
import { itemsearch } from './itemsearch';
import { db } from '../../db';
import * as $ from 'jquery';

export class filter {

	public static inst: filter;

	// Static data
	public modsSections: Map<string, string[]>;
	public styleChecked: any;
	public styleUnchecked: any;

	// custom filter data
	public filterText: string = "";
	public levelMin: number = 0;
	public levelMax: number = 200;
	public types: Map<string, boolean>;
	public armes: Map<string, boolean>;
	public filterLevel: boolean = true;
	@observable({ changeHandler: 'filterTypeChanged' })
	public filterType: boolean = false;
	@observable({ changeHandler: 'filterWeaponChanged' })
	public filterWeapon: boolean = false;
	// mods blocks
	public blocks: BlockFilter[];

	// html elements
	public blocklist: HTMLDivElement;
	// public modsearch: any;
	// public modsearchinput: any;
	// public modsearchlist: any;

	constructor() {
		filter.inst = this;

		this.modsSections = new Map<string, string[]>();
		this.modsSections.set("Pseudo", [
			"(Pseudo) # res",
			"(Pseudo) # res élémentaires",
			"(Pseudo) Total #% res",
			"(Pseudo) Total #% res élémentaires",
		]);
		db.getStatNames().forEach((v, k) => {
			this.modsSections.set(k, v);
		});

		this.types = new Map<string, boolean>();
		this.armes = new Map<string, boolean>();
		db.getItemsTypes().concat(db.getPetTypes()).forEach(s => {
			this.types.set(s, false);
		});
		db.getWeaponsTypes().forEach(s => {
			this.armes.set(s, false);
		});

		this.styleChecked = {
			color: "var(--front1)",
			background: "var(--accent1)",
		};
		this.styleUnchecked = {
			color: "var(--front0)",
			background: "transparent",
		};

		this.blocks = [];
		this.addBlock();
		this.loadFilter();

		this.search();

		// console.log("blocks : " + JSON.stringify(this.blocks[0]));
	}

	public created(owningView: View, myView: View) {
	}
	public bind(bindingContext: Object, overrideContext: Object) {
		// console.log("bind blocklist : " + this.blocklist);
	}
	public attached() {
		window.addEventListener('keypress', this.handleKeyInput, false);
	}
	public detached() {
		window.removeEventListener('keypress', this.handleKeyInput);
	}
	public unbind() {
	}

	public handleKeyInput = (event) => {
		if (event.key == "Enter") this.search();
	}

	public search() {
		itemsearch.inst.search(this);
		this.saveFilter();
	}

	public loadFilter() {
		let json = localStorage.getItem("filter");
		if (json) {
			let data = JSON.parse(json);
			this.filterLevel = data.filterLevel;
			this.filterText = data.filterText;
			this.levelMin = data.levelMin;
			this.levelMax = data.levelMax;
			this.types = new Map<string, boolean>(data.types);
			this.armes = new Map<string, boolean>(data.armes);
			this.filterLevel = data.filterLevel;
			this.filterType = data.filterType;
			this.filterWeapon = data.filterWeapon;
			this.blocks = data.blocks;
		}
	}
	public saveFilter() {
		let obj = {
			filterText: this.filterText,
			levelMin: this.levelMin,
			levelMax: this.levelMax,
			types: Array.from(this.types.entries()),
			armes: Array.from(this.armes.entries()),
			filterLevel: this.filterLevel,
			filterType: this.filterType,
			filterWeapon: this.filterWeapon,
			blocks: this.blocks
		};
		localStorage.setItem("filter", JSON.stringify(obj));
	}

	public setBlock(blockIndex: number, type: string, args: number[]) {
		// args would be like min/max if the type is Sum
		this.blocks[blockIndex].type = type;
		this.blocks[blockIndex].min = args[0];
		this.blocks[blockIndex].max = args[1];
		this.blocks[blockIndex].activate = true;
		this.blocks[blockIndex].mods = [];
	}
	public deleteBlock(blockIndex: number) {
		this.blocks.splice(blockIndex, 1);
	}

	public setMod(blockIndex: number, mod: string, args: number[]) {
		// if (!this.blocks[blockIndex].mods.has(mod)) {
		// 	this.blocks[blockIndex].mods.set(mod, {});
		// }

		let m = this.blocks[blockIndex].mods.find(e => e.name == mod);
		if (!m) {
			m = new ModFilter();
			this.blocks[blockIndex].mods.push(m); //mod, args[0], args[1], true));
		}
		// else {
		// args would be min/max normally
		m.name = mod
		if (args.length > 0) m.min = args[0];
		if (args.length > 1) m.max = args[1];
		m.activate = true;
		// }
	}
	public deleteMod(blockIndex: number, mod: string) {
		// this.blocks[blockIndex].mods.delete(mod);
		let m = this.blocks[blockIndex].mods.find(e => e.name == mod);
		if (m) {
			let i = this.blocks[blockIndex].mods.indexOf(m);
			this.blocks[blockIndex].mods.splice(i, 1);
		}
	}

	public filterTypeClicked() {
		var activated = this.filterType;
		this.types.forEach((value, key) => this.types.set(key, !activated));
	}
	public checkType(type) {
		var activated = this.types.get(type);
		this.types.set(type, !activated);
		this.filterType = this.hasValue(this.types, true);
	}
	public filterWeaponClicked() {
		var activated = this.filterWeapon;
		this.armes.forEach((value, key) => this.armes.set(key, !activated));
	}
	public checkWeapon(arme) {
		this.armes.set(arme, !this.armes.get(arme));
		this.filterWeapon = this.hasValue(this.armes, true);
	}


	private hasValue(map: Map<string, boolean>, value: boolean) {
		for (const [key, val] of Array.from(map.entries())) {
			if (val == value) return true;
		}
		return false;
	}

	/* When the user clicks on the button,
	toggle between hiding and showing the dropdown content */
	public myFunction() {
		document.getElementById("myDropdown").classList.toggle("show");
	}
	public filterFunction() {
		var input, filter, ul, li, a, i;
		input = document.getElementById("myInput");
		filter = input.value.toUpperCase();
		var div = document.getElementById("myDropdown");
		a = div.getElementsByTagName("a");
		for (i = 0; i < a.length; i++) {
			var txtValue = a[i].textContent || a[i].innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				a[i].style.display = "";
			} else {
				a[i].style.display = "none";
			}
		}
	}





	public filterFunction2(that, event) {
		// console.log("filter that : " + event.target);
		let container, input, filter, li, input_val;
		container = $(event.target).closest("searchable");
		input = container.find("input");
		// console.log("filter input : " + input + ", val : " + input.val());
		input_val = input.val() + "";
		if (input_val == "undefined") input_val = "";
		input_val = input_val.toUpperCase();
		if (["ArrowDown", "ArrowUp", "Enter"].indexOf(event.key) != -1) {
			this.keyControl(event, container)
		} else {
			li = container.find("dl dd");
			li.each(function(i, obj) {
				if ($(this).text().toUpperCase().indexOf(input_val) > -1) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});
			container.find("dl dd").removeClass("selected");
			setTimeout(function() {
				container.find("dl dd:visible").first().addClass("selected");
			}, 100)
		}
	}
	public keyControl(e, container) {
		if (e.key == "ArrowDown") {
			if (container.find("dl dd").hasClass("selected")) {
				if (container.find("dl dd:visible").index(container.find("dl dd.selected")) + 1 < container.find("dl dd:visible").length) {
					container.find("dl dd.selected").removeClass("selected").nextAll().not('[style*="display: none"]').first().addClass("selected");
				}
			} else {
				let dd = container.find("dl dd:first-child");
				// console.log("first dd : " + dd.html());
				container.find("dl dd:first-child").addClass("selected");
			}
		} else if (e.key == "ArrowUp") {
			if (container.find("dl dd:visible").index(container.find("dl dd.selected")) > 0) {
				container.find("dl dd.selected").removeClass("selected").prevAll().not('[style*="display: none"]').first().addClass("selected");
			}
		} else if (e.key == "Enter") {
			container.find("input").val(container.find("dl dd.selected").text()).blur();
			this.onSelect(container.find("dl dd.selected").text())
		}
		let selectedDD = container.find("dl dd.selected")[0];
		// console.log("selectedDD " + selectedDD);
		if (selectedDD) {
			// selectedDD.scrollIntoView({
			// 	behavior: "smooth",
			// });
		}
	}

	public onSelect(val) {
		// alert(val)
	}





	public addBlock() {
		this.blocks.push({
			type: "$and",
			min: 0,
			max: 0,
			mods: [new ModFilter()], //new Map<string, any>(),
			activate: true,
		});
	}
	public addStatMod(that, event, blockid: number) {
		this.blocks[blockid].mods.push(new ModFilter());

		let ele: HTMLElement = event.target;
		// console.log("addStatMod : " + ele.parentElement.children.item(1));

		$(ele.parentElement.children.item(1)).show();
		// $(event.target).closest(".searchable").find("dl section dd").show();
		// $(event.target).closest(".searchable").find("input").focus();
	}
	public onModInputFocus(that, event, blockid, modid) {
		// console.log("onFocusModInput [" + blockid + "," + modid + "] : " + that);
		$(event.target).closest(".searchable").find("dl").show();
		$(event.target).closest(".searchable").find("dl section dd").show();
	}
	public onModInputBlur(that, event, blockid, modid) {
		// console.log("onModInputBlur [" + blockid + "," + modid + "] : " + that);
		// let that = this;
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

		// let modelement = ele.parentElement.parentElement.parentElement;
		// let blockelement = modelement.parentElement;

		// let oldmod = ele.parentElement.parentElement.parentElement.id;
		// let blockId = Number.parseInt(ele.parentElement.parentElement.parentElement.parentElement.id);
		// this.setMod(blockId, ele.innerHTML, []);
		// let blockid = Number.parseInt(blockelement.id);
		// let modid = modelement.id;

		this.blocks[blockid].mods[modid].name = modname; //$(ele).text();

		// let val = $(ele).text(); // ele.innerHTML
		// this.onSelect(val);

		let input = $(ele).closest(".searchable").find("input");
		input.blur();
		// let modlist = ele.parentElement;
		// modlist.blur();

		// input.val(val).blur();
		// let inp: HTMLInputElement = input.va

		// $(this).closest(".searchable").find("input").val($(this).text()).blur();
		// this.onSelect($(this).text())

		// console.log("blocks : " + JSON.stringify(filter.inst.blocks[0]));
	}



}



export class BlockFilter {
	public type: string = "And";
	public min: number;
	public max: number;
	public activate: boolean = true;
	public mods: ModFilter[] = [];
	public constructor() {
	}
	// public constructor(type: string, min: number, max: number, activate: boolean, mods?: ModFilter[]) {
	// }
}

export class ModFilter {
	public name: string;
	public min: number;
	public max: number;
	public activate: boolean = true;
	public constructor() {
	}
	// public constructor(name: string, min: number, max: number, activate: boolean) {
	// 	if(name) this.name = name;
	// 	if(min)this.min = min;
	// 	if(max)this.max = max;
	// 	if(activate)this.activate = activate;
	// }
}
