package util.gaic.CMS.validation
uses java.util.ArrayList

interface CMSValidation {
  
  property get DoQueryData() : boolean
  property get DoReportingData() : boolean
  property get ICD9Flag() : boolean
  property get TPOCFlag() : boolean
  property get ORMFlag() : boolean
  property get Fields() : ArrayList<CMSFieldID>
  property get Expo() : Exposure
  property get ClaimantPerson() : Person
  property get ConISO() : ContactISOMedicareExt
  property get ValidationMessage() : String
  
  public function doInit()
}
