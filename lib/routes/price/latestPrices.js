const { parentPort, workerData: routeReq } = require('worker_threads');
const { HttpRouteResp, HttpRouteResult } = require('./../../http.js');
const TbPrice = require('../../db/tbPrice.js');
const { isDbError } = require('../../db.js');

TbPrice.latestPricesSync().then( result =>{
   let routeResp;
   if (isDbError(result)) {
      routeResp = new HttpRouteResp({
         code: 422,
         err: `Unprocessable data, ${result}`,
      })
   }
   else{
      routeResp = new HttpRouteResp({
         code: 200,
         data: JSON.stringify(result)
      })
   }

   parentPort.postMessage(new HttpRouteResult(routeReq, routeResp));
});