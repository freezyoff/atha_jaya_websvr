require('dotenv').config();
const Sqlite3 = require('sqlite3');

function dbQuotes(str){
    return JSON.stringify(str).replace(/\\\"/g, `\"\"`);
}

function dbRun(sql, callback){
    const DB = new Sqlite3.Database(process.env.DB_PATH);
    DB.run(sql, callback);
    DB.close();
}

function dbGet(sql, callback){
    const DB = new Sqlite3.Database(process.env.DB_PATH);
    DB.get(sql, callback);
    DB.close();
}

function dbAll(sql, callback){
    const DB = new Sqlite3.Database(process.env.DB_PATH);
    DB.all(sql, callback);
    DB.close();
}

function dbEach(sql, callback){
    const DB = new Sqlite3.Database(process.env.DB_PATH);
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