import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { build } from '../build/build';

@inject(Router)
export class builds {

	public static inst;
	public names: string[] = [];

	public router: Router;

	constructor(router: Router) {
		this.router = router;
		builds.inst = this;
		// init localStorage
		if (!localStorage.getItem("builds")) {
			localStorage.setItem("builds", JSON.stringify(this.names));
		}
		// load build names
		this.names = JSON.parse(localStorage.getItem("builds"));
	}

	public newbuild() {
		// build.inst.clear(true);
		if (!build.inst) {
			window.setTimeout(() => build.import(null), 300);
		} else {
			build.import(null);
		}
		this.router.navigate("/build");
	}

	public delete(name: string) {
		var names = this.names; //JSON.parse(localStorage.getItem("builds"));
		var index: number = this.names.indexOf(name);
		if (index != -1) {
			names.splice(index, 1);
			localStorage.setItem("builds", JSON.stringify(names));
			localStorage.removeItem(name);
			// console.log("deleted build : " + name);
		}
	}

	public load(name: string) {
		// console.log("load build : {" + name + "} from [" + this.names + "]");
		if (this.names.indexOf(name) != -1) {

			let json = localStorage.getItem(name);
			build.import(json);
			// console.log("load build : " + JSON.stringify(obj));
			// build.load(obj);
			this.router.navigate("/build");
		}
	}

	public static save(build: build) {
		var names = [];
		if (builds.inst == null) names = JSON.parse(localStorage.getItem("builds"));
		names = JSON.parse(localStorage.getItem("builds"));
		if (names.indexOf(build.name) == -1) {
			names.push(build.name);
		}
		localStorage.setItem("builds", JSON.stringify(names));
		localStorage.setItem(build.name, build.export());
	}



}
