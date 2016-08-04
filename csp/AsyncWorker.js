define(['dojo/_base/declare', 'require'],
	function (declare, require) {
		var AsyncWorker = declare([], {
			id: 0,
			_worker: null,

			constructor: function () {
				this._worker = new Worker(require.toUrl('./worker-script.js'));
			},

			initializeDojo: function (config) {
				this._worker.postMessage({
					type: 'loadDojo',
					config: config
				});
			}
		});

		return AsyncWorker;
	}
);