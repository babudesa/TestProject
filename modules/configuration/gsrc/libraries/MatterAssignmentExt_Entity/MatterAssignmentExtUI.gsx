package libraries.MatterAssignmentExt_Entity

uses gw.api.address.CCAddressOwner
uses gw.api.address.CounselContactAddressOwner
uses gw.api.address.CounselBillingAddressOwner
uses libraries.MattersUI.AssignmentUIHelper

/*
*  MatterAssignmentExtUI enchancement functions & properties are used by
*  UI screens needing custom funcitonality related to matter assignments
*  Used primarily by MatterDetailsDV.pcf
*/
enhancement MatterAssignmentExtUI : entity.MatterAssignmentExt {  
  
  property get CounselContactAddressOwner() : CCAddressOwner {
    return new CounselContactAddressOwner(this)
  }

  property get CounselBillingAddressOwner() : CCAddressOwner {
   var billingAddressOwner = new CounselBillingAddressOwner(this)
   
   //If there is an existing billing address then return that as the address to display
   if(exists(a in billingAddressOwner.Addresses where a.AddressType == AddressType.TC_BILLING)){
       billingAddressOwner.Address = this.CounselLawFirmExt.AllAddresses.where(\ a -> a.AddressType == AddressType.TC_BILLING).first()
   }
   return billingAddressOwner
  }

  /* Get the defaultAssignmentExpsoure from AssignemtnUiHelper.gs and adds to myUIHelper if only 1 exposure
  */
  property get UIHelper() : AssignmentUIHelper{
    var myUIHelper = new AssignmentUIHelper(this)
    var defaultAssignments = this.AssignmentExposuresExt.first()
      if(defaultAssignments.New and defaultAssignments.ClaimantExt == null and defaultAssignments.Exposure == null 
      and (defaultAssignments.PrimaryClaimantExt == null or defaultAssignments.PrimaryClaimantExt == false)){
        myUIHelper.defaultAssignmentExpsoure(defaultAssignments)
      }
    return myUIHelper;
  }
  
  property get AttorneyRatingHelper() : AttorneyRatingHelper {
     return new AttorneyRatingHelper(this)
  }
 
}

