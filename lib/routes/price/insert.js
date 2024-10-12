const { parentPort, workerData: routeReq } = require('worker_threads');
const { HttpRouteReq, HttpRouteResp, HttpRouteResult, validateQuery } = require('./../../http.js');
const { dbRun, dbGet, dbAll, dbEach, dbQuotes, TbPrice } = require('./../../db.js');

const cols = {
   required: function () {
      return ['date', 'assoc_id', 'mdse_id', 'amount'];
   },
   all: function () {
      return this.required();
   },
   validate: function () {
      return this.required().every((i) => workerData.httpPostData.data.hasOwnProperty(i));
   }
}

const requiredColumns = TbPrice.primaryKeyColumns().concat(TbPrice.allColumns());
const isRequiredColumnsProvided = validateQuery(requiredColumns, routeReq.data);

// check required columns
if (isRequiredColumnsProvided) {
   // prepare update statement
   let colStmt = [];
   let valStmt = [];
   requiredColumns.forEach((key) => {
      if (routeReq.data.hasOwnProperty(key)) {
         colStmt.push(key)
         valStmt.push(dbQuotes(routeReq.data[key]))
      }
   });

   let sqlStmt = `INSERT INTO assoc_mdse_prices (?) VALUES (?);`
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
         routeResp = new HttpRouteResp({
            code: 201,
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
