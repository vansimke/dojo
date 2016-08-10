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
		case 'startProcess':
			startProcess(e.data.body);
	} 
});

function configDojo(config) {
	self.dojoConfig = config;
}

function loadDojo() {
	importScripts([dojoConfig.baseUrl + '/dojo.js']);
}

function startProcess(functionBody) {
	var f = new Function(functionBody);
	f();
}
