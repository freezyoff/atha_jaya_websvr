const assert = require('assert');
const { routeString, sendMockHttpSync } = require('./../../httpMock.js');
const TbMdse = require('../../../lib/db/tbMdse.js');
const Crypto = require('crypto');

let mdseList = [];

describe("/update", () => {

   before(async function () {
      mdseList = await TbMdse.allSync();
   });

   it(`with no data should return 417`, function (done) {
      sendMockHttpSync(routeString("/mdse/update"), null).then(http => {
         assert.equal(417, http.response.statusCode);
         done();
      });
   });

   it(`with incomplete data should return 417`, function (done) {
      sendMockHttpSync(routeString("/mdse/update"), { 'group': 'aaa' }).then(http => {
         assert.equal(417, http.response.statusCode);
         done();
      });
   });

   it(`with complete data should return 200 & json data`, function (done) {
      let tmp = mdseList[Crypto.randomInt(0, mdseList.length-1)];
      tmp[TbMdse.keyName] = Crypto.randomBytes(5).toString('hex');
      sendMockHttpSync(routeString("/mdse/update"), tmp).then(http => {
         const json = JSON.parse(http.responseData);
         assert.deepEqual(tmp, json);
         assert.equal(200, http.response.statusCode);
         done();
      });
   });
})
