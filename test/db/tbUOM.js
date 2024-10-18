const assert = require('assert');
const TbUOM = require('../../lib/db/tbUOM');
const { isDbError } = require('../../lib/db');
const Crypto = require('crypto');
const { isDefined } = require('../../lib/utils');

let uomList = [];

describe("class TbUOM", ()=>{

   before(async ()=>{
      uomList = await TbUOM.allSync();
   })

   it(`primaryKeyColumns()`, (done)=>{
      assert.equal(TbUOM.primaryKeyColumns().length, 1);
      assert.equal(TbUOM.primaryKeyColumns()[0], TbUOM.keyAbbr);
      done();
   });

   it(`requiredColumns()`, (done)=>{
      const required = [
         TbUOM.keyIsBase,
         TbUOM.keyConversion,
      ];
      assert.equal(TbUOM.requiredColumns().length, required.length);
      assert.deepEqual(TbUOM.requiredColumns(), required);
      done();
   });

   it(`allColumns()`, (done)=>{
      const withPK = [
         TbUOM.keyAbbr,
         TbUOM.keyIsBase,
         TbUOM.keyConversion,
         TbUOM.keyRefBase,
         TbUOM.keyDesc
      ];
      const withoutPK = [
         TbUOM.keyIsBase,
         TbUOM.keyConversion,
         TbUOM.keyRefBase,
         TbUOM.keyDesc
      ]
      assert.equal(TbUOM.allColumns(true).length, withPK.length);
      assert.deepEqual(TbUOM.allColumns(true), withPK);
      assert.equal(TbUOM.allColumns(false).length, withoutPK.length);
      assert.deepEqual(TbUOM.allColumns(false), withoutPK);
      done();
   });

   it (`all()`, done=>{
      TbUOM.all(result=>{
         if (isDbError(result)) throw result;
         assert.equal(typeof result, 'object');
         assert.equal(false, isDbError(result));
         done();
      })
   });

   it (`allSync()`, done=>{
      TbUOM.allSync().then(result=>{
         if (isDbError(result)) throw result;
         assert.equal(typeof result, 'object');
         assert.equal(false, isDbError(result));
         done();
      })
   });

   describe("insert()", ()=>{

      it (`with complete required columns`, done=>{
         let refBaseObj = uomList[Crypto.randomInt(0, uomList.length-1)];
         let item = {};
         item[TbUOM.keyAbbr] = Crypto.randomBytes(2).toString('hex');
         item[TbUOM.keyIsBase] = Crypto.randomInt(0, 1);
         item[TbUOM.keyRefBase] = refBaseObj[TbUOM.keyAbbr];
         item[TbUOM.keyConversion] = Crypto.randomBytes(5).toString('hex');
         uomList.push(item);
         
         TbUOM.insert(item, result=>{
            if (isDbError(result)) throw result;
            assert.equal(true, isDefined(result.lastID));
            assert.equal(true, isDefined(result.changes));
            done();
         });
      });

      it (`with incomplete required columns`, done=>{
         let refBaseObj = uomList[Crypto.randomInt(0, uomList.length-1)];
         let item = {};
         // item[TbUOM.keyAbbr] = Crypto.randomBytes(2).toString('hex');
         item[TbUOM.keyIsBase] = Crypto.randomInt(0, 1);
         item[TbUOM.keyRefBase] = refBaseObj[TbUOM.keyAbbr];
         item[TbUOM.keyConversion] = Crypto.randomBytes(5).toString('hex');
         TbUOM.insert(item, result=>{
            assert.equal(true, isDbError(result));
            done();
         });
      });

   })

   describe("insertSync()", ()=>{

      it (`with complete required columns`, done=>{
         let refBaseObj = uomList[Crypto.randomInt(0, uomList.length-1)];
         let item = {};
         item[TbUOM.keyAbbr] = Crypto.randomBytes(2).toString('hex');
         item[TbUOM.keyIsBase] = Crypto.randomInt(0, 1);
         item[TbUOM.keyRefBase] = refBaseObj[TbUOM.keyAbbr];
         item[TbUOM.keyConversion] = Crypto.randomBytes(5).toString('hex');
         uomList.push(item);
         
         TbUOM.insertSync(item).then(result=>{
            if (isDbError(result)) throw result;
            assert.equal(true, isDefined(result.lastID));
            assert.equal(true, isDefined(result.changes));
            done();
         });
      });

      it (`with incomplete required columns`, done=>{
         let refBaseObj = uomList[Crypto.randomInt(0, uomList.length-1)];
         let item = {};
         // item[TbUOM.keyAbbr] = Crypto.randomBytes(2).toString('hex');
         item[TbUOM.keyIsBase] = Crypto.randomInt(0, 1);
         item[TbUOM.keyRefBase] = refBaseObj[TbUOM.keyAbbr];
         item[TbUOM.keyConversion] = Crypto.randomBytes(5).toString('hex');
         TbUOM.insertSync(item).then(result=>{
            assert.equal(true, isDbError(result));
            done();
         });
      });

   })


   describe("update()", ()=>{

      it (`with complete required columns`, done=>{
         let refBaseObj = uomList[Crypto.randomInt(0, uomList.length-1)];
         let item = Object.assign({}, uomList[Crypto.randomInt(0, uomList.length-1-2)]);
         item[TbUOM.keyAbbr] = Crypto.randomBytes(2).toString('hex');
         item[TbUOM.keyIsBase] = Crypto.randomInt(0, 1);
         item[TbUOM.keyRefBase] = refBaseObj[TbUOM.keyAbbr];
         item[TbUOM.keyConversion] = Crypto.randomBytes(5).toString('hex');
         
         TbUOM.update(item, result=>{
            if (isDbError(result)) throw result;
            assert.equal(true, isDefined(result.lastID));
            assert.equal(true, isDefined(result.changes));
            done();
         });
      });

      it (`with incomplete required columns`, done=>{
         let refBaseObj = uomList[Crypto.randomInt(0, uomList.length-1)];
         let item = Object.assign({}, uomList[Crypto.randomInt(0, uomList.length-1-2)]);
         delete item[TbUOM.keyAbbr];
         item[TbUOM.keyIsBase] = Crypto.randomInt(0, 1);
         item[TbUOM.keyRefBase] = refBaseObj[TbUOM.keyAbbr];
         item[TbUOM.keyConversion] = Crypto.randomBytes(5).toString('hex');
         TbUOM.update(item, result=>{
            assert.equal(true, isDbError(result));
            done();
         });
      });

   })

   describe("updateSync()", ()=>{

      it (`with complete required columns`, done=>{
         let refBaseObj = uomList[Crypto.randomInt(0, uomList.length-1)];
         let item = Object.assign({}, uomList[Crypto.randomInt(0, uomList.length-1-2)]);
         item[TbUOM.keyAbbr] = Crypto.randomBytes(2).toString('hex');
         item[TbUOM.keyIsBase] = Crypto.randomInt(0, 1);
         item[TbUOM.keyRefBase] = refBaseObj[TbUOM.keyAbbr];
         item[TbUOM.keyConversion] = Crypto.randomBytes(5).toString('hex');
         
         TbUOM.updateSync(item).then(result=>{
            if (isDbError(result)) throw result;
            assert.equal(true, isDefined(result.lastID));
            assert.equal(true, isDefined(result.changes));
            done();
         });
      });

      it (`with incomplete required columns`, done=>{
         let refBaseObj = uomList[Crypto.randomInt(0, uomList.length-1)];
         let item = Object.assign({}, uomList[Crypto.randomInt(0, uomList.length-1-2)]);
         delete item[TbUOM.keyAbbr];
         item[TbUOM.keyIsBase] = Crypto.randomInt(0, 1);
         item[TbUOM.keyRefBase] = refBaseObj[TbUOM.keyAbbr];
         item[TbUOM.keyConversion] = Crypto.randomBytes(5).toString('hex');
         TbUOM.updateSync(item).then(result=>{
            assert.equal(true, isDbError(result));
            done();
         });
      });

   })

});