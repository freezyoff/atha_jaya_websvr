class TbMdse {
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
}

module.exports = TbMdse;