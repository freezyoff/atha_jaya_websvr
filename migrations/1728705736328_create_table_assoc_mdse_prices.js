
const { dbRun } = require("../lib/db");

var tableName = "assoc_mdse_prices"

async function up() { 
   return new Promise((resolve, reject)=>{
      let sql = `
         CREATE TABLE IF NOT EXISTS ${tableName} (
            date     INTEGER PRIMARY KEY,
            assoc_id INTEGER NOT NULL REFERENCES assoc (id),
            mdse_id  INTEGER NOT NULL REFERENCES mdse (id),
            amount   REAL    NOT NULL
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
