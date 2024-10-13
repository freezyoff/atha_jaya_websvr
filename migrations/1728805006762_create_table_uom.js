
const { dbRun } = require("../lib/db");

var tableName = "uom";

async function exeDb(sql){
   return new Promise((resolve, reject)=>{
      dbRun(sql, (err)=>{
         if (err) throw err;
         resolve(true);
      })
   });
}

async function up() { 
   return new Promise(async function(resolve, reject){
      let sql = `
         CREATE TABLE IF NOT EXISTS ${tableName} (
            abbr        TEXT    PRIMARY KEY    NOT NULL,
            is_base     INTEGER NOT NULL,
            ref_base    TEXT,
            conversion  REAL    NOT NULL,
            desc        TEXT
         );
      `

      await exeDb(sql);

      sql = `
         INSERT INTO ${tableName} 
            (abbr, is_base, ref_base, conversion, desc)
         VALUES 
            ('pcs',     1,    'pcs',   1,       'piece(s) atau biji'),
            ('lusin',   0,    'pcs',   12,      'dozen atau lusin = 12 pcs'),
            ('kodi',    0,    'pcs',   20,      'kodi = 20 pcs'),
            ('mg',      1,    null,    1,       'mili gram'),
            ('g',       0,    'mg',    1000,    'gram'),
            ('kg',      0,    'mg',    1000000, 'kilo gram')
         ;
      `

      await exeDb(sql);

      resolve(true);
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
