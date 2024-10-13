const FS = require('fs');
const { cwdPath } = require('./../utils.js');

var template = `
const { dbRun } = require("../lib/db");

var tableName = "xx";

async function up() { 
   return new Promise((resolve, reject)=>{
      let sql = \`
         CREATE TABLE IF NOT EXISTS \$\{tableName\} (
            id TEXT NOT NULL
         );
      \`
      dbRun(sql, (err)=>{
         if (err) throw err;
         resolve(true);
      })
   });
}

async function down() { 
   return new Promise((resolve, reject)=>{
      let sql = \`DROP TABLE IF EXISTS \$\{tableName\};\`
      dbRun(sql, (err)=>{
         if (err) throw err;
         resolve(true);
      })
   });
}

module.exports = { up, down };
`;

module.exports = function run(args){
   if (args.length <= 0 || args[0] == null || args[0] === undefined){
      console.info("Usage:");
      console.info("node ./lib/migration.js template [args]");
      console.info("npm run migration template [args]");
      console.info("");
      console.info("Options:");
      console.info("[args: file name]");
      console.info("");
      return;
   }

   // console.log(args);
   var tm = new Date().getTime();
   var fname = args.join("_");
   var path = `${process.env.MIGRATION_PATH}/${tm}_${fname}.js`;

   // console.log("args", args);
   // console.log("fname", fname);
   // console.log("path", path);
   // console.log("cwd", cwdPath(path));

   FS.writeFileSync(path, template, { flag: 'wx' }, function (err) {
      if (err) throw err;
   });
}