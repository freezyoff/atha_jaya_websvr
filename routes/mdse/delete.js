const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);

const pkCols = ['id'];
let hasPkCols = false;

// check if has one of pkCols key
pkCols.forEach((i, ind)=>{
    if (workerData.query.hasOwnProperty(i)){
        hasPkCols = true;
    }
});

let checkAllKeys = hasPkCols;
if (checkAllKeys){

    // prepare update statement
    let sqlStmt = `DELETE FROM mdse WHERE ?;`;
    let whereStmt = [];
    pkCols.forEach((key)=> whereStmt.push(`${key}=${JSON.stringify(workerData.query[key])}`))

    sqlStmt = sqlStmt.replace("?", whereStmt.join(","));
    //console.log(sqlStmt);

    Database.run(sqlStmt, [], (err, rows) => {
        if (err) {
            parentPort.postMessage({httpStatus: 422, msg: `bad query values. ${err}`});
        }
        else{
            parentPort.postMessage({httpStatus: 200, msg: rows? JSON.stringify(rows) : ""});
        }
    });
}
else{
    parentPort.postMessage({httpStatus: 422, msg: "delete query not complete"});
}

Database.close();