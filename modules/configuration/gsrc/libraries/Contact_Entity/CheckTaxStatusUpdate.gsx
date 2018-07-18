package libraries.Contact_Entity

enhancement CheckTaxStatusUpdate : entity.Contact {
  // Used to check if the tax status is b or t and allow only compliance and accounting to change 
  // used in PersonAdditionalInfoInputSet

  function checkContactTaxStatusUpdate(): String {
    if (exists(field in this.ChangedFields where field== "Ex_TaxStatusCode")) {
      if (this.Ex_TaxStatusCode == typekey.TaxStatusCode.TC_T or this.Ex_TaxStatusCode == typekey.TaxStatusCode.TC_B or this.Ex_TaxStatusCode == typekey.TaxStatusCode.TC_9) {
        for (role in User.util.getCurrentUser().Roles) {
          if ( role.Role ==Role( "compliance_account")) {
            return null          
          }
        }
        return ("Must have a role of Compliance Accounting to update/change Tax Status Code to B, T or 9.")            
      }
    }         
    return null
  }

//2/24/10 - defect 3081 erawe: Used to make Tax id required
  function checkContactTaxStatus(): boolean{
     if(this.Ex_TaxStatusCode==null or this.Ex_TaxStatusCode == typekey.TaxStatusCode.TC_1){
       return false
     } else {
       return true
     }
   }
 
  //2/24/10 - defect 3081 erawe: Used to make Tax Status require
  function checkContactTaxID(): boolean{
    if(this.TaxID==null){
      return false
    } else {
      return true
    }
  }
}
