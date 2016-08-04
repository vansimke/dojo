define(['dojo/_base/declare',
	'dojo/Deferred'],
	function (declare, Deferred) {

		var nextMessageId = 1;
			global = self;

		var WorkerChannel = declare([], {
			channelId: null,
			_pendingRequestors: null,
			_pendingSenders: null,

			constructor: function () {
				this._pendingRequestors = {};
				this._pendingSenders = {};

			},

			put: function (msg) {
				var d = new Deferred();

				var messageId = nextMessageId++;

				global.postMessage({
					type: 'putMessage',
					workerId: global.workerId,
					channelId: this.channelId,
					messageId: messageId,
					message: msg
				});

				this._pendingSenders[messageId] =  d;

				return d.promise;
			},

			get: function () {
				var d = new Deferred();

				//TODO: this...

				return d.promise;
			},
			close: function () {
				throw "not implemented";
			},

			processMessage: function (message) {
				switch (message.type) {
					case 'putMessageResponse':
						if (this._pendingSenders[message.messageId]) {
							this._pendingRequestors[message.messageId].resolve();
							delete this._pendingRequestors[message.messageId];
						}
						break;
				}
			}
		});

		return WorkerChannel;
	}
);