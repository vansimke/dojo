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
            _workersList: null,
            dojoConfig: null,
            _nextWorkerIndex: 0,
        
            constructor: function () {
                this._workers = {};
                this._workerList = [];

                var WorkerType = has('web-workers') ? AsyncWorker : SyncWorker;

                for (var i = 0; i < this.numWorkers; i++) {
                    var worker = new WorkerType({id: workerId++});
                    this._workers[worker.id] = worker;
                    this._workerList.push(worker);
                }

                this._nextWorkerIndex = 0;

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
            },

            startProcess: function(process) {
                this._workerList[this._nextWorkerIndex].startProcess(process);
                if (this._workerList[this._nextWorkerIndex + 1]) {
                    this._nextWorkerIndex = this._nextWorkerIndex + 1;
                } else {
                    this._nextWorkerIndex = 0;
                }
            }

        });

        return new Dispatcher();
    }
);