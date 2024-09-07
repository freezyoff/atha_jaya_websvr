const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database('./atha_jaya.db');

let sqlResult = "";
Database.all(`SELECT * FROM uom`, [], (err, rows) => {
    if (err) {
        parentPort.postMessage({err: 1, msg: err});
    }
    else{
        sqlResult = JSON.stringify(rows)
        parentPort.postMessage({err: 0, msg: sqlResult});
    }
});

Database.close();