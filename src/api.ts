import { HttpClient, HttpRequestMessage, HttpResponseMessage, RequestTransformer } from 'aurelia-http-client';
import { HttpClient as FetchClient } from 'aurelia-fetch-client';
import { App } from 'app';
import { MongoClient } from 'mongodb';

export class WebAPI {

	private static local = false;
	public client: HttpClient = new HttpClient();

	public getUrl() {
		// console.log("url : " + location.hostname);
		return "https://data.mongodb-api.com/app/data-ewvjc/endpoint/data/v1/"; // return "http://" + location.hostname + ":9696";
	}

  public findOne(collection: string, id: string): Promise<HttpResponseMessage> {
		var url = this.getUrl() + "/findOne";
		var body: string = JSON.stringify({
      "dataSource": "SouchyAtlasCluster0",
      "database": "quickfus",
      "collection": collection,
      "filter": { "_id": id }
    });
		var req = new HttpRequestMessage("POST", url, body);
    req.headers.add("api-key", "k8JFpRr9LxAWCSsekfSR2j9aLlbj5kaK3oz3vB33tyx1BgxAG7LtRxx9nw4mdJWI")
		return this.client.send(req, []);
  }

  public aggregate(collection: string, pipeline: any[]): Promise<HttpResponseMessage> {
		var url = this.getUrl() + "/aggregate";
		var body: string = JSON.stringify({
      "dataSource": "SouchyAtlasCluster0",
      "database": "quickfus",
      "collection": collection,
      "pipeline": pipeline
    });
		var req = new HttpRequestMessage("POST", url, body);
    req.headers.add("api-key", "k8JFpRr9LxAWCSsekfSR2j9aLlbj5kaK3oz3vB33tyx1BgxAG7LtRxx9nw4mdJWI")
		return this.client.send(req, []);
  }

	public getSet(id): Promise<HttpResponseMessage> {
		return this.findOne("sets", id);
	}

	public getItem(id): Promise<HttpResponseMessage> {
		return this.findOne("items", id);
	}

	public findItems(itemfilters): Promise<HttpResponseMessage> {
		return null;
	}

	public getItems(pipeline: any[]): Promise<HttpResponseMessage> {
    return this.aggregate("items", pipeline);
	}

	public getSets(pipeline: any[]): Promise<HttpResponseMessage> {
    return this.aggregate("sets", pipeline);
	}

	public hash(password: string, salt: any) {
		return password;
	}


}
