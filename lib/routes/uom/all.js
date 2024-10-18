const {parentPort, workerData: routeReq} = require('worker_threads');
const TbUOM = require('../../db/tbUOM');
const { isDbError } = require('../../db');
const { HttpRouteResp, HttpRouteResult } = require('../../http');

TbUOM.allSync().then(errOrResult=>{
   var routeResp;
   if (isDbError(errOrResult)) {
      routeResp =  new HttpRouteResp({
         code: 422,
         err: `Unprocessable data, ${errOrResult}`,
      })
  }
  else{
      routeResp =  new HttpRouteResp({
         code: 200,
         data: JSON.stringify(errOrResult)
      })
  }
  parentPort.postMessage(new HttpRouteResult(routeReq, routeResp));
});