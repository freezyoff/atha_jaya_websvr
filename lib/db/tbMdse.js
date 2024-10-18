const { dbRun, dbRunSync, dbQuotes, dbAll, isDbError} = require("../db");
const { isObject, isDefined } = require("../utils");

class TbMdse {
   static tableName = "mdse";
   static keyId = "id";
   static keyGroup = "group";
   static keyName = "name";

   static primaryKeyColumns() {
      return [this.keyId];
   }

   static requiredColumns(withPk = false) {
      var req = [
         this.keyGroup,
         this.keyName,
      ];
      return withPk? this.primaryKeyColumns().concat(req) : req;
   }

   static allColumns(withPK = true) {
      if (withPK){
         return this.primaryKeyColumns().concat(this.requiredColumns());
      }
      return this.requiredColumns();
   }

   /**
    * fetch all rows data from database
    * @param {err | rows} callback - db error or rows result
    */
   static all(callback){
      const sqlStmt = `SELECT * FROM mdse order by name asc;`
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
      return new Promise(function(resolve){
         TbMdse.all(function(result){
            resolve(result);
         });
      })
   }

   /**
    * insert single data to database
    * @param {Object} data - mdse data 
    * @param {Error | Object} callback - Db Error or Object{lastID, changes}
    * @see requiredColumns
    */
   static insert(data, callback){
      if (!isDefined(data) || !isObject(data)){
         data = {};
         for(var key of this.requiredColumns()){
            data[key] = null;
         }
      }

      let valStmt = [];
      for(var key of this.allColumns(false)){
         if (isDefined(data[key])){
            valStmt.push(dbQuotes(data[key]));
         }
      }

      let sqlStmt = `INSERT INTO ${this.tableName} ([${this.keyGroup}], ${this.keyName}) VALUES (?)`;
      sqlStmt = sqlStmt.replace("?", valStmt.join(","));
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
         this.insert(data, function(result){
            resolve(result)
         });
      });
   }

   /**
    * update single data of database
    * @param {Object} data - mdse data 
    * @param {Error | Object} callback - Db Error or Object{lastID, changes}
    * @see requiredColumns
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
      dbRun(sqlStmt, function(err, rows){
         if (err) callback(err);
         else callback({lastID: this.lastID, changes: this.changes});
      });
   }

   static updateSync(data){
      return new Promise(resolve=>{
         this.update(data, function(result){
            resolve(result)
         });
      });
   }


}

module.exports = TbMdse;