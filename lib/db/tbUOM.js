class TbUOM{
   static keyAbbr = "abbr";
   static keyIsBase = "is_base";
   static keyRefBase = "ref_base";
   static keyConverion = "converion";

   static primaryKeyColumns() {
      return [this.keyAbbr];
   }

   static requiredColumns() {
      return [
         this.keyIsBase,
         this.keyRefBase,
         this.keyConverion
      ];
   }

   static allColumns(withPK = true) {
      if (withPK){
         return this.primaryKeyColumns().concat(this.requiredColumns());
      }
      return this.requiredColumns();
   }
  
}

module.exports = TbUOM;