package gaic.import.bill.single
uses entity.BillImportRecordExt
uses typekey.CheckCategoryExt
uses java.lang.String
uses gaic.import.bill.single.SingleBillImporter
uses soap.CustomABContactSearch.api.CustomContactSearchAPI
uses gw.api.soap.GWAuthenticationHandler




class MitchellSingleBillImporter extends SingleBillImporter {
  
  private static final var MITCHELL_MCO_ROLE = "MitchellMCORole"
  private static final var MITCHELL_DOC_ROLE = "MitchellDocRole"
  
  construct(bill : BillImportRecordExt) {
    super(bill)
  }
    
  override property get VendorMCONamespace() : String {
    return MITCHELL_MCO_ROLE
  }

  override property get VendorDocNamespace() : String {
    return MITCHELL_DOC_ROLE
  }
  
  override property get CheckCategory() : CheckCategoryExt {
    return CheckCategoryExt.TC_MITCHELL 
  }
  
  /**
   * Overide so that delivery details can be set differently only for Mitchell, if required.
   */
  override function setDeliveryDetails(){
    
    if(_claim.JurisdictionState == State.TC_NC){
      _check.DeliveryMethod = DeliveryMethod.TC_HOLD
      _check.ex_MailTo = _claim.AssignedUser.Contact
      _check.ex_MailToAddress = _claim.AssignedUser.Contact.AllAddresses.where(\ a -> a.AddressType == AddressType.TC_BUSINESS).first()
      _check.MailTo = _check.ex_MailTo.DisplayName
    }else{
      super.setDeliveryDetails() 
    }
  }
  
  /**
   * Get mailing address will take the address public ID from the 
   * passed in from the mitchell file
   */
  override function getMailToAddress() : Address {
    var matchingAddress : Address = null
    var ccAddressesToCompare = _payeeContact.Contact.AllAddresses
    var addressAbID : int = null
  
      //Defect # 9124    
     //If there is a billing address on the contact addresses then use the billing address
    //otherwise find the mailing address from the address public ID Mitchell is sending
    //back to us in the file.
    if(ccAddressesToCompare.hasMatch(\ a -> a.AddressType == AddressType.TC_BILLING)){
        if((ccAddressesToCompare.where(\ a -> a.AddressType == AddressType.TC_BILLING).Count)==1){
        matchingAddress = ccAddressesToCompare.where(\ a -> a.AddressType == AddressType.TC_BILLING).first()
        }
        else{
          //External Provider ID set in ContactCenter
          addressAbID = (((_bill.MailToAddressAbID.split("-"))[1]).split(":"))[1] as int
          ccAddressesToCompare.each(\ addy -> 
          
          {
            var api = new CustomContactSearchAPI()
            api.addHandler(new GWAuthenticationHandler("su", "gw"))
            var abAddressToCompare = api.findAddressById(addressAbID)      
            if(addy.AddressType == AddressType.TC_BILLING && 
             String.valueOf(addy.AddressLine1) == String.valueOf(abAddressToCompare.AddressLine1) &&
             String.valueOf(addy.AddressLine2) == String.valueOf(abAddressToCompare.AddressLine2) &&
             String.valueOf(addy.AddressLine3) == String.valueOf(abAddressToCompare.AddressLine3) &&
             String.valueOf(addy.PostalCode) == String.valueOf(abAddressToCompare.PostalCode)) {
             matchingAddress = addy
          }}) 
        }
    } else{    
        if(_bill.MailToAddressAbID.countOccurrences("a")<2){
        addressAbID = (((_bill.MailToAddressAbID.split("-"))[1]).split(":"))[1] as int
        var api = new CustomContactSearchAPI()
        api.addHandler(new GWAuthenticationHandler("su", "gw"))
        var abAddressToCompare = api.findAddressById(addressAbID)        
    
        for(a in ccAddressesToCompare) {

          if(String.valueOf(a.AddressLine1) == String.valueOf(abAddressToCompare.AddressLine1) &&
             String.valueOf(a.AddressLine2) == String.valueOf(abAddressToCompare.AddressLine2) &&
             String.valueOf(a.AddressLine3) == String.valueOf(abAddressToCompare.AddressLine3) &&
             String.valueOf(a.PostalCode) == String.valueOf(abAddressToCompare.PostalCode)) {
              matchingAddress = a
              break
          }
    }    }
    }
    
    //if no match is found return a default based on the original logic now
    //this shouldn't happen its a fall back
    if(matchingAddress == null) {    
        if(ccAddressesToCompare.hasMatch(\ a -> a.AddressType == AddressType.TC_BILLING)){
        matchingAddress = ccAddressesToCompare.where(\ a -> a.AddressType == AddressType.TC_BILLING).first()
      }else if(ccAddressesToCompare.hasMatch(\ a -> a.AddressType == AddressType.TC_TAX)){
        matchingAddress = ccAddressesToCompare.where(\ a -> a.AddressType == AddressType.TC_TAX).first()
      }else{
        matchingAddress = ccAddressesToCompare.where(\ a -> a.AddressType == AddressType.TC_MAILING).maxBy(\ a -> a.UpdateTime)
      }   
    }    
    return matchingAddress  
  }

}
