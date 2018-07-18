package util.gaic.billimport

uses gw.api.database.*
uses soap.abintegration.entity.ABContactSearchCriteria
uses soap.abintegration.entity.ABContactSearchResultSpec
uses gw.api.soap.GWAuthenticationHandler
uses soap.abintegration.entity.ABContactSearchResult
uses gw.plugin.ccabintegration.impl.CCAddressBookPlugin
uses java.util.HashMap
uses gw.api.util.TypecodeMapperUtil
uses java.util.Date
uses java.util.ArrayList
uses java.util.Collections
uses soap.abintegration.enums.ABContact
uses libraries.Check_Entity.CheckWriterFunctions


class BillImportCommon {

  construct() {}
  
  static function getClaim(claimNumber : String) : Claim{
    return Query.make(Claim)
                .compare("ClaimNumber", Relop.Equals, claimNumber)  
                .select()
                .AtMostOneRow    
  }
  
  
  static function getExposureToPay(claim : Claim) : Exposure{
    var priorities = new ArrayList<ExposurePaymentPriority>()
    
    for(expo in claim.Exposures){
      priorities.add(new ExposurePaymentPriority(expo)) 
    }
    
    Collections.sort(priorities, new ExposurePaymentComparator())
    
    for(priority in priorities){
      if(priority.Exposure.ValidationLevel == ValidationLevel.TC_PAYMENT){
        return priority.Exposure 
      }
    }
    
    return null //should never get here, but find a better way to handle by throwing an exception or something
  }
  
  
  static function hasAnyATPExposure(claim : Claim) : boolean{
    return claim.Exposures.countWhere(\ e -> e.ValidationLevel == ValidationLevel.TC_PAYMENT) > 0 
  }
  
  
  static function getATPExpsoureByType(claim : Claim, eType : ExposureType) : Exposure{
    return claim.Exposures.where(\ e -> e.ExposureType == eType && e.ValidationLevel == ValidationLevel.TC_PAYMENT).first() 
  }
  
  
  static function searchForVendor(taxID : String) : soap.abintegration.entity.ABContact {
    var searchCriteria = new ABContactSearchCriteria()
    searchCriteria.ContactSubtype = soap.abintegration.enums.ABContact.TC_ABContact
    searchCriteria.TaxID = taxID
    
    var searchSpec = new ABContactSearchResultSpec()
    searchSpec.IncludeTotal = true
    searchSpec.MaxResults = 100
    
    var contactAPI = new soap.abintegration.api.IContactAPI()
    contactAPI.addHandler(new GWAuthenticationHandler("su", "gw"))
    
    return contactAPI.searchContact(searchCriteria, searchSpec).Results.firstWhere(\ abCon -> abCon.CloseDateExt == null)
  }
  

  static function retrieveVendor(abUID : String) : Contact{        
    var relSpec = new ContactRelationshipSpec()
    return getABPlugin().retrieveContact(abUID, relSpec)
  }
  
  
  static function getABPlugin() : CCAddressBookPlugin{
    var plugin = new CCAddressBookPlugin()
    var params = new HashMap<String, String>()
    params.put("authPlugin", "true")
    plugin.setParameters(params)
    return plugin
  }
  
  
  static function getLineCategoryDescription(namespace : String, code : String) : String {
    var description = ""
    if(namespace != null && code != null){
      var util = TypecodeMapperUtil.getTypecodeMapper()
      var internalCode = util.getInternalCodeByAlias("LineCategory", namespace, code)      
      var typekey : LineCategory = null
      
      typekey  = LineCategory.get(internalCode)
  
      if(typekey != null) {
        description = typekey.Description
      }
    }
    return description
  }
  
  static function getClaimBusinessUnit(claim : Claim) : BusinessUnitExt {
    var unit : BusinessUnitExt = null
    
    if(claim != null) {
      unit = claim.NCWOnlyBusinessUnitExt
    }
    
    return unit
  }
  
  static function getClaimantFullName(claim : Claim) : String {
    var claimantName : String = ""
   
    if(claim != null) {           
      var claimantMiddleName : String = claim.claimant.MiddleName != null ? claim.claimant.MiddleName : ""
      var claimantLastName : String = claim.claimant.LastName != null ? claim.claimant.LastName : ""
      var claimantFirstName : String = claim.claimant.FirstName != null ? claim.claimant.FirstName : ""
      claimantName =  claimantFirstName + " " + claimantMiddleName + " " + claimantLastName
    }
    
    return claimantName
  }
  
  static function getLossDate(claim : Claim) : Date {
    var lossDate : Date = null
    
    if(claim != null) {
      lossDate = claim.LossDate
    }
    
    return lossDate
  }  
  
  public static function getAdjusterBusinessAddress(claimPublicId : String) : Address {
    var theClaim = find(c in Claim where c.PublicID == claimPublicId).AtMostOneRow
    return theClaim.AssignedUser.Contact.PrimaryAddress
  }
  
  

}
