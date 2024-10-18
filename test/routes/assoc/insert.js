const assert = require('assert');
const {routeString, sendMockHttpSync} = require('./../../httpMock.js')
const TbAssoc = require('../../../lib/db/tbAssoc.js');
const Crypto = require('crypto');

describe("/insert", ()=>{
   
   it(`with no data should return 417`, function (done) {
      sendMockHttpSync(routeString("/assoc/insert"), null).then(http=>{
         assert.equal(417, http.response.statusCode);
         done();
      })
   });

   it(`with incomplete data should return 417`, function (done) {
      sendMockHttpSync(routeString("/assoc/insert"), null).then(http=>{
         assert.equal(417, http.response.statusCode);
         done();
      })
   });

   it(`with complete data should return 201 & json data`, function (done) {
      let tmp = {};
      tmp[TbAssoc.keyName] = Crypto.randomBytes(5).toString('hex');
      tmp[TbAssoc.keyAddrStreet] = Crypto.randomBytes(10).toString('hex');
      tmp[TbAssoc.keyAddrCity] = Crypto.randomBytes(5).toString('hex');
      tmp[TbAssoc.keyAddrProvince] = Crypto.randomBytes(5).toString('hex');
      tmp[TbAssoc.keyAddrZip] = Crypto.randomInt(10000, 1000000);
      tmp[TbAssoc.keyPhone] = Crypto.randomInt(10000000000, 1000000000000);
      tmp[TbAssoc.keySupplierFlag] = Crypto.randomInt(0, 1);
      tmp[TbAssoc.keyNpwpOrNik] = Crypto.randomInt(10000000000, 1000000000000);
      tmp[TbAssoc.keyPicName] = Crypto.randomBytes(5).toString('hex');
      tmp[TbAssoc.keyPicPhone] = Crypto.randomInt(10000000000, 1000000000000);
      sendMockHttpSync(routeString("/assoc/insert"), tmp).then(http=>{
         const json = JSON.parse(http.responseData);
         assert.notEqual(json.id, null);
         delete json[TbAssoc.keyId]; assert.deepEqual(json, tmp);
         assert.equal(201, http.response.statusCode);
         done();
      });
   });
})
