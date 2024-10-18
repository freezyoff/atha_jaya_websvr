const {parentPort, workerData: routeReq} = require('worker_threads');
const TbUOM = require('../../db/tbUOM');
const { validateQuery, HttpRouteResult, HttpRouteResp } = require('../../http');
const { isDbError } = require('../../db');

const validate = validateQuery(TbUOM.requiredColumns(true), routeReq.data);
if (validate){

   TbUOM.insertSync(routeReq.data).then(dbResult=>{
      var routeResp;
      if (isDbError(dbResult)){
         routeResp = new HttpRouteResp({
            code: 422,
            err: `Unprocessable data, ${dbResult}`,
         })
      }
      else{
         routeResp = new HttpRouteResp({
            code: 201,
            data: JSON.stringify(routeReq.data)
         })
      }
      parentPort.postMessage(new HttpRouteResult(routeReq, routeResp));
   })

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