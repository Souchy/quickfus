import { numeral } from 'numeral';
import { inject, bindable, View, observable } from 'aurelia-framework';
import * as Masonry from 'masonry-layout'
import { WebAPI } from '../../api';
import { filter, ModFilter } from './filter';

@inject(WebAPI)
export class itemsearch {

	public static inst: itemsearch;

	// @bindable public data: object[] = [];

	@bindable public loadedCount: number = 0;
	// event handler function
	public onLoadedSheet = null;

	// full data
	public fulldata: any[] = [];
	public index: number = 0;

	// chosen data
	public data: any[] = [];
	public grid: HTMLDivElement;
	public msnry: Masonry;

	public attachedb: boolean = false;
	public queriedb: boolean = false;

	// total filter?
	public filter: string;

	// string search bar value
	public searchbar: string;

	// Ctor
	constructor(private api: WebAPI) {
		itemsearch.inst = this;

		this.onLoadedSheet = this.debounce(() => {
			this.reloadMsnry();
		}, 100, false);
		// window.addEventListener('resize', this.debounce(this.smartresize, 500, false), true);
		// this.onLoadedSheet = this.reloadMsnry;

		// this.data = App.data;
		// console.log("itemsearch ctor : " + this.grid);

		// this.query();

		// this.search(new filter());
	}

