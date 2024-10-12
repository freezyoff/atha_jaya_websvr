const { Server } = require('./../../../lib/http.js');
const assert = require('assert');
const { sendMockHttp, routeString } = require('./../../httpMock.js')
const { dbRun, TbAssoc, TbPrice } = require('./../../../lib/db.js')

function createMockMdseData(howMany) {
   return new Promise((resolve, reject)=>{
      let sql = `INSERT INTO mdse ([group], name) VALUES ?;`;
      let values = [];
      for (var i = 0; i < howMany; i++) {
         values.push(`('group ${i}', 'name ${i}')`);
      }
      sql = sql.replace("?", values.join(","));
      dbRun(sql, (err, rows) => {
         resolve(true)
      });
   })
}

function createMockAssocData(howMany) {
   return new Promise((resolve, reject)=>{
      const cols = TbAssoc.allColumns();
      let sql = `INSERT INTO assoc (${cols.join(",")}) VALUES ?;`;
      let values = [];
      for (var i = 0; i < howMany; i++) {
         let rows = [];
         for (var idx in cols) {
            rows.push(`'${cols[idx]} ${i}'`);
         }
         values.push(`(${rows.join(",")})`);
      }
      sql = sql.replace("?", values.join(","));
      dbRun(sql, (err) => {
         resolve(true)
      });
   })
}

function clearMdse(){
   return new Promise((resolve, reject)=>{
      dbRun(`DELETE FROM assoc;`, ()=>{
         resolve(true);
      });
   })
}

function clearAssoc(){
   return new Promise((resolve, reject)=>{
      dbRun(`DELETE FROM mdse;`, ()=>{
         resolve(true);
      });
   })
}

function clearPrice(){
   return new Promise((resolve, reject)=>{
      dbRun(`DELETE FROM assoc_mdse_prices;`, ()=>{
         resolve(true);
      });
   })
}

function resetAutoIncreament(){
   return new Promise((resolve, reject)=>{
      dbRun(`DELETE from sqlite_sequence where name in ('assoc', 'mdse', 'assoc_mdse_prices');`, ()=>{
         resolve(true)
      });
   })
}

const mockDataLen = 5;

describe(`/insert`, () => {

   before(async function () {
      await createMockMdseData(mockDataLen);
      await createMockAssocData(mockDataLen);
      Server.listen();
   });

   after(async function () {
      Server.stop();
      await clearMdse();
      await clearAssoc();
      await clearPrice();
      await resetAutoIncreament();
   });

   it(`with no data should return 417`, function (done) {
      sendMockHttp(
         routeString("/price/insert"),
         null,
         (res) => {
            let data = "";
            res.on('data', (chunk) => { data += chunk });
            res.on('end', () => {
               assert.equal(417, res.statusCode);
               done();
            })
         },
      )
   });

   it(`with any data should return 417`, function (done) {
      this.timeout(10000)
      sendMockHttp(
         routeString("/price/insert"),
         "{g:'asdasdas'}",
         (res) => {
            let data = "";
            res.on('data', (chunk) => { data += chunk });
            res.on('end', () => {
               assert.equal(417, res.statusCode);
               done();
            })
         },
      )
   });

   it(`with complete data should return 201 & json data`, function (done) {
      this.timeout(10000)
      let mock = {};
      mock[TbPrice.keyDate] = new Date().getTime();
      mock[TbPrice.keyAssocId] = 1;
      mock[TbPrice.keyMdseId] = 1;
      mock[TbPrice.keyAmmount] = 200000;
      sendMockHttp(
         routeString("/price/insert"),
         JSON.stringify(mock),
         (res) => {
            let data = "";
            res.on('data', (chunk) => { data += chunk });
            res.on('end', () => {
               const json = JSON.parse(data);
               assert.deepEqual(mock, json);
               assert.equal(201, res.statusCode);
               done();
            })
         }
      );
   })
})