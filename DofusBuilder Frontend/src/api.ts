import { Headers, HttpClient, HttpRequestMessage, HttpResponseMessage, RequestTransformer } from 'aurelia-http-client';
import { HttpClient as FetchClient } from 'aurelia-fetch-client';
import { App } from 'app';
import { MongoClient } from 'mongodb';

export class WebAPI {

	private static local = false;
	public client: HttpClient = new HttpClient();

	public getUrl() {
		// console.log("url : " + location.hostname);
    // return "http://" + location.hostname + ":9696";
    return "https://quickfus-backend.herokuapp.com";
	}
  
  public findOne(collection: string, id: string): Promise<HttpResponseMessage> {
		var url = this.getUrl() + "/" + collection + "/" + id;
		return this.client.get(url);
  }

  public aggregate(collection: string, pipeline: any[]): Promise<HttpResponseMessage> {
		var url = this.getUrl() + "/" + collection;
		var req = new HttpRequestMessage("POST", url, pipeline); 
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
