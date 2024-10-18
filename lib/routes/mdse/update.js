const { parentPort, workerData: routeReq } = require('worker_threads');
const { HttpRouteResp, HttpRouteResult, validateQuery } = require('./../../http.js');
const TbMdse = require('../../db/tbMdse.js');
const { isDbError } = require('../../db.js');

// check if required column provided
const validate = validateQuery(TbMdse.requiredColumns(true), routeReq.data);
if (validate){
   TbMdse.updateSync(routeReq.data).then(result=>{
      var routeResp;
      if (isDbError(result)) {
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
else{
   parentPort.postMessage(new HttpRouteResult(
      routeReq,
      new HttpRouteResp({
         code: 417,
         err: "Required data not provided"
      })
   ));
}