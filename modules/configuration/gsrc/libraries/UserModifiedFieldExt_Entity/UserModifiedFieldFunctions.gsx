package libraries.UserModifiedFieldExt_Entity

enhancement UserModifiedFieldFunctions : entity.UserModifiedFieldExt {
  // 1/24/2011 - zjthomas - Defect 3602, Checks to see if the modified field is a CMS field.
  function isCMSUserModifiedField():Boolean{
    if(this.ModifiedFieldNamesExt=="dateofbirth" or this.ModifiedFieldNamesExt =="dateofdeath" or this.ModifiedFieldNamesExt=="gender" or this.ModifiedFieldNamesExt=="taxid" or
       this.ModifiedFieldNamesExt=="taxstatus" or this.ModifiedFieldNamesExt=="hicn" or this.ModifiedFieldNamesExt=="medicareeligibleflag" or
       this.ModifiedFieldNamesExt=="sendpartytocmsflag" or this.ModifiedFieldNamesExt=="legalfirstname" or this.ModifiedFieldNamesExt=="legallastname" or
       this.ModifiedFieldNamesExt=="legalmiddlename" or this.ModifiedFieldNamesExt=="stopquerytocmsflag"){
         return true;
    }else{
      return false;
    }  
  }
}
