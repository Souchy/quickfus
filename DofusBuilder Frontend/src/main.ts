import { Aurelia } from 'aurelia-framework';
import environment from './environment';

export function configure(aurelia: Aurelia) {
	console.log("configure main1");

	aurelia.use
		.standardConfiguration()
		.feature('resources');

	aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

	if (environment.testing) {
		aurelia.use.plugin('aurelia-testing');
	}

	aurelia.start().then(() => aurelia.setRoot());
}
