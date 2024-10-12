require('dotenv').config();

if (!process.env.PRODUCTION || process.env.PRODUCTION == 'false'){
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

require('dotenv').config();
const Fs = require('fs');

const isSecureHttp = process.env.HTTP_SECURE == 'true'
const { request } = isSecureHttp ? require('https') : require('http');

const httpOptions = {};
if (isSecureHttp) {
   httpOptions.key = Fs.readFileSync(process.env.HTTP_PRIVATE_KEY),
      httpOptions.cert = Fs.readFileSync(process.env.HTTP_CERTIFICATE)
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