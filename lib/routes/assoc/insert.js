const { parentPort, workerData: routeReq } = require('worker_threads');
const { HttpRouteReq, HttpRouteResp, HttpRouteResult, validateQuery } = require('./../../http.js');
const { dbRun, dbGet, dbAll, dbEach, dbQuotes, TbAssoc } = require('./../../db.js');

// check required columns
if (validateQuery(TbAssoc.requiredColumns(), routeReq.data)) {
   // prepare update statement
   let colStmt = [];
   let valStmt = [];
   TbAssoc.allColumns(false).forEach((key) => {
      if (routeReq.data.hasOwnProperty(key)) {
         colStmt.push(key)
         valStmt.push(dbQuotes(routeReq.data[key]))
      }
   });

   let sqlStmt = `INSERT INTO assoc (?) VALUES (?);`
      .replace("?", colStmt.join(","))
      .replace("?", valStmt.join(","))

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
         let result = { id: this.lastID };
         TbAssoc.allColumns(false).forEach((key) => {
            if (routeReq.data.hasOwnProperty(key)) {
               result[key] = routeReq.data[key];
            }
         });
         result = JSON.stringify(result);
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
