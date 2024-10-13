const {Server} = require('./../../../lib/http.js');
const assert = require('assert');
const {sendMockHttp, routeString} = require('./../../httpMock.js')
const {dbRun, TbUOM} = require('./../../../lib/db.js')

describe(`/all`, ()=>{

   before(function () {
      Server.listen();
   });

   after(function () {
      Server.stop();
   });

   it(`with no data should return 200`, function (done) {
      sendMockHttp(
         routeString("/uom/all"), 
         null,
         (res)=>{
            let data = "";
            res.on('data', (chunk)=>{ data += chunk });
            res.on('end', ()=>{  
               assert.equal(200, res.statusCode);
               done();
               // res.remove('end');
            })
         },
      )
   });

   it(`with any data should return 200`, function (done) {
      sendMockHttp(
         routeString("/uom/all"), 
         "",
         (res)=>{
            let data = "";
            res.on('data', (chunk)=>{ data += chunk });
            res.on('end', ()=>{  
               assert.equal(200, res.statusCode);
               done();
            })
         },
      )
   });

   it(`should return json`, function (done) {
      this.timeout(10000);
      sendMockHttp(
         routeString("/uom/all"), 
         "{}",
         (res)=>{
            let data = "";
            res.on('data', (chunk)=>{ data += chunk });
            res.on('end', ()=>{  
               const json = JSON.parse(data);
               
               if(data.length > 0) assert(json.length > 0);
               assert.equal(200, res.statusCode);
               done();
            })
         },
      )
   });

})