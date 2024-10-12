const FS = require('fs');
const { dbRun, dbAll, dbQuotes } = require('./../../lib/db.js');

function cwdPath(target) {
   return `${process.cwd()}/${target}`;
}

async function fetchMigrations() {
   return new Promise((resolve, reject) => {
      let sql = `SELECT id, name FROM migrations ORDER BY id DESC`
      dbAll(sql, (err, rows) => {
         if (err) {
            throw err;
         }
         resolve(rows);
      })
   })
}

function help(){
   console.info("Usage:");
   console.info("npm run migration:rollback [number of step]");
   console.info("");
   console.info("Options:");
   console.info("[all: rollback all]");
   console.info("[interger number: rollback by n given steps]");
   console.info("");
}


/**
 * remove database entry
 * @param {string} filename 
 * @returns 
 */
async function markDown(id) {
   return new Promise((resolve, reject) => {
      let sql = `DELETE FROM migrations WHERE id=${id};`;
      dbAll(sql, (err, rows) => {
         if (err) throw err;
         resolve(true);
      })
   })
}

async function execDown(filename) {
   return new Promise(async (resolve, reject) => {
      let path = cwdPath(`${process.env.MIGRATION_PATH}/${filename}`);
      const target = require(path);
      let res = await target.down();
      if (res) {
         resolve(res);
      }
   })
}

async function run(args){

   // no arguments given, do nothing
   var validateArgs = args.length > 0 && (args[0] == 'all' || !isNaN(args[0]));
   if (!validateArgs){
      help();
      return;
   }

   var fetch = await fetchMigrations();

   // how many step
   var step = args[0] == 'all'? fetch.length : parseInt(args[0]);
   step = Math.min(step, fetch.length);
   if (step <= 0){
      console.log("Nothing to rollback!");
      console.log("");
   }

   console.log("Rollback:");
   for (var i=0; i<step; i++){
      var fileList = fetch[i].name.split(",");
      fileList.reverse();
      for (var file of fileList){
         await execDown(file);
      }

      await markDown(fetch[i].id);
      console.log("- Step:", i+1);
      console.log("- Files:", fetch[i].name.split(","));
      console.log("")
   }
   console.log("");
}

module.exports = run;