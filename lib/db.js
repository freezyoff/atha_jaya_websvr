const FS = require('fs');
const Sqlite3 = require('sqlite3');

function cwdPath(target) {
   return `${process.cwd()}/${target}`;
}

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

function dbAll(sql, callback){
    const DB = new Sqlite3.Database(dbPath);
    DB.all(sql, callback);
    DB.close();
}

function dbEach(sql, callback){
    const DB = new Sqlite3.Database(dbPath);
    DB.all(sql, callback);
    DB.close();
}

module.exports = {
    dbRun, 
    dbGet, 
    dbAll, 
    dbEach, 
    dbQuotes,
    TbMdse: require('./db/tbMdse.js'),
    TbAssoc: require('./db/tbAssoc.js'),
    TbPrice: require('./db/tbPrice.js')
};