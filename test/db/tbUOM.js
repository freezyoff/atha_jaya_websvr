const assert = require('assert');
const {TbUOM} = require('./../../lib/db.js');

describe("class TbUOM", ()=>{

   it(`primary keys`, (done)=>{
      assert.equal(TbUOM.primaryKeyColumns().length, 1);
      assert.equal(TbUOM.primaryKeyColumns()[0], TbUOM.keyAbbr);
      done();
   });

   it(`required columns`, (done)=>{
      const required = [
         TbUOM.keyIsBase,
         TbUOM.keyRefBase,
         TbUOM.keyConverion,
      ];
      assert.equal(TbUOM.requiredColumns().length, required.length);
      assert.deepEqual(TbUOM.requiredColumns(), required);
      done();
   });

   it(`all columns`, (done)=>{
      const withPK = [
         TbUOM.keyAbbr,
         TbUOM.keyIsBase,
         TbUOM.keyRefBase,
         TbUOM.keyConverion,
      ];
      const withoutPK = [
         TbUOM.keyIsBase,
         TbUOM.keyRefBase,
         TbUOM.keyConverion,
      ]
      assert.equal(TbUOM.allColumns(true).length, withPK.length);
      assert.deepEqual(TbUOM.allColumns(true), withPK);
      assert.equal(TbUOM.allColumns(false).length, withoutPK.length);
      assert.deepEqual(TbUOM.allColumns(false), withoutPK);
      done();
   });

});