define(['dojo/_base/declare',
	'./channel/MainThreadChannel',
	'./channel/WorkerChannel',
	'./Dispatcher',
	'dojo/_base/lang'],
	function (declare, MainThreadChannel, WorkerChannel,
		Dispatcher, lang) {
		
		
		var inMainThread = !!global.Window;
		
		var Registry = declare([], {
			_channels: null,

			constructor: function () {
				this._channels = {};
				if (inMainThread){
					for (var i in Dispatcher._workers) {
						Dispatcher._workers[i]._worker.addEventListener('message', 
							lang.hitch(this, 'messageListener'));
					}
				} else {
					global.addEventListener('message', 
						lang.hitch(this, 'messageListener'));
				}
				
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
					switch (e.data.type) {
						case 'putMessage': 
							this.findById(e.data.channelId).put(e.data.message)
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
						case 'getMessage':
							this.findById(e.data.channelId).get()
								.then(function (message) {
									var worker = Dispatcher.getWorkerById(e.data.workerId);
									worker.postMessage({
										type: 'getMessageResponse',
										workerId: worker.id,
										channelId: e.data.channelId,
										messageId: e.data.messageId,
										message: message
									});
								});
							break;
						case 'putMessageResponse':
						case 'getMessageResponse':
							this.findById(e.data.channelId).processMessage(e.data);
							break;
					}
				}
			}
		});

		return new Registry();
	}
);