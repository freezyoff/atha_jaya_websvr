const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);

const requiredKeys = ['group', 'name'];
const requiredValues = workerData.query;
const sqlStmt = `INSERT INTO mdse ([group], name) VALUES (?,?);`

// check if request contains ([group], name)
let checkAllKeys = requiredKeys.every((i) => workerData.query.hasOwnProperty(i));
if (checkAllKeys){
    let values = [requiredValues.group, requiredValues.name];
    Database.run(sqlStmt, values, (err, rows) => {
        if (err) {
            parentPort.postMessage({httpStatus: 422, msg: "bad query values"});
        }
        else{
            parentPort.postMessage({httpStatus: 201, msg: JSON.stringify(rows)});
        }
    });
}
else{
    parentPort.postMessage({httpStatus: 422, msg: "insert query not complete"});
}

Database.close();