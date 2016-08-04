define(['dojo/_base/declare'],
	function (declare) {
		var id = 1;

		var Channel = declare([], {
			id: 0,
			_messages: null,
			_pendingRequestors: null,
			_pendingSenders: null,
			maxQueueLength: 1,

			constructor: function (args) {
				if (args && args.id) {
					this.id = args.id;
				} else {
					this.id -= '_channel_' + id++;
				}

				this._messages = [];
				this._pendingRequestors = [];
				this._pendingSenders = [];

				registry.registerChannel(this);
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
			}
		});

		var Registry = declare([], {
			_channels: null,

			constructor: function () {
				this._channels = {};
			},
			registerChannel: function (channel) {
				this._channels[channel.id] = channel;
			},
			findById: function (id) {
				return this._channels[channel.id]
			},

			_inMainThread: function () {
				return self instanceof Window 
			}
		});

		return new Registry();
	}
);