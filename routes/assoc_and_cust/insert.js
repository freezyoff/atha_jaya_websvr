const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);

const insertCols = ['npwp_nik', 'name', 'addr', 'phone'];
const requiredCols = insertCols.slice(1);   // exclude 'npwp_nik'

// required columns ('name', 'addr', 'phone')
let hasRequiredCols = requiredCols.every((i) => workerData.query.hasOwnProperty(i));

let sqlStmt = `INSERT INTO assoc_and_cust (?) VALUES (?);`
let checkAllKeys = hasRequiredCols;
if (checkAllKeys){

    let stmtCols = [];
    insertCols.forEach((i, ind)=>{
        if (workerData.query.hasOwnProperty(i)){
            stmtCols.push(i);
        }
    });

    let stmtVals = [];
    stmtCols.forEach((i, ind) => {
        stmtVals.push(JSON.stringify(workerData.query[i]));
    });

    sqlStmt = sqlStmt.replace("?", stmtCols.join(",")).replace("?", stmtVals.join(","));
    //console.log(sqlStmt);

    Database.run(sqlStmt, [], (err, rows) => {
        if (err) {
            parentPort.postMessage({httpStatus: 422, msg: `bad query values, ${err}`});
        }
        else{
            parentPort.postMessage({httpStatus: 201, msg: JSON.stringify(rows? rows : "")});
        }
    });

}
else{
    parentPort.postMessage({httpStatus: 422, msg: "insert query not complete"});
}

Database.close();