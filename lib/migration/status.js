require('dotenv').config();
const FS = require('fs');
const { dbRun, dbAll, dbQuotes } = require('./../../lib/db.js');

async function fetchMigration() {
   return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM migrations ORDER BY id ASC`
      dbAll(sql, (err, rows) => {
         if (err) {
            throw err;
         }
         resolve(rows);
      })
   })
}

module.exports = async function(){
   var fetch = await fetchMigration();
   if (fetch.length > 0){
      var step=0;
      for (var item of fetch){
         console.log("step:", ++step);
         console.log("date:", new Date(item.date));
         console.log("files:", item.name.split(","));
         console.log("");
      }
   }
   else{
      console.log("No migration yet!");
   }

   console.log("");
}