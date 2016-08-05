define(['dojo/_base/declare',
	'dojo/Deferred'],
	function (declare, Deferred) {

		var nextMessageId = 1;
			global = self;

		var WorkerChannel = declare([], {
			channelId: null,
			_pendingRequestors: null,
			_pendingSenders: null,

			constructor: function (args) {
				this.channelId = args.id;
				this._pendingRequestors = {};
				this._pendingSenders = {};

			},

			put: function (msg) {
				var d = new Deferred();

				var messageId = nextMessageId++;

				this._pendingSenders[messageId] =  d;

				global.postMessage({
					type: 'putMessage',
					workerId: global.workerId,
					channelId: this.channelId,
					messageId: messageId,
					message: msg
				});

				return d.promise;
			},

			get: function () {
				var d = new Deferred();

				var messageId = nextMessageId++;

				this._pendingRequestors[messageId] = d;

				global.postMessage({
					type: 'getMessage',
					workerId: global.workerId,
					channelId: this.channelId,
					messageId: messageId
				});

				
				return d.promise;
			},
			close: function () {
				throw "not implemented";
			},

			processMessage: function (message) {
				switch (message.type) {
					case 'putMessageResponse':
						if (this._pendingSenders[message.messageId]) {
							this._pendingSenders[message.messageId].resolve();
							delete this._pendingSenders[message.messageId];
						}
						break;
					case 'getMessageResponse':
						if (this._pendingRequestors[message.messageId]) {
							this._pendingRequestors[message.messageId].resolve(message.message);
							delete this._pendingRequestors[message.messageId];
						}
						break;
				}
			}
		});

		return WorkerChannel;
	}
);