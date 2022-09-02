import { numeral } from 'numeral';
import { inject, bindable, View, observable } from 'aurelia-framework';
import * as Masonry from 'masonry-layout'
import { WebAPI } from '../../api';

import { setfilter, ModFilter, BlockFilter } from './setfilter';
import { util, Mason } from '../../util';

@inject(WebAPI)
export class setsearch {

	public static inst: setsearch;

	// @bindable public data: object[] = [];

	@bindable public loadedCount: number = 0;
	// event handler function
	public onLoadedSheet = null;

	public mason: Mason;
	public grid: HTMLDivElement;

	public attachedb: boolean = false;
	public queriedb: boolean = false;

	// total filter?
	public filter: string;

	// string search bar value
	public searchbar: string;

	// Ctor
	constructor(private api: WebAPI) {
		setsearch.inst = this;

		this.mason = new Mason();
		this.mason.obj = this;

		this.onLoadedSheet = util.debounce(() => {
			this.mason.reloadMsnry();
		}, 100, false);
	}


	// search button on the filter component
	// creates a mongo query then sends a request to the api and reload msnry
	public search(filter: setfilter) {
		var adds = { $addFields: {} };
		var mongofilter = { $and: [] };
		// Level
		if (filter.filterLevel) {
			// mongofilter.$and.push({ "level": { "$gte": parseInt(filter.levelMin + "") } });
			// mongofilter.$and.push({ "level": { "$lte": parseInt(filter.levelMax + "") } });
			mongofilter.$and.push({ "items.level": { "$gte": parseInt(filter.levelMin + "") } });
			mongofilter.$and.push({ "items.level": { "$lte": parseInt(filter.levelMax + "") } });
		}
		// set bonus
		if (filter.filterBonuses) {
			filter.bonuses.forEach((v, k) => {
				if (v)
					mongofilter.$and.push({ "bonuses.0.name": k });
			})
		}
		// Types in
		if (filter.filterTypeIn) {
			filter.typesIn.forEach((v, k) => {
				if (v)
					mongofilter.$and.push({ "items.type": k });
			})
		}
		// Types out
		if (filter.filterTypeOut) {
			filter.typesOut.forEach((v, k) => {
				if (v)
					mongofilter.$and.push({ "items.type": { "$ne": k } });
			})
		}
		// types in/out
		// if (filter.filterTypeIn || filter.filterTypeOut) {
		// 	mongofilter.$and.push(types);
		// }
		// name
		if (filter.filterText && filter.filterText != "") {
			mongofilter.$and.push(
				{
					"$or": [
						{ "name.fr": { "$regex": util.caseAndAccentInsensitive(filter.filterText), "$options": "i" } },
						// { "type": { "$regex": filter.filterText, "$options": "i" } }
					]
				}
				// { "name": new RegExp(filter.filterText, "i") }
				// { "name": filter.filterText } // would be actual text search rather than name and it would search for halfwords and stuff
				// { "$text": { "$search": filter.filterText } } // would be actual text search rather than name and it would search for halfwords and stuff
			);
			// console.log("itemsearch filter text : " + new RegExp(filter.filterText, "i"));
		}

		// console.log("filter blocks : " + JSON.stringify(filter.blocks));
		// console.log("filter blocks[0] : " + JSON.stringify(filter.blocks[0]));
		let bi = 0;
		filter.blocks.forEach(block => {
			if (block.activate) {
				if (block.type == "$sum") {
					this.filterSum(mongofilter, adds, bi, block);
				} else {
					let arr = block.mods.filter(m => m.activate && m.name != undefined).map((m: ModFilter) => {
						if (m.name.includes("Pseudo")) return this.filterStatPseudo(m);
						else return this.filterStat(m);
					});
					// console.log("filter block : " + func + " : " + JSON.stringify(arr));
					if (arr.length > 0) {
						mongofilter.$and.push({
							[block.type]: arr
						});
					}
				}
			}
			bi++;
		});


		// var pipeline = { "a": null, "m": { $match: mongofilter } };
		// if (Object.keys(adds.$addFields).length > 0) {
		// 	pipeline.a = adds;
		// }
    
    var pipeline = [];
    {
      // sort
      pipeline.push({ $sort: { "level": -1, "ankamaID": -1 } })
      // sums
      if(Object.keys(adds.$addFields).length > 0)
        pipeline.push(adds);
      // actual filter
      pipeline.push({ $match: mongofilter } );
      // limit
      pipeline.push({ $limit: 100 });
      // skip
      pipeline.push({ $skip: 0 });
    }
    
		// console.log("filter : " + JSON.stringify(pipeline));

		this.query(pipeline);
		// this.reloadMsnry();
	}

