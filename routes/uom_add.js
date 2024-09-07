const {parentPort, workerData} = require(worker_threads);
const Sqlite3 = require(sqlite3);
const Database = new Sqlite3.Database(./atha_jaya.db);

const cols = ['type', 'code', 'desc', 'from_offset', 'multiplicand', 'denominator', 'to_offset'];
var sqlStmt = "INSERT INTO " + cols.toString();

let sqlResult = "";
var sqlStmt = `INSERT INTO uom(type, code, desc, from_offset, multiplicand, denominator, to_offset) VALUES(?,?,?,?,?,?,?)`
Database.run(sqlStmt, [], (err, rows) => {
    if (err) {
        console.log(err)
        throw err;
    }
    sqlResult = JSON.stringify(rows)
    parentPort.postMessage(sqlResult);
});

Database.close();