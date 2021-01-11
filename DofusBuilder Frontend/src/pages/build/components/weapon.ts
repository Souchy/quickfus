import { bindable } from 'aurelia-framework';
import { build } from '../build';
import { db } from '../../../db';

export class damage {
	public name: string = "";
	public min: number = 0;
	public max: number = 0;
	public minCrit: number = 0;
	public maxCrit: number = 0;
}


export class weapon {

	@bindable
	public data: build;

	public item: any;
	public damages: damage[];
	public total: damage;

	public constructor() {

	}

	public attached() {
		this.item = this.data.items.get("Arme");
		if (this.hasWeapon) this.calculate();
	}

	public get hasWeapon(): boolean {
		return this.data.items.has("Arme");
	}

	public get characteristics() {
		return db.getWeaponCharacteristics();
	}

	public getImgUrl() {
		return db.getImgUrl(this.item);
	}

	public calculate() {
		this.damages = [];
		let stats: any[] = this.item.statistics;
		let mods = stats.filter(obj => {
			return obj.name.startsWith("(dommages ") || obj.name.startsWith("(vol ");
		});
		let dmgCrit = 0;
		let crit = 0;
		let cc: string = this.item.characteristics[2]["CC"] || "";
		if (cc) {
			// let critvars = cc.split(" ");
			// crit = critvars[0];
			let dmgcrit0 = cc.split("+")[1];
			dmgCrit = parseInt(dmgcrit0.substring(0, dmgcrit0.length - 1));
			// console.log("dmg crit : " + dmgCrit);
		}

		mods.forEach(mod => {
			let name: string = mod.name;
			let val = 0;
			let ele = "";
			let d = "";
			if (mod.name.includes("dommages Neutre")) {
				ele = "Force";
				d = "Neutre";
			} else if (mod.name.includes("dommages") || mod.name.includes("vol")) {
				ele = name.split(" ")[1];
				ele = ele.substr(0, ele.length - 1);
				d = "Dommages " + ele;
				ele = db.getStatByElement(ele);
			} else if (mod.name.includes("soin")) {
			}

			let dmg = new damage();
			dmg.min = this.formula(mod.min, ele, d);
			dmg.max = this.formula(mod.max, ele, d);
			dmg.name = mod.name;

			dmg.minCrit = this.formula(mod.min + dmgCrit, ele, d);
			dmg.maxCrit = this.formula(mod.max + dmgCrit, ele, d);

			// console.log("dmg : " + JSON.stringify(dmg));

			this.damages.push(dmg);
		});

		this.total = new damage();
		this.damages.forEach(d => {
			this.total.min += d.min;
			this.total.max += d.max;
			this.total.minCrit += d.minCrit;
			this.total.maxCrit += d.maxCrit;
		})
	}

	public formula(base: number, ele: string, d: string) {
		let stat = this.data.stats.get(ele) || 0;
		let pui = this.data.stats.get("Puissance") || 0;
		let dom = this.data.stats.get(d) || 0;
		let dom2 = this.data.stats.get("Dommages") || 0;
		let weapondmg = this.data.stats.get("% Dommages d'armes") || 0;

		// console.log("formula (" + ele + ":" + stat + ") ");
		// console.log("pui : " + pui);
		// console.log("dom : " + dom);
		// console.log("dom2 : " + dom2);
		// console.log("weapondmg : " + weapondmg);

		let dmg = base
			* ((100 + stat + pui) / 100)
			+ (dom + dom2);
		dmg = dmg * ((100 + weapondmg) / 100);
		return Math.floor(dmg);
	}

}
