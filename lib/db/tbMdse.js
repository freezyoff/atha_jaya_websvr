class TbMdse {
   static keyId = "id";
   static keyGroup = "group";
   static keyName = "name";
   static keyWeight = "weight";

   static primaryKeyColumns() {
      return [this.keyId];
   }

   static requiredColumns() {
      return [
         this.keyGroup,
         this.keyName,
         // this.keyWeight
      ];
   }

   static allColumns(withPK = true) {
      if (withPK){
         return this.primaryKeyColumns().concat(this.requiredColumns());
      }
      return this.requiredColumns();
   }
}

module.exports = TbMdse;