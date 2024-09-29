const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);
const {WorkerResult} = require('../../interfaces/workerHelper.js');
const {dbStripQuotes} = require('../../interfaces/dbHelper.js');

// const postData = workerData.httpPostData.data;
const cols = {
    required: function(){  
        return ["name", "addr", "phone"] 
    },
    all: function(){ 
        return this.required().concat(["sup_flag", "npwp_nik", "pic_name", "pic_phone"]) 
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

    let sqlStmt = `INSERT INTO assoc (?) VALUES (?);`
                    .replace("?", colStmt.join(","))
                    .replace("?", valStmt.join(","))
    
    // use old school function to access this.lastID
    Database.run(sqlStmt, [], function (err, rows) {
        if (err) {
            parentPort.postMessage(new WorkerResult(422, "bad query values", null));
        }
        else{
            let result = {id: this.lastID};
            colStmt.map((obj, idx)=>{
                result[obj] = valStmt[idx];
            });
            result = JSON.stringify(workerData.httpPostData.data);
            parentPort.postMessage(new WorkerResult(201, null, result));
        }
    });
}
Database.close();
