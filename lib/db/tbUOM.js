const { dbAll, dbRun, dbQuotes } = require("../db");
const { isDefined } = require("../utils");

class TbUOM{
   static tableName = "uom";
   static keyAbbr = "abbr";
   static keyIsBase = "is_base";
   static keyRefBase = "ref_base";
   static keyConversion = "conversion";
   static keyDesc = "desc";

   static primaryKeyColumns() {
      return [this.keyAbbr];
   }

   static requiredColumns(withPK = false) {
      let tmp = [
         this.keyIsBase,
         this.keyConversion
      ];
      return withPK? this.primaryKeyColumns().concat(tmp) : tmp;
   }

   static allColumns(withPK = true) {
      let tmp = [this.keyRefBase, this.keyDesc];
      if (withPK){
         return this.primaryKeyColumns().concat(this.requiredColumns()).concat(tmp);
      }
      return this.requiredColumns().concat(tmp);
   }

   /**
    * fetch all rows data from database
    * @param {err | rows} callback - db error or rows result
    */
   static all(callback){
      const sqlStmt = `SELECT * FROM ${this.tableName} order by abbr asc;`
      dbAll(sqlStmt, (err, rows)=>{
         if (err) callback(err);
         else callback(rows);
      });
   }

   /**
    * fetch all rows data from database
    * @returns db error or rows result
    */
   static allSync(){
      return new Promise(resolve=>{
         TbUOM.all(result=>{
            resolve(result);
         })
      })
   }

   /**
    * insert single data to database
    * @param {Object} data - mdse data 
    * @param {Error | Object} callback - Db Error or Object{lastID, changes}
    * @see requiredColumns
    */
   static insert(data, callback){
      if (!isDefined(data)){
         data = {};
         for (var key of this.requiredColumns(false)){
            data[key] = null;
         }
      }

      let colStmt = [];
      let valStmt = [];
      for(var key of this.allColumns(true)){
         if (isDefined(data[key])){
            colStmt.push(`${key}`);
            valStmt.push(dbQuotes(data[key]));
         }
      }

      let sqlStmt = `INSERT INTO ${this.tableName} (?) VALUES (?);`;
      sqlStmt = sqlStmt.replace("?", colStmt.join(",")).replace("?", valStmt.join(","));
      dbRun(sqlStmt, function(err, rows){
         if (err) callback(err);
         else callback({lastID: this.lastID, changes: this.changes});
      });
   }

   /**
    * insert single rows to database
    * @param {Object} data - mdse data (@see requiredColumns)
    * @returns Db Error or Object{lastID, changes}
    */
   static insertSync(data){
      return new Promise(resolve=>{
         TbUOM.insert(data, result=>{
            resolve(result);
         })
      });
   }

   /**
    * 
    * @param {Object} data 
    * @param {Error | Object} callback - Db Error or Object{lastID, changes}
    * @see requiredColumns
    * @see primaryKeyColumns
    */
   static update(data, callback){
      let sqlStmt = `UPDATE ${this.tableName} SET ? WHERE ?;`;
      let setStmt = [];
      let whereStmt = [];

      // make set
      for (var key of this.allColumns(false)){
         if (isDefined(data[key])){
            setStmt.push(`[${key}]=${dbQuotes(data[key])}`);
         }
      }

      // make where
      for (var key of this.primaryKeyColumns()){
         if (isDefined(data[key])){
            whereStmt.push(`${key}=${dbQuotes(data[key])}`);
         }
      }

      sqlStmt = sqlStmt.replace("?", setStmt.join(", "))
                        .replace("?", whereStmt.join(" AND "));
      // console.log(sqlStmt);
      dbRun(sqlStmt, function(err, rows){
         if (err) callback(err);
         else callback({lastID: this.lastID, changes: this.changes});
      });
   }
   
   static updateSync(data){
      return new Promise(resolve=>{
         TbUOM.update(data, result=>{
            resolve(result);
         });
      });
   }
   
}

module.exports = TbUOM;