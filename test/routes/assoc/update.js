const assert = require('assert');
const { Server } = require('./../../../lib/http.js');
const { sendMockHttp, routeString } = require('./../../httpMock.js')
const { dbRun, TbAssoc, dbQuotes } = require('./../../../lib/db.js');

function createMockData(howMany) {
   let sql = `INSERT INTO assoc (${TbAssoc.allColumns(false).join(",")}) VALUES ?;`;
   let values = [];
   for (var i = 0; i < howMany; i++) {
      let mocking = [
         dbQuotes(`name ${i}`),
         dbQuotes(`street ${i}`),
         dbQuotes(`city ${i}`),
         dbQuotes(`province ${i}`),
         dbQuotes(1234567890),
         dbQuotes(1234567890),
         dbQuotes(Math.round(Math.random())),
         dbQuotes(1234567890),
         dbQuotes(`pic name ${i}`),
         dbQuotes(1234567890)
      ];
      values.push(`(${mocking.join(",")})`);
   }
   sql = sql.replace("?", values.join(","));
   dbRun(sql);
}

function clearMockData() {
   dbRun(`DELETE FROM assoc`);
   dbRun(`delete from sqlite_sequence where name='assoc';`);
}

const mockDataLen = 5;

describe("/update", () => {

   before(function () {
      createMockData(mockDataLen)
      Server.listen();
   });

   after(function () {
      Server.stop();
      clearMockData();
   });

   it(`with no data should return 417`, function (done) {
      sendMockHttp(
         routeString("/assoc/update"),
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

   it(`with incomplete data should return 417`, function (done) {
      sendMockHttp(
         routeString("/assoc/update"),
         JSON.stringify({ 'group': 'aaa' }),
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
      this.timeout(10000);
      const mockNumber = 999999999;
      let mockData = {};
      mockData[TbAssoc.keyId] = 3;
      mockData[TbAssoc.keyName] = 'new name';
      mockData[TbAssoc.keyAddrStreet] = "new street";
      mockData[TbAssoc.keyAddrCity] = "new city";
      mockData[TbAssoc.keyAddrProvince] = "new province";
      mockData[TbAssoc.keyAddrZip] = mockNumber;
      mockData[TbAssoc.keyPhone] = mockNumber;
      mockData[TbAssoc.keySupplierFlag] = 1;
      mockData[TbAssoc.keyNpwpOrNik] = mockNumber;
      mockData[TbAssoc.keyPicName] = "new pic name";
      mockData[TbAssoc.keyPicPhone] = mockNumber;

      sendMockHttp(
         routeString("/assoc/update"),
         JSON.stringify(mockData),
         (res) => {
            let data = "";
            res.on('data', (chunk) => { data += chunk });
            res.on('end', () => {
               const json = JSON.parse(data);
               assert.equal(json[TbAssoc.keyId], mockData[TbAssoc.keyId]);
               assert.equal(json[TbAssoc.keyName], mockData[TbAssoc.keyName]);
               assert.equal(json[TbAssoc.keyAddrStreet], mockData[TbAssoc.keyAddrStreet]);
               assert.equal(json[TbAssoc.keyAddrProvince], mockData[TbAssoc.keyAddrProvince]);
               assert.equal(json[TbAssoc.keyAddrZip], mockData[TbAssoc.keyAddrZip]);
               assert.equal(json[TbAssoc.keyPhone], mockData[TbAssoc.keyPhone]);
               assert.equal(json[TbAssoc.keySupplierFlag], mockData[TbAssoc.keySupplierFlag]);
               assert.equal(json[TbAssoc.keyNpwpOrNik], mockData[TbAssoc.keyNpwpOrNik]);
               assert.equal(json[TbAssoc.keyPicName], mockData[TbAssoc.keyPicName]);
               assert.equal(json[TbAssoc.keyPicPhone], mockData[TbAssoc.keyPicPhone]);
               assert.equal(200, res.statusCode);
               done();
            })
         },
         (err) => {
            console.log(err);
         },
      )
   });
})
