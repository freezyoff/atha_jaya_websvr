const FS = require('fs');
const Sqlite3 = require('sqlite3');
const {cwdPath, isDefined} = require('./utils.js');

const dirPath = process.env.DB_PATH.split("/");
dirPath.pop();

if (!FS.existsSync(dirPath.join("/"))){
   FS.mkdirSync(cwdPath(dirPath.join("/")));
}

const dbPath = process.env.DB_PATH;
// console.log("dbPath ==> ", dbPath);

function dbQuotes(str){
    return JSON.stringify(str).replace(/\\\"/g, `\"\"`);
}

function dbRun(sql, callback){
    const DB = new Sqlite3.Database(dbPath);
    DB.run(sql, callback);
    DB.close();
}

function dbGet(sql, callback){
    const DB = new Sqlite3.Database(dbPath);
    DB.get(sql, callback);
    DB.close();
}

function dbEach(sql, callback){
    const DB = new Sqlite3.Database(dbPath);
    DB.all(sql, callback);
    DB.close();
}

function dbAll(sql, callback){
   const DB = new Sqlite3.Database(dbPath);
   DB.all(sql, callback);
   DB.close();
}

function isDbError(obj){
   if (isDefined(obj)){
      return isDefined(obj.errno) && isDefined(obj.code);
   }
   return false;
}

module.exports = {
    dbRun, 
    dbGet, 
    dbAll, 
    dbEach, 
    dbQuotes,
    isDbError
};