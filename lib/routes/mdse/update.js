const { parentPort, workerData: routeReq } = require('worker_threads');
const { HttpRouteReq, HttpRouteResp, HttpRouteResult, validateQuery } = require('./../../http.js');
const { dbRun, dbGet, dbAll, dbEach, dbQuotes, TbMdse } = require('./../../db.js');

const pkCols = TbMdse.primaryKeyColumns();
const setCols = TbMdse.requiredColumns();
let hasPkCols = false;
let hasSetCols = false;
let updateCols = [];

// console.log("routeReq.data", routeReq.data);
// console.log(routeReq.data != null && typeof routeReq.data === 'object');

// check if routeReq.data is valid json
if (routeReq.data != null && typeof routeReq.data === 'object') {

   // check if has one of setCols key
   setCols.forEach((i, ind) => {
      if (routeReq.data.hasOwnProperty(i)) {
         hasSetCols = true;
         updateCols.push(i);
      }
   });

   // check if has one of pkCols key
   pkCols.forEach((i, ind) => {
      if (routeReq.data.hasOwnProperty(i)) {
         hasPkCols = true;
      }
   });

}

// check if request contains ([group], name)
let checkAllKeys = hasPkCols && hasSetCols;
// console.log("checkAllKeys", checkAllKeys);
if (checkAllKeys) {

   // prepare update statement
   let sqlStmt = `UPDATE mdse SET ? WHERE ?;`
   let setStmt = [];
   let whereStmt = [];
   updateCols.forEach((key) => setStmt.push(`${key}=${dbQuotes(routeReq.data[key])}`));
   pkCols.forEach((key) => whereStmt.push(`${key}=${dbQuotes(routeReq.data[key])}`));

   sqlStmt = sqlStmt.replace("?", setStmt.join(","))
      .replace("?", whereStmt.join(","))
      .replace("group=", "[group]=");
   // console.log(sqlStmt);

   dbRun(sqlStmt, function (err, rows) {
      var routeResp;
      if (err) {
         // console.log(err);
         routeResp = new HttpRouteResp({
            code: 422,
            err: `Unprocessable data, ${err}`,
         })
      }
      else {
         // console.log(JSON.stringify(routeReq.data));
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