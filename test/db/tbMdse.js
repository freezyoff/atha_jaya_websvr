const assert = require('assert');
const { createMdseMockDataSync } = require('../dbMock');
const TbMdse = require('../../lib/db/tbMdse');
const { isDbError } = require('../../lib/db');
const Crypto = require('crypto');
const { isDefined } = require('../../lib/utils');

let mockDataLen = 5;
var mockData;
describe("class TbMdse", ()=>{

   before(async ()=>{
      mockData = await createMdseMockDataSync(mockDataLen);
   })

   it(`primaryKeyColumns()`, (done)=>{
      assert.equal(TbMdse.primaryKeyColumns().length, 1);
      assert.equal(TbMdse.primaryKeyColumns()[0], 'id');
      done();
   });

   it(`requiredColumns()`, (done)=>{
      const required = [
         TbMdse.keyGroup,
         TbMdse.keyName
      ];
      assert.equal(TbMdse.requiredColumns().length, required.length);
      assert.deepEqual(TbMdse.requiredColumns(), required);
      done();
   });

   it(`allColumns()`, (done)=>{
      const withPK = [
         TbMdse.keyId,
         TbMdse.keyGroup,
         TbMdse.keyName
      ];
      const withoutPK = [
         TbMdse.keyGroup,
         TbMdse.keyName
      ];
      assert.equal(TbMdse.allColumns().length, withPK.length);
      assert.deepEqual(TbMdse.allColumns(), withPK);
      assert.equal(TbMdse.allColumns(false).length, withoutPK.length);
      assert.deepEqual(TbMdse.allColumns(false), withoutPK);
      done();
   });

   it (`all()`, function(done){
      TbMdse.all(result=>{
         if (isDbError(result)) throw result;
         assert.equal(typeof result, 'object');
         assert.notEqual(0, result.length);
         done();
      });
   });

   it (`allSync()`, function(done){
      TbMdse.allSync().then(result=>{
         if (isDbError(result)) throw result;
         assert.equal(typeof result, 'object');
         assert.notEqual(0, result.length);
         done();
      });
   });

   describe(`insert()`, ()=>{
      it (`with complete required columns`, done=>{
         let tmp = {};
         tmp[TbMdse.keyName] = Crypto.randomBytes(4).toString('hex');
         tmp[TbMdse.keyGroup] = Crypto.randomBytes(4).toString('hex');
         mockData.push(tmp);
         TbMdse.insert(tmp, result=>{
            if (isDbError(result)) throw result;
            assert.equal(true, isDefined(result.lastID));
            assert.equal(true, isDefined(result.changes));
            done();
         })
      })

      it (`with incomplete required columns`, done=>{
         TbMdse.insert({}, result=>{
            assert.equal(true, isDbError(result));
            done();
         })
      })
   })


   describe(`insertSync()`, ()=>{

      it (`with complete required columns`, done=>{
         let tmp = {};
         tmp[TbMdse.keyName] = Crypto.randomBytes(4).toString('hex');
         tmp[TbMdse.keyGroup] = Crypto.randomBytes(4).toString('hex');
         mockData.push(tmp);
         TbMdse.insertSync(tmp).then(result=>{
            if (isDbError(result)) throw error;
            assert.equal(true, isDefined(result.lastID));
            assert.equal(true, isDefined(result.changes));
            done();
         })
      });

      it (`with incomplete required columns`, done=>{
         TbMdse.insert({}, result=>{
            assert.equal(true, isDbError(result));
            done();
         })
      })
   });
   
   describe("update()", ()=>{
      it (`with complete required columns`, done=>{
         let toUpdate = Object.assign({}, mockData[0]);
         toUpdate[TbMdse.keyName] = Crypto.randomBytes(4).toString('hex');
         toUpdate[TbMdse.keyGroup] = Crypto.randomBytes(4).toString('hex');
         TbMdse.update(toUpdate, result=>{
            if (isDbError(result)) throw error;
            assert.equal(1, result.changes);
            done();
         })
      });

      it (`with incomplete required columns`, done=>{
         let toUpdate = Object.assign({}, mockData[0]);
         toUpdate[TbMdse.keyName] = Crypto.randomBytes(4).toString('hex');
         toUpdate[TbMdse.keyGroup] = Crypto.randomBytes(4).toString('hex');
         delete toUpdate[TbMdse.keyId];
         TbMdse.update(toUpdate, result=>{
            assert.equal(true, isDbError(result));
            done();
         })
      });
   });

   describe(`updateSync()`, ()=>{
      it (`with complete required columns`, done=>{
         let toUpdate = Object.assign({}, mockData[1]);
         toUpdate[TbMdse.keyName] = Crypto.randomBytes(4).toString('hex');
         toUpdate[TbMdse.keyGroup] = Crypto.randomBytes(4).toString('hex');
         TbMdse.updateSync(toUpdate).then(result=>{
            if (isDbError(result)) throw error;
            assert.equal(1, result.changes);
            done();
         })
      })

      it (`with incomplete required columns`, done=>{
         let toUpdate = Object.assign({}, mockData[1]);
         toUpdate[TbMdse.keyName] = Crypto.randomBytes(4).toString('hex');
         toUpdate[TbMdse.keyGroup] = Crypto.randomBytes(4).toString('hex');
         delete toUpdate[TbMdse.keyId];
         TbMdse.updateSync(toUpdate).then(result=>{
            assert.equal(true, isDbError(result));
            done();
         })
      })
   });

});