self.addEventListener('message', function (e) {
	if (!e || !e.data || !e.data.type) {
		return;
	}

	switch (e.data.type) {
		case 'loadDojo': 
			configDojo(e.data.config);
			loadDojo();
			break;
		case 'setWorkerId':
			self.workerId = e.data.id;
			break;
	} 
});

function configDojo(config) {
	self.dojoConfig = config;
}

function loadDojo() {
	importScripts([dojoConfig.baseUrl + '/dojo.js']);
	require(['dojo/csp/channelRegistry'], function (channelRegistry) {
		channelRegistry.findById('test1').put(42).then(function () {
			channelRegistry.findById('test1').get().then(function (message) {
				console.log(message);
			});
		});
	});
}
