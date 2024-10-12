require('dotenv').config();
const FS = require('fs');
const Path = require("path");

function cwdPath(target) {
   return `${process.cwd()}/${target}`;
}

if (!FS.existsSync(cwdPath(process.env.MIGRATION_PATH))){
   FS.mkdirSync(cwdPath(process.env.MIGRATION_PATH));
}

var args = process.argv.slice(2);
var cmd = args[0];
var childArgs = args = args.slice(1);
switch(cmd){
   case 'template':
      require('./migration/template.js')(childArgs);
      break;

   case 'migrate':
      require('./migration/migrate.js')(childArgs);
      break;

   case 'status':
      require('./migration/status.js')(childArgs);
      break;

   case 'rollback':
      require('./migration/rollback.js')(childArgs);
      break;

   default:
      console.info("Usage:");
      console.info("node ./lib/migration.js [args]");
      console.info("npm run migration [args]");
      console.info("");
      console.info("Options:");
      console.info("[template: create template for migration]");
      console.info("[status: status of migration]");
      console.info("[migrate: execute migration]");
      console.info("[rollback: rollback migration]");
      console.info("");
}

