import { bindable } from 'aurelia-framework';
import { build } from '../../build';
import { db } from '../../../../db';

export class basestats {

	public statnames: string[];

	@bindable 
  public stats: Map<string, number>;
	@bindable 
  public scrolls: Map<string, number>;

	constructor() {
		this.statnames = db.getBaseStatNames();
	}

	public onChangeBase(name) {
		// console.log("onchange base stat : " + name + "=" + doc.valueAsNumber);
		var doc = document.getElementById("basestat-" + name) as HTMLInputElement;
		build.setBaseStat(name, doc.valueAsNumber);
    build.inst.save();
	}

	public onChangeScroll(name) {
		// console.log("onchange base stat : " + name + "=" + doc.valueAsNumber);
		var doc = document.getElementById("scrollstat-" + name) as HTMLInputElement;
		build.setScrollStat(name, doc.valueAsNumber);
    build.inst.save();
	}

}
