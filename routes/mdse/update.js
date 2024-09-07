const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);

const pkCols = ['id'];
const setCols = ['group', 'name'];
let hasPkCols = false;
let hasSetCols = false;
let updateCols = [];

// check if has one of setCols key
setCols.forEach((i, ind)=>{
    if (workerData.query.hasOwnProperty(i)){
        hasSetCols = true;
        updateCols.push(i);
    }
});

// check if has one of pkCols key
pkCols.forEach((i, ind)=>{
    if (workerData.query.hasOwnProperty(i)){
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
    updateCols.forEach((key)=> setStmt.push(`${key}=${JSON.stringify(workerData.query[key])}`))
    pkCols.forEach((key)=> whereStmt.push(`${key}=${JSON.stringify(workerData.query[key])}`))

    sqlStmt = sqlStmt.replace("?", setStmt.join(","))
                    .replace("?", whereStmt.join(","))
                    .replace("group=", "[group]=");
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
    parentPort.postMessage({httpStatus: 422, msg: "update query not complete"});
}

Database.close();