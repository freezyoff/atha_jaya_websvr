const { parentPort, workerData: routeReq } = require('worker_threads');
const { HttpRouteResp, HttpRouteResult } = require('./../../http.js');
const TbMdse = require('../../db/tbMdse.js');
const { isDbError } = require('../../db.js');

TbMdse.allSync().then(result=>{
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
         data: JSON.stringify(result)
      })
   }
   parentPort.postMessage(new HttpRouteResult(routeReq, routeResp));
});