	public filterSum(mongofilter, adds, bi, block: BlockFilter) {
		let blockid = block.mods.map(m => m.name).reduce((acc, m) => acc + m) + bi;
		// filter what stats we need to sum
		let conds = [];
		block.mods.forEach(m => {
			conds.push({
				"$eq": [
					"$$stat.name",
					m.name
				]
			});
		});
		// create a field with the sum of stats
		adds.$addFields[blockid] = {
			"$sum": {
				"$map": {
					"input": {
						"$filter": {
							"input": "$statistics",
							"as": "stat",
							"cond": {
								"$or": conds
							}
						}
					},
					"as": "stat",
					"in": "$$stat.max"
				}
			}
		};
		// filter match on that sum
		mongofilter.$and.push({
			[blockid]: {
				$gte: parseInt((block.mods[0].min || -100000) + ""),
				$lte: parseInt((block.mods[0].max || 100000) + "")
			}
		});
	}


	public filterStatPseudo(m: ModFilter) {
		let min: number = parseInt(m.min + "");
		let max: number = parseInt(m.max + "");
		if (!m.min) min = -100000;
		let filter = {
			"$and": []
		};
		// if (m.min) {
		filter.$and.push(
			{
				["(Pseudo) statistics." + m.name]: {
					"$gte": min
				}
			}
		)
		// }
		if (m.max) {
			filter.$and.push(
				{
					["(Pseudo) statistics." + m.name]: {
						"$lte": max
					}
				}
			)
		}
		return filter;
	}

	public filterStat(m: ModFilter) {
		let min: number = parseInt(m.min + "");
		let max: number = parseInt(m.max + "");

		// console.log("filter mod (" + min + "," + max + ") : " + JSON.stringify(m));
		if (!m.min) min = -100000;
		if (!m.max) max = 100000;
		// let minfilter = {
		// "name": m.name,
		// "min": { "$gte": min }
		// };

		let maxfilter = {
			"name": m.name
		};
		if (m.max) {
			// minfilter["max"] = { "$lte": max };
			maxfilter["max"] = { "$lte": max, "$gte": min };
		} else {
			maxfilter["max"] = { "$gte": min };
		}

		// filtre total
		let mm = {
			"statistics": {
				"$elemMatch": maxfilter
			}
		};

		// filtre bonus
		// let mm = {
		// 	"bonuses": {
		// 		"$elemMatch": {
		// 			"$or": [minfilter, maxfilter]
		// 		}
		// 	}
		// }

		// filtre 1 item
		// let mm = {
		// 	"items.statistics": {
		// 		"$elemMatch": maxfilter
		// 	}
		// };

		return mm;
	}


	public query(filter?: any, msn?: boolean) {
		this.loadedCount = 0;
		// default filter
		// if (!filter) filter = { "$or": [{ "level": { "$gte": 190 } }, { "type": "Dofus" }] };
		// call
		this.api.getSets(filter).then(response => {
			this.mason.index = 0; // reset index
			this.mason.data = [] //.splice(0, this.data.length); // reset select data
			this.mason.fulldata = response.content; // store full data
			this.mason.showMore(50); // select data

			console.log("setsearch query : " + response.content.length);
			// console.log("itemsearch query : " + response.content);

			// this.data = response.content;
			this.queriedb = true;
			if (msn != false) this.mason.initMasonry();
		});
	}


	public created(owningView: View, myView: View) {
		// console.log("itemsearch created : " + this.grid);
	}
	public bind(bindingContext: Object, overrideContext: Object) {
		// if (this.grid)
		// 	console.log("itemsearch bind : " + this.grid.children.length);
		// else
		// 	console.log("itemsearch bind : null");
	}

	// When referencing is done (<div ref="grid"> injected into this.grid)
	public attached() {
		// console.log("itemsearch attached grid : " + this.grid.children.length);
		this.attachedb = true;
		// this.mason.initMasonry();
	}
	public detached() {
		// console.log("itemsearch detached");
	}
	public unbind() {
		// console.log("itemsearch unbind");
	}


}
