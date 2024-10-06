const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);
const {WorkerResult} = require('../../interfaces/workerHelper.js');
const {dbStripQuotes} = require('../../interfaces/dbHelper.js');

const pkCols = ['id'];
const setCols = ['group', 'name'];
let hasPkCols = false;
let hasSetCols = false;
let updateCols = [];

// check if has one of setCols key
setCols.forEach((i, ind)=>{
    if (workerData.httpPostData.data.hasOwnProperty(i)){
        hasSetCols = true;
        updateCols.push(i);
    }
});

// check if has one of pkCols key
pkCols.forEach((i, ind)=>{
    if (workerData.httpPostData.data.hasOwnProperty(i)){
        hasPkCols = true;
    }
});

// check if request contains ([group], name)
let checkAllKeys = hasPkCols && hasSetCols;
//console.log(`hasPkCols: ${hasPkCols},`, `hasSetCols: ${hasSetCols},`, `checkAllKeys: ${checkAllKeys}`);
if (checkAllKeys){

    // prepare update statement
    let sqlStmt = `UPDATE mdse SET ? WHERE ?;`
    let setStmt = [];
    let whereStmt = [];
    updateCols.forEach((key)=> setStmt.push(`${key}=${dbStripQuotes(workerData.httpPostData.data[key])}`));
    pkCols.forEach((key)=> whereStmt.push(`${key}=${dbStripQuotes(workerData.httpPostData.data[key])}`));

    sqlStmt = sqlStmt.replace("?", setStmt.join(","))
                    .replace("?", whereStmt.join(","))
                    .replace("group=", "[group]=");
    // console.log(sqlStmt);

    Database.run(sqlStmt, [], function (err, rows) {
        if (err) {
            parentPort.postMessage(new WorkerResult(422, "bad query values", null));
        }
        else{
            parentPort.postMessage(new WorkerResult(200, null, JSON.stringify(workerData.httpPostData.data)));
        }
    });
}
else{
    parentPort.postMessage({httpStatus: 422, msg: "update query not complete"});
}

Database.close();