require('dotenv').config();
const assert = require('assert');
const {Server} = require('./../../../lib/http.js');
const {sendMockHttp, routeString} = require('./../../httpMock.js')
const {dbRun} = require('./../../../lib/db.js');

function clearMockData(){
   dbRun(`DELETE FROM mdse`);
   dbRun(`delete from sqlite_sequence where name='mdse';`);
}

describe("/insert", ()=>{
      
   before(function () {
      clearMockData();
      Server.listen();
   });

   after(function () {
      Server.stop();
      clearMockData();
   });

   it(`with no data should return 417`, function (done) {
      sendMockHttp(
         routeString("/mdse/insert"), 
         null, 
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

   it(`with incomplete data should return 417`, function (done) {
      sendMockHttp(
         routeString("/mdse/insert"), 
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

   it(`with complete data should return 201 & json data`, function (done) {
      this.timeout(5000);
      sendMockHttp(
         routeString("/mdse/insert"), 
         JSON.stringify({'group':'group aaa', 'name': 'aaa'}), 
         (res)=>{
            let data = "";
            res.on('data', (chunk)=>{ data += chunk });
            res.on('end', ()=>{  
               const json = JSON.parse(data);
               assert.notEqual(json.id, null);
               assert.notEqual(json.name, null);
               assert.notEqual(json.group, null);
               assert.equal(201, res.statusCode);
               done();
            })
         },
         (err)=>{
            console.log(err);
         },
      )
   });
})
