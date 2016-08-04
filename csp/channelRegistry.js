define(['dojo/_base/declare',
	'./channel/MainThreadChannel',
	'./channel/WorkerChannel',
	'./Dispatcher',
	'dojo/_base/lang'],
	function (declare, MainThreadChannel, WorkerChannel,
		Dispatcher, lang) {
		var inMainThread = self instanceof Window;
		
		var Registry = declare([], {
			_channels: null,

			constructor: function () {
				this._channels = {};
				this.addEventListener('message', lang.hitch(this, 'messageListener'));
			},
			findById: function (id) {
				var channel = this._channels[id];
				if (!channel) {
					if (inMainThread) {
						this._channels[id] = new MainThreadChannel({id:id});
					} else {
						this._channels[id] = new WorkerChannel({id:id});
					}
				}

				return this._channels[id];
			},
			messageListener: function (e) {
				if (e && e.data) {
					if (inMainThread) {
						switch (e.data.type) {
							case 'putMessage': 
								this.findById(e.data.channelId).putMessage(e.data.message)
									.then(function () {
										var worker = Dispatcher.getWorkerById(e.data.workerId);
										worker.postMessage({
											type: 'putMessageResponse',
											workerId: worker.id,
											channelId: e.data.channelId,
											messageId: e.data.messageId
										});
									});
								break;
						}
					}
				}
			}

		});

		return new Registry();
	}
);