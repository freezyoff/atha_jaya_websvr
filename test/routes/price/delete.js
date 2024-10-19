const assert = require('assert');
const { routeString, sendMockHttpSync } = require('./../../httpMock.js');
const Crypto = require('crypto');
const TbPrice = require('../../../lib/db/tbPrice.js');

let priceList = [];

describe(`/delete`, () => {

   before(async () => {
      priceList = await TbPrice.latestPricesSync();
   });

   it(`with no data should return 417`, function (done) {
      sendMockHttpSync(routeString("/price/delete"), null).then(http => {
         assert.equal(417, http.response.statusCode);
         done();
      });
   });

   it(`with any data should return 200`, function (done) {
      sendMockHttpSync(routeString("/price/delete"), {}).then(http => {
         assert.equal(417, http.response.statusCode);
         done();
      });
   });

   it(`with complete data should return 200 & json data`, function (done) {
      let priceRef = priceList[Crypto.randomInt(0, priceList.length - 1)];
      sendMockHttpSync(routeString("/price/delete"), priceRef).then(http => {
         const json = JSON.parse(http.responseData);
         assert.notEqual(json, null);
         assert.notEqual(json, undefined);
         assert.equal(200, http.response.statusCode);
         done();
      });
   })
})