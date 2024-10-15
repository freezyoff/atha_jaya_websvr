const { parentPort, workerData: routeReq } = require('worker_threads');
const { HttpRouteReq, HttpRouteResp, HttpRouteResult, validateQuery } = require('./../../http.js');
const { dbRun, dbGet, dbAll, dbEach, dbQuotes, TbAssoc } = require('./../../db.js');

const isPrimaryKeysProvided = validateQuery(TbAssoc.primaryKeyColumns(), routeReq.data);
const isRequiredKeysProvided = validateQuery(TbAssoc.requiredColumns(), routeReq.data);
if (isPrimaryKeysProvided && isRequiredKeysProvided) {
   let sqlStmt = `UPDATE assoc SET ? WHERE ?;`

   let setStmt = [];
   let cc = TbAssoc.allColumns(false);
   cc.forEach((i, ind) => {
      if (routeReq.data.hasOwnProperty(i)) {
         setStmt.push(`${i}=${dbQuotes(routeReq.data[i])}`);
      }
   });

   let whereStmt = [];
   TbAssoc.primaryKeyColumns().forEach((i, ind) => {
      whereStmt.push(`${i}=${dbQuotes(routeReq.data[i])}`);
   });

   sqlStmt = sqlStmt.replace("?", setStmt.join(",")).replace("?", whereStmt.join(","));
   
   dbRun(sqlStmt, (err, rows) => {
      var routeResp;
      if (err) {
         routeResp = new HttpRouteResp({
            code: 422,
            err: `Unprocessable data, ${err}`,
         })
      }
      else {
         routeResp = new HttpRouteResp({
            code: 200,
            data: JSON.stringify(routeReq.data)
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
