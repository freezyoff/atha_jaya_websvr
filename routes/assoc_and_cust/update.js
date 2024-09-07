const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);

const setCols = ['npwp_nik', 'name', 'addr', 'phone'];
const pkCols = ['id'];
let sqlStmt = `UPDATE assoc_and_cust SET ? WHERE ?;`

// required columns ('name', 'addr', 'phone')
let hasPkCols = pkCols.every((i) => workerData.query.hasOwnProperty(i));

let checkAllKeys = hasPkCols;
if (checkAllKeys){

    let stmtCols = [];
    setCols.forEach((i, ind)=>{
        if (workerData.query.hasOwnProperty(i)){
            stmtCols.push(`${i}=${JSON.stringify(workerData.query[i])}`);
        }
    });

    let stmtPk = [];
    pkCols.forEach((i, ind) => {
        stmtPk.push(`${i}=${JSON.stringify(workerData.query[i])}`);
    });

    sqlStmt = sqlStmt.replace("?", stmtCols.join(",")).replace("?", stmtPk.join(","));
    console.log(sqlStmt);

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
    parentPort.postMessage({httpStatus: 422, msg: "update query not complete"});
}

Database.close();