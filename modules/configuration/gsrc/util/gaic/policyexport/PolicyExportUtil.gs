package util.gaic.policyexport
uses entity.Policy
uses entity.Contact
uses typekey.State
uses gw.lang.Returns
uses java.util.Date
uses entity.Address
uses java.lang.String
uses gw.xml.xsd.types.XSDDateTime
uses java.util.TimeZone
uses java.text.SimpleDateFormat
uses java.util.Locale
uses util.gaic.claimexport.ClaimExportUtil

class PolicyExportUtil {

  construct() {

  }
  
  static function buildPolicyExportMessage(policy : entity.Policy) : String{
    var polExport = new util.gaic.policyexport.gaigpolicyexport.Policy()
    
    try{
      polExport.RecType = "PL"
      polExport.ClaimSystem = "GAIC"
      polExport.PolicyID = getPolicyID(policy)
      polExport.PolicyName = getPolicyName(policy.insured)
      polExport.PolicyTIN = policy.insured.TaxID
      polExport.LinkInsurerTIN = getIssuingCo(policy.IssuingCompanyExt).FEIN
      
      //policy address
      var polAddress = policy.insured.PrimaryAddress
      polExport.PolicyAddress1 = polAddress.AddressLine1
      polExport.PolicyAddress2 = polAddress.AddressLine2
      polExport.PolicyCity = polAddress.City
      polExport.PolicyState = polAddress.State.Code
      polExport.PolicyZip = polAddress.PostalCode
      
      //dates
      polExport.PolicyEffectiveDate = formatDate(policy.EffectiveDate)
      polExport.PolicyTerminationDate = formatDate(policy.ExpirationDate)
    }catch(ex){
      gw.api.util.Logger.logInfo("Unable to build policy export message for " + policy.PolicyNumber)
      gw.api.util.Logger.logInfo(ex.Message)
      throw ex
    }
    
    return polExport.asUTFString()  
  }
  
  
  /**
   * @TODO handle company not found and null conditions
   * @TODO move to common place so it can be used by other exports
   */
  static function getIssuingCo(issuingCoType : IssuingCompanyExt) : IssuingCoExt{
    var issuingCo : IssuingCoExt = gw.api.database.Query.make(IssuingCoExt)
                                                        .compare("IssuingCompany", Equals, issuingCoType)
                                                        .select()
                                                        .FirstResult
                                                        
    return issuingCo                                                        
  }
  
  
  static function getPolicyName(insured : Contact) : String{
    if(typeof insured == Company || insured.Name != null){
      return insured.Name 
    }else if(typeof insured == Person){
      var person = insured as Person
      return person.FirstName + " " + person.LastName
    }else{
      return "" 
    }
  }
  
  
  static function getPolicyID(policy : Policy) : String{
    var policyID = policy.PolicyNumber
    policyID += policy.PolicySuffix
	policyID += ClaimExportUtil.parsePolicyZoneFromVersion(policy)
    policyID += policy.PolicyType.Code.length == 2 ? policy.PolicyType.Code + " " : policy.PolicyType.Code
    policyID += getIssuingCo(policy.IssuingCompanyExt).MasterCoNum    
    
    return policyID   
  }
  
  
  static function formatDate(unformattedDate : java.util.Date) : String{
    var formattedDate = ""
    formattedDate += unformattedDate.YearOfDate
    formattedDate += padDateValue(unformattedDate.MonthOfYear as java.lang.String)
    formattedDate += padDateValue(unformattedDate.DayOfMonth as java.lang.String)
    
    return formattedDate
  }


  private static function formatDateforXSD(date : DateTime) : XSDDateTime {
    if(date == null) {
      return null
    } else {
      return new gw.xml.xsd.types.XSDDateTime(getISO8601StringForDate(date))
    }
  }
  
    /**
  * Return an ISO 8601 combined date and time string for specified date/time
  * 
  * We will want to put this in a common class for use in all of the exports
  */
  @Returns("String with format yyyy-MM-dd'T'HH:mm:ss'Z'")
  private static function getISO8601StringForDate(date : DateTime) : String {
    var dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
    dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
    return dateFormat.format(date);
  }
  
  
  static function padDateValue(s : String) : String {
    if(s.length < 2){
      return "0" + s 
    }
    
    return s
  }
  
}
