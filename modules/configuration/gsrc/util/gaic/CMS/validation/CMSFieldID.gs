package util.gaic.CMS.validation

enum CMSFieldID {
  
  MEDICARE_ELIGIBLE("Medicare Eligible", true),
  GENDER("Gender", true),
  DATE_OF_BIRTH("Date Of Birth", true),
  SSN_HICN("SSN or HICN", true),
  MEDICARE_RPT_NAME_FIRST("Medicare Reporting Name - First", true),
  MEDICARE_RPT_NAME_LAST("Medicare Reporting Name - Last", true),
  MEDICARE_RPT_NAME_FIRST_AND_LAST("Medicare Reporting Name - First and Last", true),
  ORM_IND("ORM", false),
  ICD9_DIAGNOSTIC("ICD Code", false),
  PRODUCT_LIABILITY("Product Liability", false),
  CMS_DATE_OF_INCIDENT("CMS Date of Incident", false),
  STATE_OF_VENUE("State of Venue", false),
  NFIL("No Fault Insurance Limit", false),
  TPOC_DATE("TPOC Date", false),
  TPOC_AMOUNT("TPOC Amount", false),
  TPOC_FEATURE("TPOC Feature", false)            
  
  var _name : String as Name
  var _isQueryField : boolean as QueryField
  
  private construct(inName : String, isQueryField : boolean){
    _name = inName
    _isQueryField = isQueryField
  }
}
