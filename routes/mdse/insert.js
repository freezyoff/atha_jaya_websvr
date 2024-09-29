const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);
const {WorkerResult} = require('../../interfaces/workerHelper.js');

const requiredKeys = ['group', 'name'];
const requiredValues = workerData.httpPostData.data;
const sqlStmt = `INSERT INTO mdse ([group], name) VALUES (?,?);`

// check if request contains ([group], name)
let checkAllKeys = requiredKeys.every((i) => workerData.httpPostData.data.hasOwnProperty(i));
if (checkAllKeys){
    let values = [requiredValues.group, requiredValues.name];
    
    // use old school function to access this.lastID
    Database.run(sqlStmt, values, function (err, rows) {
        if (err) {
            parentPort.postMessage(new WorkerResult(422, "bad query values", null));
        }
        else{
            let result = JSON.stringify({
                id: this.lastID,
                group: requiredValues.group, 
                name: requiredValues.name
            });
            parentPort.postMessage(new WorkerResult(201, null, result));
        }
    });
    
}
else{
    parentPort.postMessage(new WorkerResult(422, "insert query not complete", null));
}

Database.close();