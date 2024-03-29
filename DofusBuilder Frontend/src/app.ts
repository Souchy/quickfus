
import { Router, RouterConfiguration, RouteConfig, NavigationInstruction, Next } from 'aurelia-router';
// import { PLATFORM } from 'aurelia-pal';
import { inject, PLATFORM } from 'aurelia-framework';
import { WebAPI } from './api';
import { db } from './db';


@inject(WebAPI)
export class App {
  public static root: string = ""; // quickfus
  public static root2: string = ""; // quickfus
	public router: Router;
	public body: string = "";

	public constructor(private api: WebAPI) {
		console.log("app ctor");
		db.init(true);
	}

	public configureRouter(config: RouterConfiguration, router: Router) {
		console.log("configure router");
		config.title = 'Quickfus';
    // config.options.root = '/';
		// config.options.pushState = true;
		// config.options.root = App.root;
		config.addPipelineStep('postcomplete', PostCompleteStep);

		config.map([
			// { route: '', moduleId: PLATFORM.moduleName('no-selection'), title: 'Select' },
			// { route: 'contacts/:id', moduleId: PLATFORM.moduleName('contact-detail'), name: 'contacts' },

			// { route: '', moduleId: PLATFORM.moduleName('auth'), name: 'auth' }
			// { route: 'unknownroute', moduleId: "", name: 'unknownroute' },
			// { route: 'auth', moduleId: "pages/auth/auth", name: 'auth' },

			{ route: '', moduleId: "pages/build/build", name: 'index' },
			{ route: 'build', moduleId: "pages/build/build", name: 'build' },
			// { route: 'build/:data', moduleId: "pages/build/build", name: 'buildimport' },
			{ route: 'builds', moduleId: "pages/builds/builds", name: 'builds' },
			{ route: 'items', moduleId: "pages/items/itemsearch", name: 'items' },
			{ route: 'sets', moduleId: "pages/sets/setsearch", name: 'sets' },
      
			// { route: 'quickfus/', moduleId: "pages/build/build", name: 'index' },
			// { route: 'quickfus/build', moduleId: "pages/build/build", name: 'build' },
			// // { route: 'build/:data', moduleId: "pages/build/build", name: 'buildimport' },
			// { route: 'quickfus/builds', moduleId: "pages/builds/builds", name: 'builds' },
			// { route: 'quickfus/items', moduleId: "pages/items/itemsearch", name: 'items' },
			// { route: 'quickfus/sets', moduleId: "pages/sets/setsearch", name: 'sets' }
		]);

		config.mapUnknownRoutes((instruction: NavigationInstruction): RouteConfig => {
			return { route: 'unknownroute', name: 'unknownroute' };
		}); //'not-found');

		this.router = router;
	}

}


class PostCompleteStep {
	run(instruction: NavigationInstruction, next: Next) {
		if (!instruction.config.settings.noScrollToTop) {
			window.scrollTo(0, 0);
		}
		return next();
	}
}
