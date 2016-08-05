define(['dojo/_base/declare',
    'dojo/has',
    './AsyncWorker',
    './SyncWorker',
    'dojo/_base/array'], 
    function (declare, has, AsyncWorker, SyncWorker,
        array) {
        has.add('web-workers', function (global) {
            return !!global.Worker
        });

        var workerId = 1;

        var Dispatcher = declare([], {
            numWorkers: 1,
            _workers: null,
            dojoConfig: null,
        
            constructor: function () {
                this._workers = {};

                var WorkerType = has('web-workers') ? AsyncWorker : SyncWorker;

                for (var i = 0; i < this.numWorkers; i++) {
                    var worker = new WorkerType({id: workerId++});
                    this._workers[worker.id] = worker;
                    
                }

                this._initializeDojoInWorkers(this.dojoConfig);
            },

            _initializeDojoInWorkers: function (config) {
                config = config || {};
                config.async = config.async || true;
                config.baseUrl = require.toUrl('dojo');
                for (var i in this._workers) {
                    this._workers[i].initializeDojo(config);
                }
            },

            getWorkerById: function (id) {
                return this._workers[id];
            }

        });

        return new Dispatcher();
    }
);