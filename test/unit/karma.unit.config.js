'use strict';
const path = require('path');
const fs = require('fs-extra');

// This is required if playservices-ads-lite is bundled
function projectManagerHook(projectManager) {
	projectManager.once('prepared', function () {
		const tiapp = path.join(this.karmaRunnerProjectPath, 'tiapp.xml');
		const contents = fs.readFileSync(tiapp, 'utf8');

		fs.writeFileSync(tiapp, contents.replace('</manifest>', `<application>
		<meta-data
            android:name="com.google.android.gms.ads.AD_MANAGER_APP"
            android:value="true"/>
	</application>
</manifest>`), 'utf8');
	});
}
projectManagerHook.$inject = [ 'projectManager' ];

module.exports = config => {
	config.set({
		basePath: '../..',
		frameworks: [ 'jasmine', 'projectManagerHook' ],
		files: [
			'test/unit/specs/**/*spec.js'
		],
		reporters: [ 'mocha', 'junit' ],
		plugins: [
			'karma-*',
			{
				'framework:projectManagerHook': [ 'factory', projectManagerHook ]
			}
		],
		titanium: {
			sdkVersion: config.sdkVersion || '12.0.0.GA'
		},
		customLaunchers: {
			android: {
				base: 'Titanium',
				browserName: 'Android AVD',
				displayName: 'android',
				platform: 'android'
			}
		},
		browsers: [ 'android' ],
		client: {
			jasmine: {
				random: false,
				timeoutInterval: 1200000
			}
		},
		singleRun: true,
		retryLimit: 0,
		concurrency: 1,
		captureTimeout: 1200000,
		browserDisconnectTolerance: 3,
		browserDisconnectTimeout: 1200000,
		browserNoActivityTimeout: 1200000,
		logLevel: config.LOG_DEBUG
	});
};
