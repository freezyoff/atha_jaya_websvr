const assert = require('assert');
const { routeString, sendMockHttpSync } = require('./../../httpMock.js')
const TbAssoc = require('../../../lib/db/tbAssoc.js');
const Crypto = require('crypto');

let assocList = [];

describe("/update", () => {

   before(async function () {
      assocList = await TbAssoc.allSync();
   });

   it(`with no data should return 417`, function (done) {
      sendMockHttpSync(routeString("/assoc/update"), null).then(http=>{
         assert.equal(417, http.response.statusCode);
         done();
      })
   });

   it(`with incomplete data should return 417`, function (done) {
      sendMockHttpSync(routeString("/assoc/update"), {}).then(http=>{
         assert.equal(417, http.response.statusCode);
         done();
      })
   });

   it(`with complete data should return 200 & json data`, function (done) {
      const tmp = assocList[Crypto.randomInt(0, assocList.length-1)];
      tmp[TbAssoc.keyName] = Crypto.randomBytes(10).toString('hex');
      tmp[TbAssoc.keyAddrStreet] = Crypto.randomBytes(50).toString('hex');
      tmp[TbAssoc.keyAddrCity] = Crypto.randomBytes(10).toString('hex');
      tmp[TbAssoc.keyAddrProvince] = Crypto.randomBytes(10).toString('hex');
      tmp[TbAssoc.keyAddrZip] = Crypto.randomInt(1000, 10000);
      tmp[TbAssoc.keyPhone] = Crypto.randomInt(1000000, 1000000000000);
      tmp[TbAssoc.keySupplierFlag] = Crypto.randomInt(0, 1);
      tmp[TbAssoc.keyNpwpOrNik] = Crypto.randomInt(1000000, 1000000000000);
      tmp[TbAssoc.keyPicName] = Crypto.randomBytes(10).toString('hex');
      tmp[TbAssoc.keyPicPhone] = Crypto.randomInt(1000000, 1000000000000);
      sendMockHttpSync(routeString("/assoc/update"), tmp).then(http=>{
         const json = JSON.parse(http.responseData);
         assert.deepEqual(json, tmp);
         assert.equal(200, http.response.statusCode);
         done();
      })

   });
})
