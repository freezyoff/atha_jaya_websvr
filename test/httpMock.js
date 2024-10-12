const Fs = require('fs');

console.log("ENV_RUNTIME", process.env.ENV_RUNTIME);
console.log("HTTP_SECURE", process.env.HTTP_SECURE);
console.log("HTTP_PRIVATE_KEY", process.env.HTTP_PRIVATE_KEY);
console.log("HTTP_CERTIFICATE", process.env.HTTP_CERTIFICATE);
console.log("HTTP_HOST", process.env.HTTP_HOST);
console.log("HTTP_PORT", process.env.HTTP_PORT);
console.log("DB_PATH", process.env.DB_PATH);
console.log("MIGRATION_PATH", process.env.MIGRATION_PATH);

const isSecureHttp = (process.env.HTTP_SECURE === 'true');

const { request } = isSecureHttp ? require('https') : require('http');
// var request;
if (isSecureHttp){
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}


const httpOptions = {};
if (isSecureHttp) {
   httpOptions.key = Fs.readFileSync(process.env.HTTP_PRIVATE_KEY);
   httpOptions.cert = Fs.readFileSync(process.env.HTTP_CERTIFICATE);
}

const sendMockHttp = (target, data, cbRes, cbReqErr)=>{
   // console.log("sendMockHttp:", target);
   const hasData = data? true : false;
   const postOpt = {
      host: process.env.HTTP_HOST,
      port: process.env.HTTP_PORT,
      path: target,
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Content-Length': data? data.length : 0
      }
   };

   const req = request(postOpt, function (res) {
      res.setEncoding("utf8");
      if (cbRes){
         cbRes(res);
      }
   });

   req.on('error', (err)=>{
      if (cbReqErr){
         cbReqErr(err);
      }
   });

   if (hasData){
      req.write(data);
   }
   req.end();
}

function routeString(str){
   var protocol = isSecureHttp? 'https' : 'http';
   return `${protocol}://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}${str}`
}

module.exports = {sendMockHttp, routeString};