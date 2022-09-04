import { EnumStat } from './../../i18n';
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

  public compiledWeaponStats: string;
  public compiledConditions: string;

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

  bind(bindingContext: Object,overrideContext: Object) {
    // if(!this.data) return;
    this.compiledConditions = this.getConditions();
    this.compiledWeaponStats = this.getWeaponStats();
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

	public getIcon(mod): string {
    let style = db.getIconStyle(mod);
    // console.log("get icon for weapon effect: " + mod + " = " + style);
		return style;
	}

  public getConditions() {
    let root = this.data.conditions.conditions;

    let str: string = "";
    if(Object.keys(root).length > 0)
      str = this.writeConditionNode(root);
    str = str.substring(1, str.lastIndexOf(")"));
    // console.log("conds: " + str.substring(1, str.lastIndexOf(")")));
    return str;
  }

  public writeConditionNode(n: any) {
    let str: string = "";
    if(n.and) {
      str += this.writeConditionArray(n.and, " et ");
    } else 
    if(n.or) {
      str += this.writeConditionArray(n.or, " ou ");
    } else {
      str += EnumStat.props.get(n.stat) + " " + n.operator + " " + n.value;
    }
    return str;
  }

  public writeConditionArray(nodes: any[], separator: string) {
    let str: string = "";
    let first = true;
    for(let n of nodes) {
      if(first) first = false;
      else str += separator; 
      str += this.writeConditionNode(n);
    }
    str = "(" + str +")";
    // console.log("recurse on " + nodes + " = " + JSON.stringify(nodes));
    return str;
  }

  public getWeaponStats() {
    let stats = this.data.weaponStats;
    if(!stats) return;

    // <span>${data.weaponStats.apCost} PA</span>
    // <span>${data.weaponStats.minRange} à ${data.weaponStats.maxRange} Portée</span>
    let str: string = "";
    // String.jo
    let separator = " • ";
    let arr = new Array();

    arr.push(stats.apCost + " " + EnumStat.AP.fr);
    if(stats.minRange) {
      arr.push(stats.minRange + "-" + stats.maxRange + " " + EnumStat.RANGE.fr);
    } else {
      arr.push(stats.maxRange+ " " + EnumStat.RANGE.fr);
    }
    arr.push(stats.baseCritChance + "" + EnumStat.CRITICAL.fr + " " + "(+"+stats.critBonusDamage+")");
    arr.push(stats.usesPerTurn + " " + "par tour");

    str = arr.join(separator);
    return str;
  }

}
