import { inject, PLATFORM, lazy } from 'aurelia-framework';
import { builds } from '../builds/builds';
import { db } from '../../db';
import { WebAPI } from '../../api';
import { Router } from 'aurelia-router';
import * as Hashkit from 'hashkit';

@inject(Router)
export class build {

	public static inst: build;

	private api: WebAPI;
	public router: Router;

	// build name
	public name: string;
	// items
	public items: Map<string, any>;
	// sets (id, set object)
	public sets: any[] = []; //Map<number, any>;
	// total stats
	public stats: Map<string, number>;
	// base stats
	public bases: Map<string, number>;
	// exo stats
	public exos: Map<string, number>;
	// faudrait faire une map parchos aussi

	public static nextRing: number = 1;
	public static nextDofus: number = 1;
	public static hash = new Hashkit();

	constructor(@lazy(Router) private getRouter: () => Router) {
		// console.log("ctor build");
		// this.router = router;
		this.api = new WebAPI();
		build.inst = this;
	}

	public activate(params, routeConfig) {
		let data = params.data; //build.hash.decode(params.data);
		// console.log("activate build data : " + data);
		this.clear(false);
		if (data != undefined && data != null) {
			this.importsmol(data);
		}
	}

	public importsmol(data: string) {
		// data = { name: "", items: [], bases: [] };
		let split = data.split("-");
		let name = split[0];
		let bases = split.slice(1, 6).map(i => build.hash.decode(i));
		let items = split.slice(7).map(i => build.hash.decode(i));
		// let obj = JSON.parse(data);
		// get all items
		this.api.getItems([{
			ankamaId: { $in: items }
		}]).then(r => {
			// name
			this.name = name;
			build.setName(this.name);
			// set all items from returned array
			r.content.forEach(i => build.setItem(i, true));
			// save items
			build.setItems(this.items);
			// save bases
			for (let e = 0; e < bases.length; e++) {
				this.bases.set(db.getBaseStatNames()[e], bases[e]);
			}
			build.setBases(this.bases);
			// save exos
			var exos = new Map<string, number>();
			exos.set("PA", 1);
			exos.set("PM", 1);
			build.setExos(exos);
			// save sets
			build.calcSets(this.items);
			// this.save();
			// this.reloadTotalStats();
		});
	}

	// ----------------------------------------------  View methods ----------------------------------------------

	public clear(force: boolean) {
		if (!localStorage.getItem("build.name") || force) build.setName("unnamed build");
		if (!localStorage.getItem("build.sets") || force) build.setSets([]);
		if (!localStorage.getItem("build.items") || force) build.setItems(new Map<string, any>());
		if (!localStorage.getItem("build.bases") || force) {
			var bases = new Map<string, number>();
			bases.set("Vitalité", 100);
			bases.set("Sagesse", 100);
			bases.set("Force", 100);
			bases.set("Intelligence", 100);
			bases.set("Chance", 100);
			bases.set("Agilité", 100);
			build.setBases(bases);
		}
		if (!localStorage.getItem("build.exos") || force) {
			var exos = new Map<string, number>();
			exos.set("PA", 1);
			exos.set("PM", 1);
			build.setExos(exos);
		}
		// pas besoin de reset les stats car on le fait dans this.reloadTotalStats();

		build.inst.name = build.getName();
		build.inst.stats = build.getStats();
		build.inst.sets = build.getSets();
		build.inst.items = build.getItems();
		build.inst.bases = build.getBases();
		build.inst.exos = build.getExos();

		this.reloadTotalStats();

		// if (force) {
		// 	// reload la page après un reset/new build pour reset l'affichage des stats et des images d'items. tout le reste est bindé sauf ça.
		// 	// TODO le navigate ne reload pas la page
		// 	this.router.navigate("/build");
		// }
	}

	public save() {
		builds.save(this);
	}
	public export() {
		return JSON.stringify({
			"name": this.name,
			"items": Array.from(this.items.entries()),
			"stats": Array.from(this.stats.entries()),
			"bases": Array.from(this.bases.entries()),
			"exos": Array.from(this.exos.entries()),
			"sets": this.sets
		});
	}

	// ----------------------------------------------  Static methods ----------------------------------------------

	public static import(json: string) {
		if (json == null) {
			build.inst.clear(true); return;
		}
		var b = JSON.parse(json);
		var obj = {
			"name": b.name,
			"items": new Map<string, any>(b.items),
			"stats": new Map<string, number>(b.stats),
			"bases": new Map<string, number>(b.bases),
			"exos": new Map<string, number>(b.exos),
			"sets": b.sets,
		};
		build.setName(obj.name);
		build.setSets(obj.sets);
		build.setItems(obj.items);
		build.setStats(obj.stats);
		build.setBases(obj.bases);
		build.setExos(obj.exos);
	}

