import { HttpClient, HttpRequestMessage, HttpResponseMessage, RequestTransformer } from 'aurelia-http-client';
import { HttpClient as FetchClient } from 'aurelia-fetch-client';
import { App } from 'app';
import { MongoClient } from 'mongodb';

export class WebAPI {

	private static local = false;
	// public static baseurl: string = WebAPI.local ? "http://localhost:9696" : "http://hiddenpiranha.ddns.net:9696"; // "http://192.168.2.15:9696"; // // "http://localhost:9696";
	public client: HttpClient = new HttpClient();

	public getUrl() {
		// console.log("url : " + location.hostname);
		return "http://" + location.hostname + ":9696";
	}

	public getSet(id) {
		var url = this.getUrl() + "/sets/" + id;
		return this.client.get(url);
	}
	public getItem(id) {
		var url = this.getUrl() + "/item/" + id; //"https://fr.dofus.dofapi.fr/equipments/" + id;
		// var promise = this.client.get(url).then(callback);
		return this.client.get(url);
	}
	public findItems(itemfilters) {
		return null;
	}
	public getItems(limit: number, skip: number, filter) {
		var url = this.getUrl() + "/items";
		var filt: string = JSON.stringify(filter);
		if (limit == null) limit = 50;
		if (skip == null) skip = 0;
		// if (filt == "null") filt = "";
		// else filt = "/" + filt;
		// console.log("filt : [" + filt + "]");
		var query: string = "?limit=" + limit + "&skip=" + skip;
		// url += filt;
		url += query;

		var req = new HttpRequestMessage("POST", url, filt);
		var tr = (thing) => {
			// console.log("transform " + JSON.stringify(thing));
			return thing;
		};
		// console.log("req : " + JSON.stringify(req));
		return this.client.send(req, [tr]);
	}

	public hash(password: string, salt: any) {
		return password;
	}


}
