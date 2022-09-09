import { bindable } from 'aurelia-framework';
import { build } from '../build';
import { db } from '../../../db';

export class sets {

	// @bindable public sets: any[];
	@bindable public sets: Map<any, number>;

	constructor() {
	}

	attached() {

	}

  
  public getBonuses(set, itemCount) {
    // console.log("sets getBonuses: " + itemCount + ", " + set + "");
    if(!set) return;
    if(!set.bonuses) return;
    let bonuses = set.bonuses[set.items.length - itemCount];
    if(!bonuses) return;
    return bonuses;
  }

	public getStatColor(stat) {
		return db.getStatColor(stat);
	}

}
