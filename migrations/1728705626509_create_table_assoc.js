
const { dbRun } = require("../lib/db");

var tableName = "assoc";

async function up() { 
   return new Promise((resolve, reject)=>{
      let sql = `
         CREATE TABLE IF NOT EXISTS ${tableName} (
            id            INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            sup_flag      INTEGER NOT NULL DEFAULT (0),
            npwp_nik      TEXT    DEFAULT "",
            name          TEXT    NOT NULL,
            addr_street   TEXT    NOT NULL,
            addr_city     TEXT    NOT NULL,
            addr_province TEXT    NOT NULL,
            addr_zip      TEXT    NOT NULL,
            phone         TEXT    NOT NULL,
            pic_name      TEXT    DEFAULT "",
            pic_phone     TEXT    DEFAULT ""
         );
      `
      dbRun(sql, (err)=>{
         if (err) throw err;
         resolve(true);
      })
   });
}

async function down() { 
   return new Promise((resolve, reject)=>{
      let sql = `DROP TABLE IF EXISTS ${tableName};`
      dbRun(sql, (err)=>{
         if (err) throw err;
         resolve(true);
      })
   });
}

module.exports = { up, down };
