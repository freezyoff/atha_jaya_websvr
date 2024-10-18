const {parentPort, workerData: routeReq} = require('worker_threads');
const { validateQuery, HttpRouteResp, HttpRouteResult } = require('../../http');
const TbUOM = require('../../db/tbUOM');
const { isDbError } = require('../../db');

const validate = validateQuery(TbUOM.requiredColumns(true), routeReq.data);
if (validate){
   TbUOM.updateSync(routeReq.data).then(result=>{
      var routeResp;
      if (isDbError(result)) {
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
else{
   parentPort.postMessage(new HttpRouteResult(
      routeReq, 
      new HttpRouteResp({
         code: 417,
         err: "Required data not provided"
      })
   ));
}