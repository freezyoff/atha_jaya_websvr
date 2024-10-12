
const { dbRun } = require("../lib/db");

var tableName = "mdse";

async function up() { 
   return new Promise((resolve, reject)=>{
      let sql = `
         ALTER TABLE ${tableName}
         ADD COLUMN weight REAL DEFAULT(0);
      `
      dbRun(sql, (err)=>{
         if (err) throw err;
         resolve(true);
      })
   });
}

async function down() { 
   return new Promise((resolve, reject)=>{
      let sql = `
         ALTER TABLE ${tableName}
         DROP COLUMN weight;
      `
      dbRun(sql, (err)=>{
         if (err) throw err;
         resolve(true);
      })
   });
}

module.exports = { up, down };
