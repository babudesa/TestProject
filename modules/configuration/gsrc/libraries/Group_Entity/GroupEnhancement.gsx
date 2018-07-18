package libraries.Group_Entity

enhancement GroupEnhancement : entity.Group {
  
/* this function was added in conjunction with defect 5206.  POL letters were not pulling in
the business address. This function is called in the FormFieldsEnterprise.xml, BusinessAddressLine1 and
BusinessAddressCityStateZip.
The function will traverse from the bottom up until it finds a Group Business Address. So if the claim
assignedgroup is PIM Dallas and does not find an address it will go to it's parent, then up again until
it finds an address.  At this time all business addresses are found on group type of Claims Business Unit.
author: erawe
date: 3/8/12
*/
  function getBusinessAddress():Address {
    
    var grp : Group = this
    var addressFound : boolean = false
    while (not addressFound && grp != grp.RootGroup) {
      if(grp.GroupAddressExt!=null) {
        addressFound = true
      }
      else{
        grp = grp.Parent
      }
    }
    return grp.GroupAddressExt
  }
   
}