	// public static load(b) {
	// 	build.setName(b.name);
	// 	build.setSets(b.sets);
	// 	build.setItems(b.items);
	// 	build.setStats(b.stats);
	// 	build.setBases(b.bases);
	// 	build.setExos(b.exos);
	// }

	public reloadTotalStats() {
		// reset stats
		this.stats.clear();
		build.setStats(this.stats);
		// add stats
		build.addTotalStat("Vie", 1050);
		build.addTotalStat("PA", 6 + 1);
		build.addTotalStat("PM", 3);
		build.addTotalStat("Prospection", 100);

		this.items.forEach((v, k) => {
			build.addItemStats(v);
			// build.setItem(v, true);
		});
		this.bases.forEach((v, k) => {
			build.addTotalStat(k, v);
		});
		this.exos.forEach((v, k) => {
			build.addTotalStat(k, v);
		});
		// console.log("reload stats sets : " + JSON.stringify(this.sets));
		this.sets.forEach((v, k) => {
			build.addSet(v);
		});
		// calcule initiative
		db.getElementsStats().forEach(s => {
			if (this.stats.has(s)) {
				build.addTotalStat("Initiative", this.stats.get(s));
			}
		});
		// calcule vie totale
		if (this.stats.has("Vitalité")) {
			build.addTotalStat("Vie", this.stats.get("Vitalité"));
		}
		// calcule retrait et esquive
		if (this.stats.has("Sagesse")) {
			let sa = this.stats.get("Sagesse");
			build.addTotalStat("Retrait PA", Math.floor(sa / 10));
			build.addTotalStat("Retrait PM", Math.floor(sa / 10));
			build.addTotalStat("Esquive PA", Math.floor(sa / 10));
			build.addTotalStat("Esquive PM", Math.floor(sa / 10));
		}
		// calcule fuite et tacle
		if (this.stats.has("Agilité")) {
			let agi = this.stats.get("Agilité");
			build.addTotalStat("Fuite", Math.floor(agi / 10));
			build.addTotalStat("Tacle", Math.floor(agi / 10));
		}
		// calcule prospection
		if (this.stats.has("Chance")) {
			let cha = this.stats.get("Chance");
			build.addTotalStat("Prospection", Math.floor(cha / 10));
		}
	}

	private static addSet(set) {
		// console.log("build.addSet : " + JSON.stringify(set));
		if (set.bonus && set.bonus.stats) {
			// console.log("set has bonuses");
			set.bonus.stats.forEach(stat => {
				// console.log("set has stat : " + JSON.stringify(stat));
				if (stat.max) {
					build.addTotalStat(stat.name, Number.parseInt(stat.max));
				} else {
					build.addTotalStat(stat.name, Number.parseInt(stat.min));
				}
			});
		}
	}

	public static addItemStats(item) {
		if (item.statistics) {
			item.statistics.forEach(stat => {
				if (stat.max) {
					build.addTotalStat(stat.name, stat.max);
				} else {
					build.addTotalStat(stat.name, stat.min);
				}
			});
		}
	}

	public static calcSets(items: Map<string, any>) {
		build.inst.sets = [];
		build.setSets(build.inst.sets);
		// console.log("build sets 1 : " + build.inst.sets);
		// calcule le nombre d'items par panoplie
		let setCounts = {};
		items.forEach((v, k) => {
			if (v.setId > 0) {
				if (!setCounts[v.setId]) setCounts[v.setId] = 1;
				else setCounts[v.setId] += 1;
			}
		});
		// ajoute les stats des panos
		let setkeys = Object.keys(setCounts);
		setkeys.forEach(id => {
			if (setCounts[id] > 1) {
				// console.log("set [" + id + "] : " + setCounts[id]);
				build.inst.api.getSet(id).then(response => {
					let set = response.content;
					build.inst.sets.push(set);
					build.addSet(set);
					build.setSets(build.inst.sets);
					build.inst.reloadTotalStats();
					// console.log("build sets 2 : " + build.inst.sets);
				});
			}
		});
	}

