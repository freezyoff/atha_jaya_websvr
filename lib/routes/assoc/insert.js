const { parentPort, workerData: routeReq } = require('worker_threads');
const { HttpRouteResp, HttpRouteResult, validateQuery } = require('./../../http.js');
const TbAssoc = require('../../db/tbAssoc.js');
const { isDbError } = require('../../db.js');

// check required columns
if (validateQuery(TbAssoc.requiredColumns(), routeReq.data)) {
   TbAssoc.insertSync(routeReq.data).then(result => {
      
      var routeResp;
      if (isDbError(result)) {
         routeResp = new HttpRouteResp({
            code: 422,
            err: `Unprocessable data, ${result}`,
         })
      }
      else {
         routeReq.data[TbAssoc.keyId] = result.lastID;
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
