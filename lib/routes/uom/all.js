const {parentPort, workerData: routeReq} = require('worker_threads');
const {HttpRouteReq, HttpRouteResp, HttpRouteResult, validateQuery} = require('./../../http.js');
const {dbRun, dbGet, dbAll, dbEach, dbQuotes} = require('./../../db.js');

dbAll("SELECT * FROM UOM;", (err, rows)=>{
   var routeResp;
   if (err) {
      routeResp =  new HttpRouteResp({
         code: 422,
         err: `Bad query values, ${err}`,
      })
  }
  else{
      routeResp =  new HttpRouteResp({
         code: 200,
         data: JSON.stringify(rows)
      })
  }
  parentPort.postMessage(new HttpRouteResult(routeReq, routeResp));
});