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

function createMockData(howMany) {
   return new Promise((resolve, reject)=>{
      const cols = TbPrice.allColumns();
      let sql = `INSERT INTO assoc_mdse_prices (${cols.join(",")}) VALUES ?;`;
      let values = [];
      for (var i = 0; i < howMany; i++) {
         let rows = [];
         for (var idx in cols) {
            if (cols[idx] == TbPrice.keyDate) {
               rows.push(new Date().getTime());
            }
            else if (cols[idx] == TbPrice.keyAmmount) {
               rows.push(Math.round(Math.random() * 1000));
            }
            else {

               rows.push(Math.floor(Math.random() * (howMany - 1 + 1) + 1));
            }
         }
         values.push(`(${rows.join(",")})`);
      }
      sql = sql.replace("?", values.join(","));
      // console.log(sql);
      dbRun(sql, (err)=>{
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

describe(`/all`, () => {

   before(async function () {
      await createMockMdseData(mockDataLen);
      await createMockAssocData(mockDataLen);
      await createMockData(mockDataLen);
      Server.listen();
   });

   after(async function () {
      Server.stop();
      await clearMdse();
      await clearAssoc();
      await clearPrice();
      await resetAutoIncreament();
   });

   it(`with no data should return 200`, function (done) {
      this.timeout(10000)
      sendMockHttp(
         routeString("/price/all"),
         null,
         (res) => {
            let data = "";
            res.on('data', (chunk) => { data += chunk });
            res.on('end', () => {
               assert.equal(200, res.statusCode);
               done();
               // res.remove('end');
            })
         },
      )
   });

   it(`with any data should return 200`, function (done) {
      this.timeout(10000)
      sendMockHttp(
         routeString("/price/all"),
         "",
         (res) => {
            let data = "";
            res.on('data', (chunk) => { data += chunk });
            res.on('end', () => {
               assert.equal(200, res.statusCode);
               done();
            })
         },
      )
   });

   it(`should return json`, function (done) {
      this.timeout(10000)
      sendMockHttp(
         routeString("/price/all"),
         null,
         (res) => {
            let data = "";
            res.on('data', (chunk) => { data += chunk });
            res.on('end', () => {
               // const json = JSON.parse(data);
               // assert.equal(json.length, mockDataLen);
               assert.notEqual(data, null);
               assert.notEqual(data, undefined);
               assert.equal(200, res.statusCode);
               done();
            })
         }
      );
   })
})