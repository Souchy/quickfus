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

	@computedFrom('build')
	public get copyUrl(): string {
		let data = { name: this.build.name, items: [], bases: [] };

		this.build.items.forEach((item, slot) => {
			data.items.push(build.hash.encode(item.ankamaId));
		});
		db.getBaseStatNames().forEach(e => {
			data.bases.push(build.hash.encode(this.build.bases.get(e) || 0));
		});

		let output: string = data.name + "-";
		output += data.bases.join("-") + "-";
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
