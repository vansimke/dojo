define(['dojo/_base/declare', 
	'dojo/Deferred'], 
	function (declare, Deferred) {
		var nextChannelId = 1,
			nextMessageId = 1;

		var MainThreadChannel = declare([], {
			channelId: 0,
			_messages: null,
			_pendingRequestors: null,
			_pendingSenders: null,
			maxQueueLength: 1,

			constructor: function (args) {
				if (args && args.id) {
					this.id = args.id;
				} else {
					this.id -= '_channel_' + nextChannelId++;
				}

				this._messages = [];
				this._pendingRequestors = [];
				this._pendingSenders = [];
			},
			put: function (msg) {
				var d = new Deferred();
				if (this._messages < this.maxQueueLength) {
					this._messages.push(msg);
					d.resolve();
				} else {
					this._pendingSenders.push({
						msg: msg,
						deferred: d
					});
				}

				if (this._pendingRequestors.length > 0) {
					var deferredRequest = this._pendingRequestors.shift();
					deferredRequest.resolve(this._messages.unshift());
				}

				return d.promise;

			},
			get: function () {
				var d = new Deferred();

				if (this._messages.length > 0) {
					d.resolve(this._messages.shift());
				} else {
					this._pendingRequestors.push(d);
				}

				if (this._pendingSenders.length > 0) {
					var deferredSender = this._pendingSenders.shift();
					this.put(deferredSender.msg);
					deferredSender.deferred.resolve();
				}

				return d.promise;
			},
			close: function () {
				throw "not implemented";
			}

		});

		return MainThreadChannel;
	}
);