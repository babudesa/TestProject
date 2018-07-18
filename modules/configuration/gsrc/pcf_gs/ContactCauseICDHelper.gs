package pcf_gs
uses pcf_gs.Medicare_PageProc

class ContactCauseICDHelper {
  private var _contactICD : ContactICDExt as ContactICD
  public var _isValidCode : Boolean as ValidCode = true
  public var _icd : String as newCode
  
  construct(conICD : ContactICDExt){
    _contactICD = conICD 
    _icd = conICD.ICDCode.Code
  }
  
  construct(contactISO : ContactISOMedicareExt){
    _contactICD = new ContactICDExt()
    _contactICD.ContactISOMedicareExt = contactISO
    _contactICD.CauseOfInjury = true
    _icd = new String()
  }
  
  property set ICDCode(code : String){
    var icd : ICDCode
    var pageProc = new pcf_gs.Medicare_PageProc()
    var icdVersion = pageProc.claimICDVersion
    if(code!=null){
      icd = libraries.ICDCodeUtil.ICDSearch(code, null, null, false, "CauseOfInjury", icdVersion, true).FirstResult
    }
    else
      icd=null
    _contactICD.ICDCode = icd
    _icd = code
  }
  
  property get ICDCode() : String {
    if(ValidCode==true){
      return _contactICD.ICDCode.Code
    }
    return _icd
  }
}