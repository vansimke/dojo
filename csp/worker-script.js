self.addEventListener('message', function (e) {
	if (!e || !e.data || !e.data.type) {
		return;
	}

	switch (e.data.type) {
		case 'loadDojo': 
			configDojo(e.data.config);
			loadDojo();
			break;
	} 
});

function configDojo(config) {
	self.dojoConfig = config;
	console.log(self.dojoConfig);
}

function loadDojo() {
	importScripts([dojoConfig.baseUrl + '/dojo.js']);
}
