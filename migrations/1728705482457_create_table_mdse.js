const { dbRun } = require("../lib/db");

async function up() { 
   return new Promise((resolve, reject)=>{
      let sql = `
         CREATE TABLE IF NOT EXISTS mdse (
            id      INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            [group] TEXT    NOT NULL,
            name    TEXT    NOT NULL
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
      let sql = `DROP TABLE IF EXISTS mdse;`
      dbRun(sql, (err)=>{
         if (err) throw err;
         resolve(true);
      })
   });
}

module.exports = { up, down };
