package util.gaic;

class CommonFunctions {
  
  construct() {
  }
  
  static function sendTemplateMessage(messageContext : MessageContext, templateData : String) : Message {
    return messageContext.createMessage(templateData) ;
  }
  
  static function addressFieldChanged(address : Address) : boolean {
    var fields = new String[] { "AddressLine1", "AddressLine2", "AddressLine3", "Longitude", "Latitude",
      "AddressType", "City", "State", "Country", "PostalCode", "Description" };
    return util.gaic.CommonFunctions.fieldFromListChanged(address, fields);
  }
  
  //
  // Utility method, checks if any of the named fields of the given bean have changed
  //
  static function fieldFromListChanged(bean : KeyableBean, fields : String[]) : boolean {
    if (bean != null) {
      for (field in fields) {
        if (bean.isFieldChanged(field)) {
          return true;
        }
      }
    }
    return false;
  }
  
  //
  // return code from reference table
  /*
  static function getStateCounty(state : State, county : String) : String {
    var countycd = ""; 
    var query = find (var countymatch in CountyExt where countymatch.CountyNameExt == county and countymatch.StateExt == state)
                         
    if (query.getCount() == 1) {
      countycd = query.iterator().next().PublicID
    }

    return countycd;
  }*/
  
  static function getStateCounty(state : State, county : String) : String {
    var countyCd = ""
    var potentialMatches = typekey.County.getTypeKeys(false).where(\ c -> c.Description.equalsIgnoreCase(county))
    
    for(pm in potentialMatches){
      for(cat in pm.Categories.where(\ cat -> typeof cat == typekey.State)){
         if(cat == state){
           countyCd = pm.Code 
         }
      }
    }
    
    return countyCd
  }
  
  //
  // determine if claim certificate info is such that other insurance should be generated
     
  static function certificateDataChanged(claim : Claim) : boolean {
 
    var fields = new String[] { "CertificateNumberExt", "CertHolderExt", "CertLocationIDExt", "CertEffectiveDateExt", "CertExpirationDateExt",
      "CertGenAggregateLimitExt", "CertProdCompAggLimitExt", "CertPersAdInjuryAggLimitExt", "CertEachOccLimitExt", "CertDeductibleExt", "CertDeductibleAppExt" };
    return util.gaic.CommonFunctions.fieldFromListChanged(claim, fields);
  }
  
}
