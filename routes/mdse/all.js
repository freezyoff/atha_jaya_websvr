const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);
const {WorkerResult} = require('../../interfaces/workerHelper.js');

const sqlStmt = `SELECT * FROM mdse order by name asc;`
Database.all(sqlStmt, [], (err, rows) => {
    if (err) {
        parentPort.postMessage(new WorkerResult(422, "bad query values"));
    }
    else{
        parentPort.postMessage(new WorkerResult(200, null, JSON.stringify(rows)));
    }
});

Database.close();