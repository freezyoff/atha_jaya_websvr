const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);
const {WorkerResult} = require('../../interfaces/workerHelper.js');
const {dbStripQuotes} = require('../../interfaces/dbHelper.js');

const cols = {
    required: function(){  
        return ['date', 'assoc_id', 'mdse_id', 'amount'] ;
    },
    all: function(){ 
        return this.required();
    },
    validate: function(){
        return this.required().every((i) => workerData.httpPostData.data.hasOwnProperty(i));
    }
}

// check required columns
if (cols.validate()){
    // prepare update statement
    let colStmt = [];
    let valStmt = [];
    cols.all().forEach((key) => {
        if (workerData.httpPostData.data.hasOwnProperty(key)){
            colStmt.push(key)
            valStmt.push(dbStripQuotes(workerData.httpPostData.data[key]))
        }
    });

    let sqlStmt = `INSERT INTO assoc_mdse_prices (?) VALUES (?);`
                    .replace("?", colStmt.join(","))
                    .replace("?", valStmt.join(","))
    
    // use old school function to access this.lastID
    Database.run(sqlStmt, [], function (err, rows) {
        if (err) {
            parentPort.postMessage(new WorkerResult(422, "bad query values", null));
        }
        else{
            result = JSON.stringify(workerData.httpPostData.data);
            parentPort.postMessage(new WorkerResult(201, null, result));
        }
    });
}
else{
    parentPort.postMessage(new WorkerResult(422, "insert query not complete", null));
}
Database.close();
