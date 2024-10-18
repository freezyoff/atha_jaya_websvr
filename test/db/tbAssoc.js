const assert = require('assert');
const TbAssoc = require('../../lib/db/tbAssoc');
const { createAssocMockDataSync } = require('../dbMock');
const { isDbError } = require('../../lib/db');
const Crypto = require('crypto');

let mockDataLen = 5;
let mockData = [];

function createMockData(){
   let item = {};
   item[TbAssoc.keyName] = Crypto.randomBytes(5).toString('hex');
   item[TbAssoc.keyAddrStreet] = Crypto.randomBytes(10).toString('hex');
   item[TbAssoc.keyAddrCity] = Crypto.randomBytes(5).toString('hex');
   item[TbAssoc.keyAddrProvince] = Crypto.randomBytes(5).toString('hex');
   item[TbAssoc.keyAddrZip] = Crypto.randomInt(10000, 1000000);
   item[TbAssoc.keyPhone] = Crypto.randomInt(10000000000, 1000000000000);
   item[TbAssoc.keySupplierFlag] = Crypto.randomInt(0, 1);
   item[TbAssoc.keyNpwpOrNik] = Crypto.randomInt(10000000000, 1000000000000);
   item[TbAssoc.keyPicName] = Crypto.randomBytes(5).toString('hex');
   item[TbAssoc.keyPicPhone] = Crypto.randomInt(10000000000, 1000000000000);
   return item;
}

describe("class TbAssoc", ()=>{

   before(async ()=>{
      mockData = await createAssocMockDataSync(mockDataLen);
   })

   it(`primaryKeyColumns`, (done)=>{
      assert.equal(TbAssoc.primaryKeyColumns().length, 1);
      assert.equal(TbAssoc.primaryKeyColumns()[0], 'id');
      done();
   });

   it(`requiredColumns()`, (done)=>{
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

   it(`allColumns()`, (done)=>{
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

   it (`all()`, done=>{
      TbAssoc.all(result=>{
         if (isDbError(result)) throw result;
         assert.equal(typeof result, 'object');
         assert.notEqual(0, result.length);
         done();
      });
   });

   it (`allSync()`, done=>{
      TbAssoc.allSync().then(result=>{
         if (isDbError(result)) throw result;
         assert.equal(typeof result, 'object');
         assert.notEqual(0, result.length);
         done();
      });
   });

   describe(`insert()`, ()=>{
      it (`with complete required columns`, done=>{
         let item = createMockData();
         mockData.push(item);
         TbAssoc.insert(item,result=>{
            if (isDbError(result)) throw result;
            assert.notEqual(0, result.lastID);
            assert.notEqual(null, result.lastID);
            assert.notEqual(undefined, result.lastID);
            assert.equal(1, result.changes);
            done();
         })
      });

      it (`with incomplete required columns`, done=>{
         item={};
         TbAssoc.insert(item, result=>{
            assert.equal(true, isDbError(result));
            done();
         })
      });
   });

   describe(`insertSync()`, ()=>{
      it (`insertSync()`, done=>{
         let item = createMockData();
         mockData.push(item);
         TbAssoc.insertSync(item).then(result=>{
            if (isDbError(result)) throw result;
            assert.notEqual(0, result.lastID);
            assert.notEqual(null, result.lastID);
            assert.notEqual(undefined, result.lastID);
            assert.equal(1, result.changes);
            done();
         })
      });

      it (`with incomplete required columns`, done=>{
         item={};
         TbAssoc.insert(item, result=>{
            assert.equal(true, isDbError(result));
            done();
         })
      });

   });

   describe(`update`, ()=>{
      it (`with complete required data`, done=>{
         let item = Object.assign({}, mockData[0]);
         TbAssoc.update(item, result=>{
            if (isDbError(result)) throw result;
            assert.equal(1, result.changes);
            done();
         });
      });

      it (`with incomplete required data`, done=>{
         let item = Object.assign({}, mockData[0]);
         delete item[TbAssoc.keyId];
         TbAssoc.update(item, result=>{
            assert.equal(true, isDbError(result));
            done();
         });
      });
   });

});