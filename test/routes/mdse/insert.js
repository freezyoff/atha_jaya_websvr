const assert = require('assert');
const {routeString, sendMockHttpSync} = require('./../../httpMock.js')
const Crypto = require('crypto');
const TbMdse = require('../../../lib/db/tbMdse.js');

describe("/insert", ()=>{

   it(`with no data should return 417`, function (done) {
      sendMockHttpSync(routeString("/mdse/insert"), null).then(http =>{
         assert.equal(417, http.response.statusCode);
         done();
      })
   });

   it(`with incomplete data should return 417`, function (done) {
      sendMockHttpSync(routeString("/mdse/insert"), null).then(http =>{
         assert.equal(417, http.response.statusCode);
         done();
      })
   });

   it(`with complete data should return 201 & json data`, function (done) {
      let tmp = {};
      tmp[TbMdse.keyName] = Crypto.randomBytes(4).toString('hex');
      tmp[TbMdse.keyGroup] = Crypto.randomBytes(4).toString('hex');
      sendMockHttpSync(routeString("/mdse/insert"), tmp).then(http=>{
         const json = JSON.parse(http.responseData);
         assert.notEqual(json.id, null);
         assert.notEqual(json.name, null);
         assert.notEqual(json.group, null);
         assert.equal(json[TbMdse.keyName], tmp[TbMdse.keyName]);
         assert.equal(json[TbMdse.keyGroup], tmp[TbMdse.keyGroup]);
         assert.equal(201, http.response.statusCode);
         done();
      })
   });
})
