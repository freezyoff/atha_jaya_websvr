require('dotenv').config();
const assert = require('assert');
const {Server} = require('./../../../lib/http.js');
const {sendMockHttp, routeString} = require('./../../httpMock.js')
const {dbRun} = require('./../../../lib/db.js');

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
describe("/update", ()=>{
      
   before(function () {
      createMockData(mockDataLen);
      Server.listen();
   });

   after(function () {
      Server.stop();
      clearMockData();
   });

   it(`with no data should return 417`, function (done) {
      sendMockHttp(
         routeString("/mdse/update"), 
         null, 
         (res)=>{
            let data = "";
            res.on('data', (chunk)=>{ data += chunk });
            res.on('end', ()=>{  
               assert.equal(417, res.statusCode);
               done();
            })
         },
         (err)=>{
            console.log(err);
         }

      )
   });

   it(`with incomplete data should return 417`, function (done) {
      sendMockHttp(
         routeString("/mdse/update"), 
         JSON.stringify({'group':'aaa'}), 
         (res)=>{
            let data = "";
            res.on('data', (chunk)=>{ data += chunk });
            res.on('end', ()=>{  
               assert.equal(417, res.statusCode);
               done();
            })
         },
      )
   });

   it(`with complete data should return 200 & json data`, function (done) {
      this.timeout(10000);
      let data = JSON.stringify({
         id: 2,
         group: 'update group', 
         name: 'update name',
      });
      sendMockHttp(
         routeString("/mdse/update"), 
         data, 
         (res)=>{
            let data = "";
            res.on('data', (chunk)=>{ data += chunk });
            res.on('end', ()=>{  
               const json = JSON.parse(data);
               assert.notEqual(json.id, data.id);
               assert.notEqual(json.name, data.name);
               assert.notEqual(json.group, data.group);
               assert.equal(200, res.statusCode);
               done();
            })
         },
         (err)=>{
            console.log(err);
         },
      )
   });
})
