const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);
const {WorkerResult} = require('../../interfaces/workerHelper.js');
const {dbStripQuotes} = require('../../interfaces/dbHelper.js');

const cols = {
    required: function(){  
        return ["id"]
    },
    all: function(){ 
        return this.required().concat([
            "sup_flag", 
            "npwp_nik", 
            "name", 
            "addr_street", 
            "addr_city", 
            "addr_province", 
            "addr_zip", 
            "phone", 
            "pic_name", 
            "pic_phone"
        ]) 
    },
    validate: function(){
        return this.required().every((i) => workerData.httpPostData.data.hasOwnProperty(i));
    }
}

if (cols.validate()){
    let sqlStmt = `UPDATE assoc SET ? WHERE ?;`

    let setStmt = [];
    let cc = cols.all();
    cc.shift();
    cc.forEach((i, ind)=>{
        console.log(i, "has =>", workerData.httpPostData.data.hasOwnProperty(i))
        if (workerData.httpPostData.data.hasOwnProperty(i)){
            setStmt.push(`${i}=${dbStripQuotes(workerData.httpPostData.data[i])}`);
        }
    });

    let whereStmt = [];
    cols.required().forEach((i, ind) => {
        whereStmt.push(`${i}=${dbStripQuotes(workerData.httpPostData.data[i])}`);
    });
    
    sqlStmt = sqlStmt.replace("?", setStmt.join(",")).replace("?", whereStmt.join(","));
    console.log(sqlStmt)

    Database.run(sqlStmt, [], (err, rows) => {
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