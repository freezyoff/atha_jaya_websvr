const {Server} = require('./../../../lib/http.js');
const assert = require('assert');
const {sendMockHttp, routeString} = require('./../../httpMock.js')
const {dbRun} = require('./../../../lib/db.js')

function createMockData(howMany){
   let sql =  `INSERT INTO mdse ([group], name) VALUES ?;`;
   let values = [];
   for (var i=0; i<howMany; i++){
      values.push(`('group ${i}', 'name ${i}')`);
   }
   sql = sql.replace("?", values.join(","));
   dbRun(sql);
}

function clearMockData(){
   dbRun(`DELETE FROM mdse`);
   dbRun(`delete from sqlite_sequence where name='mdse';`);
}

const mockDataLen = 5;

describe(`/all`, ()=>{

   before(function () {
      createMockData(mockDataLen);
      Server.listen();
   });

   after(function () {
      Server.stop();
      clearMockData();
   });

   it(`with no data should return 200`, function (done) {
      sendMockHttp(
         routeString("/mdse/all"), 
         null,
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

   it(`with any data should return 200`, function (done) {
      sendMockHttp(
         routeString("/mdse/all"), 
         "{}",
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
         routeString("/mdse/all"), 
         "{}",
         (res)=>{
            let data = "";
            res.on('data', (chunk)=>{ data += chunk });
            res.on('end', ()=>{  
               const json = JSON.parse(data);
               assert.equal(typeof json, "object");
               assert.equal(json.length, mockDataLen);
               assert.equal(200, res.statusCode);
               done();
            })
         },
      )

   });

})