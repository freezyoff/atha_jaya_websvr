const assert = require('assert');
const {TbAssoc} = require('./../../lib/db');

describe("class TbAssoc", ()=>{

   it(`primary keys`, (done)=>{
      assert.equal(TbAssoc.primaryKeyColumns().length, 1);
      assert.equal(TbAssoc.primaryKeyColumns()[0], 'id');
      done();
   });

   it(`required columns`, (done)=>{
      const required = [
         TbAssoc.keyName,
         TbAssoc.keyAddrStreet,
         TbAssoc.keyAddrCity,
         TbAssoc.keyAddrProvince,
         TbAssoc.keyAddrZip,
         TbAssoc.keyPhone
      ];
      assert.equal(TbAssoc.requiredColumns().length, required.length);
      assert.deepEqual(TbAssoc.requiredColumns(), required);
      done();
   });

   it(`all columns`, (done)=>{
      const withPK = [
         TbAssoc.keyId,
         TbAssoc.keyName,
         TbAssoc.keyAddrStreet,
         TbAssoc.keyAddrCity,
         TbAssoc.keyAddrProvince,
         TbAssoc.keyAddrZip,
         TbAssoc.keyPhone,
         TbAssoc.keySupplierFlag,
         TbAssoc.keyNpwpOrNik,
         TbAssoc.keyPicName,
         TbAssoc.keyPicPhone
      ];
      const withoutPK = [
         TbAssoc.keyName,
         TbAssoc.keyAddrStreet,
         TbAssoc.keyAddrCity,
         TbAssoc.keyAddrProvince,
         TbAssoc.keyAddrZip,
         TbAssoc.keyPhone,
         TbAssoc.keySupplierFlag,
         TbAssoc.keyNpwpOrNik,
         TbAssoc.keyPicName,
         TbAssoc.keyPicPhone
      ]
      assert.equal(TbAssoc.allColumns(true).length, withPK.length);
      assert.deepEqual(TbAssoc.allColumns(true), withPK);
      assert.equal(TbAssoc.allColumns(false).length, withoutPK.length);
      assert.deepEqual(TbAssoc.allColumns(false), withoutPK);
      done();
   });

});