define(['dojo/_base/declare'],
	function (declare) {
		var SyncWorker = declare([], {
			id: 0,

			initializeDojo: function () {
				//no op since Dojo is already initialized in host environment
			}
		});

		return SyncWorker;
	}
);