const FS = require('fs');
const { dbRun, dbAll, dbQuotes } = require('./../../lib/db.js');
const { cwdPath } = require('./../utils.js');

// check if table migration is created
function createTable() {
   return new Promise((resolve, reject) => {
      let sql = `
      CREATE TABLE IF NOT EXISTS migrations (
         id    INTEGER NOT NULL PRIMARY KEY,
         date  INTEGER NOT NULL,
         name  TEXT    NOT NULL
      );`;
      dbRun(sql, (err) => {
         if (err) {
            throw err;
         }
         resolve(true);
      })
   })
}

async function fetch() {
   return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM migrations ORDER BY date ASC`
      dbAll(sql, (err, rows) => {
         if (err) {
            throw err;
         }
         resolve(rows);
      })
   })
}

/**
 * mark that current file name has been executed
 * @param {string} filename 
 * @returns 
 */
async function markUp(filename) {
   return new Promise((resolve, reject) => {
      let values = [
         dbQuotes(new Date().getTime()),
         dbQuotes(filename)
      ]
      let sql = `INSERT INTO migrations (date, name) VALUES(?);`
                  .replace("?", values.join(","));
      dbAll(sql, (err, rows) => {
         if (err) throw err;
         resolve(true);
      })
   })
}

async function execUp(filename) {
   return new Promise(async (resolve, reject) => {
      let path = cwdPath(`${process.env.MIGRATION_PATH}/${filename}`);
      const target = require(path);
      let res = await target.up();
      if (res) {
         // markUp(filename);
         resolve(res);
      }
   })
}

/**
 * main function
 */
module.exports = async function run(args) {
   var files = filenames = FS.readdirSync(cwdPath(process.env.MIGRATION_PATH));
   // console.log(files);

   // create table
   await createTable();

   // check if table available
   var latestMigrations = await fetch();
   var flatLatesMigrations = [];
   // flatten
   for (var item of latestMigrations) {
      flatLatesMigrations.push(item.name);
   }
   flatLatesMigrations = flatLatesMigrations.join(",");

   var successfullUp = [];
   for (var file of files) {
      if (!flatLatesMigrations.includes(file)) {
         var res = await execUp(file);
         successfullUp.push(file);
      }
   }

   if (successfullUp.length > 0) {
      markUp(successfullUp.join(","));
   }

   if (successfullUp.length > 0) {
      console.log("Run Migration:");
      for (var file of successfullUp){
         console.info("-", file);
      }
   }
   else {
      console.info("Nothing to migrate")
   }
   console.info("")
   return;
}