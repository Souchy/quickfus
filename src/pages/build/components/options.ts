import { EnumStat } from './../../../i18n';
import { bindable, computedFrom } from 'aurelia-framework';
import { build } from '../build';
import { db } from '../../../db';
import { PastebinAPI } from 'pastebin-ts/dist/api';
import { Hashkit } from 'hashkit';

export class options {

	@bindable
	public build: build;
	public exportlink;

	public pb: PastebinAPI;

	public constructor() {
	}

	public bind() {

	}

	public reset() {
		build.inst.clear(true);
	}
	public save() {
		build.inst.save();
	}

  // this tag makes the binding update every time those properties are updated
	@computedFrom('build.name', 'build.items', 'build.scrolls', 'build.bases', 'build.exos')
	public get copyUrl(): string {
		let data = { name: this.build.name, items: [], scrolls: [], bases: [], exos: [] };

		this.build.items.forEach((item, slot) => {
      // let id = item.ankamaID;
      // let has = build.hash.encode(id);
      // let dec = +build.hash.decode(has);
      // console.log("encode url item id="+id+", hash="+has+", dec="+dec);
			// data.items.push(has);
      data.items.push(item.ankamaID);
		});
		db.getBaseStatNames().forEach(e => {
			data.bases.push(build.hash.encode(this.build.bases.get(e) || 0));
		});
		db.getBaseStatNames().forEach(e => {
			data.scrolls.push(build.hash.encode(this.build.scrolls.get(e) || 0));
		});
    this.build.exos.forEach((val, key, map) => {
      let id = EnumStat.getKeyIdFrench(key);
      // console.log("key=" + key + ", id=" + id)
      data.exos.push(build.hash.encode(id)); 
      data.exos.push(build.hash.encode(val)); 
    });

		let output: string = data.name + "-";
		output += data.scrolls.join("-") + "-";
		output += data.bases.join("-") + "-";
		output += data.exos.length + "-" + data.exos.join("-") + "-";
		output += data.items.join("-");
		output = "http://" + location.host + "/build?data=" + output;
		return output;
	}

	// create a url @ http://url/build/datastring and push it to clipboard
	public export() {
		// create pastebin
		// copy link to clipboard
		// tooltip says "Lien copié!"

		// let b = build.inst.export();


		// on a pas le droit de copier :(  (faut https)
		// navigator.clipboard.writeText(output);
		this.exportlink.value = this.copyUrl;
		// console.log("exportlink : " + this.exportlink + " = " + this.exportlink.value);
	}

	// import from url @ http://url/build/datastring
	// this should be in build.ts
	public import() {
		let input = "decrypt(string)"; // input = json string = {name, [itemIds][basestats]}

		// affiche un input text dans lequel mettre le lien pastebin,
		// puis click sur import
		// le build est chargé (pas savé)
		navigator.clipboard.readText()
			.then(text => {
				console.log('Pasted content: ', text);
				this.build.importsmol(text);
			})
			.catch(err => {
				console.error('Failed to read clipboard contents: ', err);
			});
	}

}
