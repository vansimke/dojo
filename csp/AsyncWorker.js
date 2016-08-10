define(['dojo/_base/declare', 'require'],
	function (declare, require) {
		var AsyncWorker = declare([], {
			id: 0,
			_worker: null,

			constructor: function (args) {
				this.id = args.id;
				this._worker = new Worker(require.toUrl('./worker-script.js'));
				this._worker.postMessage({
					type: 'setWorkerId',
					id: this.id
				});
			},

			initializeDojo: function (config) {
				this._worker.postMessage({
					type: 'loadDojo',
					config: config
				});
			},
			postMessage: function (message) {
				this._worker.postMessage(message);
			},

			startProcess: function (process) {
				var functionBody = /\{([\s\S]*)\}/m.exec(process.toString())[1];
				this._worker.postMessage({
					type: 'startProcess',
					body: functionBody
				});
			}
		});

		return AsyncWorker;
	}
);