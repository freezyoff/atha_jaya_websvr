const { parentPort, workerData: routeReq } = require('worker_threads');
const { HttpRouteResp, HttpRouteResult, validateQuery } = require('./../../http.js');
const TbPrice = require('../../db/tbPrice.js');
const { isDbError } = require('../../db.js');

const validate = validateQuery([TbPrice.keyAssocId, TbPrice.keyMdseId], routeReq.data);
if (validate) {
   TbPrice.historySync(routeReq.data).then( result => {
      var routeResp;
      if (isDbError(result)) {
         routeResp = new HttpRouteResp({
            code: 422,
            err: `Unprocessable data, ${result}`,
         })
      }
      else {
         routeResp = new HttpRouteResp({
            code: 200,
            data: JSON.stringify(result),
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