	public static setItem(item, reset?) {
		var items: Map<string, any> = build.getItems();
		var slot: string = item.type;
		if (item.type == "Anneau") {
			slot = "Anneau" + build.nextRing;
			if (build.nextRing < 2) {
				build.nextRing++;
			} else if (build.nextRing == 2) {
				build.nextRing = 1;
			}
		}
		if (item.type == "Dofus" || item.type == "Trophée" || item.type == "Prysmaradite") {
			slot = "Dofus" + build.nextDofus;
			if (build.nextDofus < 6) {
				build.nextDofus++;
			} else if (build.nextRing >= 6) {
				build.nextDofus = 1;
			}
		}
		if (item.type == "Sac à dos") {
			slot = "Cape";
		}
		if (db.getWeaponsTypes().indexOf(item.type) != -1) {
			slot = "Arme";
		}
		if (db.getPetTypes().indexOf(item.type) != -1) {
			slot = "Familier";
		}
		console.log("build.setItem slot : " + slot + " (" + item.type + ")");
		if (db.getSlotNames().indexOf(slot) == -1) {
			console.log("build.setItem bad slot : " + slot);
			return;
		}
		// enlève les stats existantes
		if (!reset) build.removeItem(slot);

		// if(reset){
		// ajoute les stats du nouvel item
		if (item.statistics) {
			item.statistics.forEach(stat => {
				if (stat.max) {
					build.addTotalStat(stat.name, stat.max);
				} else {
					build.addTotalStat(stat.name, stat.min);
				}
			});
		}
		// }

		// console.log("set item : " + slot + " = " + item.name);
		// set l'item dans la map
		items.set(slot, item);
		// save items in local storage
		build.setItems(items);

		// recalcule les panoplies
		if (!reset) {
			this.calcSets(items);
		}

		// save build
		build.inst.save();
	}

	public static removeItem(slot: string) {
		var items: Map<string, any> = build.getItems();
		var item = items.get(slot);
		if (item == null) return;
		// enlève les stats existantes
		if (item.statistics) {
			item.statistics.forEach(stat => {
				if (stat.max) {
					build.addTotalStat(stat.name, -stat.max);
				} else {
					build.addTotalStat(stat.name, -stat.min);
				}
			});
		}
		// enlève l'item de la map
		items.delete(slot);
		// save items in local storage
		build.setItems(items);
	}

	public static setBaseStat(name: string, value: number) {
		var bases: Map<string, number> = build.getBases() as Map<string, number>;
		// console.log("bases " + JSON.stringify(bases));
		build.addTotalStat(name, value - (bases.get(name) || 0));
		bases.set(name, value);
		build.setBases(bases);
	}

	public static setExo(name: string, value: number) {
		var exos: Map<string, number> = build.getExos();
		build.addTotalStat(name, value - (exos.get(name) || 0));
		if (value == 0) exos.delete(name);
		else exos.set(name, value);
		build.setExos(exos);
	}

	public static addTotalStat(name: string, value: number) {
		var stats: Map<string, number> = build.getStats();
		var existing = 0;
		if (stats.has(name)) {
			existing = stats.get(name);
		}
		stats.set(name, existing + value);
		build.setStats(stats);
	}


	// ----------------------------------------------  Storage methods ----------------------------------------------

	private static getItems() {
		return new Map<string, any>(JSON.parse(localStorage.getItem("build.items")));
	}
	private static setItems(items) {
		// if (!build.inst) build.inst = new build();
		// update view and localStorage
		if (build.inst) build.inst.items = items;
		localStorage.setItem("build.items", JSON.stringify(Array.from(items.entries())));
	}

	private static getStats() {
		return new Map<string, number>(JSON.parse(localStorage.getItem("build.stats")));
	}
	private static setStats(stats) {
		// if (!build.inst) build.inst = new build();
		// update view and localStorage
		if (build.inst) build.inst.stats = stats;
		localStorage.setItem("build.stats", JSON.stringify(Array.from(stats.entries())));
	}

	private static getBases() {
		return new Map<string, number>(JSON.parse(localStorage.getItem("build.bases")));
	}
	private static setBases(bases) {
		// if (!build.inst) build.inst = new build();
		// update view and localStorage
		if (build.inst) build.inst.bases = bases;
		localStorage.setItem("build.bases", JSON.stringify(Array.from(bases.entries())));
	}

	private static getExos() {
		return new Map<string, number>(JSON.parse(localStorage.getItem("build.exos")));
	}
	private static setExos(exos) {
		// if (!build.inst) build.inst = new build();
		// update view and localStorage
		if (build.inst) build.inst.exos = exos;
		localStorage.setItem("build.exos", JSON.stringify(Array.from(exos.entries())));
	}

	private static getName() {
		return localStorage.getItem("build.name");
	}
	private static setName(name: string) {
		// if (!build.inst) build.inst = new build();
		if (build.inst) build.inst.name = name;
		localStorage.setItem("build.name", name);
	}

	private static getSets() {
		let sets = localStorage.getItem("build.sets");
		if (sets == "null" || sets == "undefined") return [];
		return JSON.parse(sets);
	}
	private static setSets(sets) {
		// update view and localStorage
		if (build.inst) build.inst.sets = sets;
		localStorage.setItem("build.sets", JSON.stringify(sets));
	}


}
