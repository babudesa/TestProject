package util.gaic.CMS.validation
uses java.util.ArrayList

abstract class CMSValidationBase implements CMSValidation {
  
  var prefixMessage : String as Prefix= "CMS Medicare fields must be populated on the Claimant: "
  var _doQueryData : boolean as DoQueryData = false
  var _doReportingData : boolean as DoReportingData = false
  var _ICD9Flag : boolean as ICD9Flag = false
  var _TPOCFlag : boolean as TPOCFlag = false
  var _ORMFlag : boolean as ORMFlag = false
  var _fields : ArrayList<CMSFieldID> as Fields = new ArrayList<CMSFieldID>()
  var _exposure : Exposure as Expo
  var _person : Person as ClaimantPerson
  var _conISO : ContactISOMedicareExt as ConISO  
  
  construct() {

  }
  
  construct(exposure : Exposure){
    _exposure = exposure
    _person = exposure.Claimant as Person //this is safe because you will already have checked the generalPrecCondition, right?
    
    if(_person.ContactISOMedicareExt != null){
      _conISO = _person.ContactISOMedicareExt 
    }
        
    _doQueryData = _person.MedicareEligibleExt || _person.MedicareEligibleExt == null //normally do not set in sub-classes
  }

  override property get ValidationMessage() : String{
    var sep = ", "
    var message = ""
    var iter = _fields.iterator()
    
    while(iter.hasNext()){
      message += iter.next().Name
      if(iter.hasNext()){
        message += sep 
      }
    }
    
    return message
  }

}
