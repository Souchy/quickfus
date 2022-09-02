import { bindable } from 'aurelia-framework';
import { db } from '../../../../db';

export class combatstats {

	// public keys: string[];

	@bindable
	public stats: Map<string, number>;

	constructor() {
		// this.keys = db.getCombatStatsNames();
		// vita, pa/pm,
		// esquive pa/pm, tacle,
		// résists éléments fix/%
		// résists poussée/critique
	}


	public get elements(): string[] {
		return db.getElementsNames();
	}
	public get combatkeys(): string[] {
		return db.getCombatStatsNames();
	}

	public getIcon(mod): string {
		return db.getIconStyle(mod);
	}

}
