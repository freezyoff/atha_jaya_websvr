const { parentPort, workerData: routeReq } = require('worker_threads');
const { HttpRouteReq, HttpRouteResp, HttpRouteResult, validateQuery } = require('./../../http.js');
const { dbRun, dbGet, dbAll, dbEach, dbQuotes, TbMdse } = require('./../../db.js');

const requiredKeys = TbMdse.requiredColumns();
const requiredValues = routeReq.data;

// check if request contains ([group], name)
let checkAllKeys = validateQuery(requiredKeys, routeReq.data);
if (checkAllKeys) {

   // prepare sql statement
   let sqlStmt = `INSERT INTO mdse ([group], name) VALUES (?,?);`
   let values = [requiredValues.group, requiredValues.name];
   for (var item in values){
      sqlStmt = sqlStmt.replace("?", dbQuotes(values[item]));
   }
   
   // use old school function to access this.lastID
   dbRun(sqlStmt, function (err, rows) {
      var routeResp;
      if (err) {
         routeResp = new HttpRouteResp({
            code: 422,
            err: `Unprocessable data, ${err}`,
         })
      }
      else {
         let result = JSON.stringify({
            id: this.lastID,
            group: requiredValues.group,
            name: requiredValues.name
         });
         routeResp = new HttpRouteResp({
            code: 201,
            data: result
         })
      }
      parentPort.postMessage(new HttpRouteResult(routeReq, routeResp));
   });

}
else {
   parentPort.postMessage(new HttpRouteResult(
      routeReq, 
      new HttpRouteResp({
         code: 417,
         err: "Required data not provided"
      })
   ));
}
