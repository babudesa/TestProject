package libraries.Claim_Entity

enhancement VisibleFunction : entity.Claim {
  /*Using this function with visible property on pcf files to show or hide policy listviews
  depending on Loss Type /(LOB) in place of using the policytabset.contains...*/

  /*1/28/08 Agri Sprint 11, commented this out as we went back to using the PolicyTab method
  to display the policy tabs, specifically Drivers and Operators.  ER */
  //function setVisibletabs()  : boolean {
  //  if(this.LossType=="AGRIAUTO" || this.LossType=="AGRILIABILITY"){
  //     return true
  //    }
  //    else{
  //      return false
  //      }
  //}
}