	// search button on the filter component
	// creates a mongo query then sends a request to the api and reload msnry
	public search(filter: filter) {
		var mongofilter = { "$and": [] };
		var types = { "$or": [] };
		// Level
		if (filter.filterLevel) {
			mongofilter.$and.push({ "level": { "$gte": parseInt(filter.levelMin + "") } });
			mongofilter.$and.push({ "level": { "$lte": parseInt(filter.levelMax + "") } });
		}
		// Types
		if (filter.filterType) {
			filter.types.forEach((v, k) => {
				if (v)
					types.$or.push({ "type": k });
			})
		}
		// Types
		if (filter.filterWeapon) {
			filter.armes.forEach((v, k) => {
				if (v)
					types.$or.push({ "type": k });
			})
		}
		if (filter.filterText && filter.filterText != "") {
			mongofilter.$and.push(
				{
					"$or": [
						{ "name": { "$regex": this.caseAndAccentInsensitive(filter.filterText), "$options": "i" } },
						// { "type": { "$regex": filter.filterText, "$options": "i" } }
					]
				}
				// { "name": new RegExp(filter.filterText, "i") }
				// { "name": filter.filterText } // would be actual text search rather than name and it would search for halfwords and stuff
				// { "$text": { "$search": filter.filterText } } // would be actual text search rather than name and it would search for halfwords and stuff
			);
			// console.log("itemsearch filter text : " + new RegExp(filter.filterText, "i"));
		}
		if (filter.filterType || filter.filterWeapon) {
			mongofilter.$and.push(types);
		}
		// console.log("filter blocks : " + JSON.stringify(filter.blocks));
		// console.log("filter blocks[0] : " + JSON.stringify(filter.blocks[0]));
		filter.blocks.forEach(block => {
			if (block.activate) {
				// let func = block.type.toLowerCase();

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
		});
		// console.log("filter : " + JSON.stringify(mongofilter));

		this.query(mongofilter);
		// this.reloadMsnry();
	}
	private filterStatPseudo(m: ModFilter) {
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
	private filterStat(m: ModFilter) {
		let min: number = parseInt(m.min + "");
		let max: number = parseInt(m.max + "");
		// console.log("filter mod (" + min + "," + max + ") : " + JSON.stringify(m));
		if (!m.min) min = -100000;
		let minfilter = {
			"name": m.name,
			"min": { "$gte": min }
		};
		let maxfilter = {
			"name": m.name
		};
		if (m.max) {
			minfilter["max"] = { "$lte": max };
			maxfilter["max"] = { "$lte": max, "$gte": min };
		} else {
			maxfilter["max"] = { "$gte": min };
		}
		let mm = {
			"statistics": {
				"$elemMatch": {
					"$or": [minfilter, maxfilter]
				}
			}
		};
		return mm;
	}

	public query(filter?: any, msn?: boolean) {
		this.loadedCount = 0;
		// default filter
		// if (!filter) filter = { "$or": [{ "level": { "$gte": 190 } }, { "type": "Dofus" }] };
		// call
		this.api.getItems(100, 0, filter).then(response => {
			this.index = 0; // reset index
			this.data = [] //.splice(0, this.data.length); // reset select data
			this.fulldata = response.content; // store full data
			this.showMore(100); // select data

			// console.log("itemsearch query : " + response.content.length);
			// console.log("itemsearch query : " + response.content);

			// this.data = response.content;
			this.queriedb = true;
			if (msn != false) this.initMasonry();
		});
	}

	public smartresize() {
		// console.log("smartresize");
		// this.msnry.data()

		if (!this.grid) return;

		//console.log("smartresize");

		var containerWidth = this.grid.clientWidth;
		// get number of columns that would be at least 200px
		// extra 20 is for 10px margin on each side
		var colCount: number = Math.floor(containerWidth / 220);
		// get width of columns that would fit in current container
		// given number of columns. -20 is to account for 10px margin on each side
		var colWidth: number = (containerWidth / colCount) - (20 * colCount);
		// only animate after first time
		// var applyStyleFnName: string = firstTime ? 'css' : 'animate';

		// apply width

		this.grid.children["css"](
			{ width: colWidth },
			{ queue: false }
		);
		// var $boxes = $container.find('.box'),
		// 	$boxes[applyStyleFnName](
		// 		{ width: colWidth },
		// 		{ queue: false }
		// 	);

		/*
		$container.masonry({
		// add 20 for margin
		columnWidth : colWidth + 20,
		singleMode: true,
		itemSelector: '.box',
		resizeable: false,
		animate: true
	});
	*/
		// firstTime = true;
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
		this.initMasonry();
	}
	public detached() {
		// console.log("itemsearch detached");
	}
	public unbind() {
		// console.log("itemsearch unbind");
	}


	public showMore(count?) {
		var numPerPage = 50;
		if (count) numPerPage = count;
		// this.data.concat(response.content); //JSON.stringify(response.content);
		// console.log("itemsearch fulldata : " + this.fulldata);
		for (var j = 0; j < numPerPage; j++) {
			if (this.index >= this.fulldata.length) return;
			// console.log("itemsearch fulldata[" + this.index + "] : " + this.fulldata[this.index]);
			this.data.push(this.fulldata[this.index]);
			this.index++;
		}
		// this.initMasonry();
		// this.msnry.reloadItems();
		// this.reloadMsnry();  // cant reload here because it takes time before the item sheets are actually added to the HTML
		// this.layout();
	}

	// event
	public loadedCountChanged() {
		this.reloadMsnry();
	}

	public reloadMsnry() {
		// console.log("itemsearch reloadItems()");
		if (this.msnry) {
			this.msnry.reloadItems();
			this.msnry.layout();
		}
	}
	public layout() {
		// console.log("itemsearch layout()");
		if (this.msnry) {
			this.msnry.layout();
		}
	}

	public initMasonry() {
		if (!this.grid) return;
		if (this.msnry) this.msnry.destroy();
		if (!this.attachedb || !this.queriedb) return;
		// if (this.msnry != null) {
		// 	if (this.msnry.getItemElements().length != 0) return;
		// }

		var ref = this;
		// if (this.grid) console.log("itemsearch mason : " + this.grid.children.length);
		// else console.log("itemsearch mason : " + this.grid);
		this.msnry = new Masonry(this.grid, {
			itemSelector: '.grid-item',
			// horizontalOrder: true,
			columnWidth: '.grid-item', // 270, // 250 + 5*2 + 5*2
			gutter: 10,
			// transitionDuration: 0,
			fitWidth: true,
			// initLayout: true,
		});
		function onLayout(items) {
			var gridlength = ref.grid ? ref.grid.children.length : 0;
			var datalength = ref.data ? ref.data.length : 0;
			// console.log("itemsearch mason layout : " + items.length + " / " + gridlength + " / " + datalength);
			// console.log("itemsearch mason element : " + items.keys());
			// console.log("itemsearch mason element : " + JSON.stringify(items[0]));
			// for (var i = 0; i < this.msnry.getItemElements().length; i++) {
			// 	console.log("itemsearch mason element : " + this.msnry.getItemElements()[i]);
			// }
		}
		function onLayoutOnce(items) {
			// console.log("itemsearch mason layout once : " + items.length);
		}
		// bind event listener
		this.msnry.on('layoutComplete', onLayout);
		this.msnry.once('onLayoutOnce', onLayout);
		this.msnry.layout();
		// if (this.grid) console.log("itemsearch mason 2 : " + this.grid.children.length);
		// else console.log("itemsearch mason 2 : " + this.grid);
	}


	// public onchange() {
	// 	console.log("on change");
	// }

	// activate(model) {
	// 	this.data = model;
	// 	console.log(this.data);
	// }


	public caseAndAccentInsensitive(text) {
		const accentMap = (function(letters) {
			let map = {};
			while (letters.length > 0) {
				let letter = "[" + letters.shift() + "]",
					chars = letter.split('');
				while (chars.length > 0) {
					map[chars.shift()] = letter;
				}
			}
			return map;
		})([
			'aàáâãäå', // a
			'cç',      // c
			'eèéêë',   // e
			'iìíîï',   // i
			'nñ',      // n
			'oòóôõöø', // o
			'sß',      // s
			'uùúûü',   // u
			'yÿ'       // y
		]);
		let f = function(text) {
			var textFold = '';
			if (!text)
				return textFold;
			text = text.toLowerCase();
			for (var idx = 0; idx < text.length; idx++) {
				let charAt = text.charAt(idx);
				textFold += accentMap[charAt] || charAt;
			}
			return "(?i)" + textFold;
		}
		return f(text);
	}

	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds.
	public debounce(func, wait, immediate) {
		// 'private' variable for instance
		// The returned function will be able to reference this due to closure.
		// Each call to the returned function will share this common timer.
		var timeout;

		// Calling debounce returns a new anonymous function
		return function() {
			// reference the context and args for the setTimeout function
			var context = this,
				args = arguments;

			// Should the function be called now? If immediate is true
			//   and not already in a timeout then the answer is: Yes
			var callNow = immediate && !timeout;

			// This is the basic debounce behaviour where you can call this
			//   function several times, but it will only execute once
			//   [before or after imposing a delay].
			//   Each time the returned function is called, the timer starts over.
			clearTimeout(timeout);

			// Set the new timeout
			timeout = setTimeout(function() {

				// Inside the timeout function, clear the timeout variable
				// which will let the next execution run when in 'immediate' mode
				timeout = null;

				// Check if the function already ran with the immediate flag
				if (!immediate) {
					// Call the original function with apply
					// apply lets you define the 'this' object as well as the arguments
					//    (both captured before setTimeout)
					func.apply(context, args);
				}
			}, wait);

			// Immediate mode and no wait timer? Execute the function..
			if (callNow) func.apply(context, args);
		}
	}



}
