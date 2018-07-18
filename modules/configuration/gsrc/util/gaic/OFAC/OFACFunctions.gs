package util.gaic.OFAC;

class OFACFunctions {

  public static function formatZipCode(zipCode : String) : String {
    var zipLength = gw.api.util.StringUtil.length(zipCode)
    //print (zipLength)

    if ( zipLength == 10 ) {
      var zipFive = gw.api.util.StringUtil.substring( zipCode, 0, 5 )
      var zipPlusFour = gw.api.util.StringUtil.substring( zipCode, 6, 10 )
      var fullZip = zipFive + zipPlusFour
      return fullZip
    } else {
      return zipCode
    }
  }
  
  static function sendContactChanges(messageContext : MessageContext) {
    uses templates.messaging.ofac.OFACContact;
    uses templates.messaging.ofac.OFACCompContact;
    var theContact = messageContext.Root as Contact;

    if (theContact typeis Person) {
          var templateData = OFACContact.renderToString(theContact);
          messageContext.createMessage(templateData);
    } else if (theContact typeis Company) {
          var templateData = OFACCompContact.renderToString(theContact);
          messageContext.createMessage(templateData);
    }
  }

  static function sendClaimContactChanges(messageContext : MessageContext, theClaimContact : ClaimContact) {
    uses templates.messaging.ofac.OFACClaimContact;
    uses templates.messaging.ofac.OFACCompClaimContact;
    
    var isValidEvent = true;
    
    if (messageContext.EventName == "ClaimContactContactChanged" && !isClaimContactNameOrAddressChanged(theClaimContact)) {
      isValidEvent = false;
    }

    if (theClaimContact.Claim.State != "draft" && isValidEvent) {
      var ClaimContactType = theClaimContact.Contact
      if (ClaimContactType typeis Person && theClaimContact.Contact != theClaimContact.Claim.Policy.underwriter) {
        var templateData = OFACClaimContact.renderToString(theClaimContact);
        messageContext.createMessage(templateData);
      } else if (ClaimContactType typeis Company) {
        var templateData = OFACCompClaimContact.renderToString(theClaimContact);
        messageContext.createMessage(templateData);
      }
    }
  }
  
  static function sendClaimContactChanges(messageContext : MessageContext) {
    uses templates.messaging.ofac.OFACClaimContact;
    uses templates.messaging.ofac.OFACCompClaimContact;
    var theClaimContact = messageContext.Root as ClaimContact
    
    sendClaimContactChanges(messageContext, theClaimContact)
  }
  
  private static function isClaimContactNameOrAddressChanged(theClaimContact : ClaimContact) : boolean {
    var fields : String[] = {"FirstName", "MiddleName", "LastName"};
    if (theClaimContact.Contact typeis Company) {
      fields = {"Name", "Name2Ext"};
    }
    
    if (util.gaic.CommonFunctions.fieldFromListChanged(theClaimContact.Contact, fields)) {
      return true;
    }
    
    if (theClaimContact.Contact.PrimaryAddress.Changed) {
      return true;
    }
    return false;
  }
  
  // 8/10/15 - kniese - Defect 7644 - Remove dash from EIN before sending to OFAC
  static function formatEIN(ein : String) : String{
    if(ein.contains("-")){
     return ein.replaceAll("-", "")
    }
    else{
     return ein 
    }
  }

}
