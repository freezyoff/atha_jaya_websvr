const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);

const sqlStmt = `SELECT "group" FROM mdse group by "group";`
Database.all(sqlStmt, [], (err, rows) => {
    if (err) {
        parentPort.postMessage({httpStatus: 422, msg: "bad query values"});
    }
    else{
        parentPort.postMessage({httpStatus: 200, msg: JSON.stringify(rows)});
    }
});

Database.close();