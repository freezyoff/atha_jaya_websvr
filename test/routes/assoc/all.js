const {Server} = require('./../../../lib/http.js');
const assert = require('assert');
const {sendMockHttp, routeString} = require('./../../httpMock.js')
const {dbRun, TbAssoc} = require('./../../../lib/db.js')

function createMockData(howMany){
   const cols = TbAssoc.allColumns(false);
   let sql =  `INSERT INTO assoc (${cols.join(",")}) VALUES ?;`;
   let values = [];
   for (var i=0; i<howMany; i++){
      let rows = [];
      for(var idx in cols){
         rows.push(`'${cols[idx]} ${i}'`);
      }
      values.push(`(${rows.join(",")})`);
   }
   sql = sql.replace("?", values.join(","));
   dbRun(sql);
}

function clearMockData(){
   dbRun(`DELETE FROM assoc`);
   dbRun(`delete from sqlite_sequence where name='assoc';`);
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
         routeString("/assoc/all"), 
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
         routeString("/assoc/all"), 
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
         routeString("/assoc/all"), 
         "{}",
         (res)=>{
            let data = "";
            res.on('data', (chunk)=>{ data += chunk });
            res.on('end', ()=>{  
               const json = JSON.parse(data);
               assert.equal(json.length, mockDataLen);
               assert.equal(200, res.statusCode);
               done();
            })
         },
      )
   });

})