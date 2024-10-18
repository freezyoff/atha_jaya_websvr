const { parentPort, workerData: routeReq } = require('worker_threads');
const { HttpRouteResp, HttpRouteResult, validateQuery } = require('./../../http.js');
const { isDbError } = require('./../../db.js');
const TbMdse = require('../../db/tbMdse.js');

// check if request contains ([group], name)
let validate = validateQuery(TbMdse.requiredColumns(), routeReq.data);
if (validate) {
   
   TbMdse.insertSync(routeReq.data).then(dbResult=>{
      var routeResp;
      if (isDbError(dbResult)){
         routeResp = new HttpRouteResp({
            code: 422,
            err: `Unprocessable data, ${dbResult}`
         })
      }
      else{
         routeReq.data[TbMdse.keyId] = dbResult.lastID;
         routeResp = new HttpRouteResp({
            code: 201,
            data: JSON.stringify(routeReq.data)
         })
      }
      parentPort.postMessage(new HttpRouteResult(routeReq, routeResp));
   })
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
