package pcf_gs

class ContactDiagICDHelper {
  
  private var _contactICD : ContactICDExt as ContactICD
  private var _icd : String
  public var _isValidCode : Boolean as ValidCode = true
  
  construct(conICD : ContactICDExt){
    _contactICD = conICD
    _icd = conICD.ICDCode.Code
  }
  
  construct(contactISO : ContactISOMedicareExt){
    _contactICD = new ContactICDExt()
    _contactICD.ContactISOMedicareExt = contactISO
    _icd = new String()
  }
  
  property get ICDCode() : String {
   // return _contactICD.ICDCode.Code
   return _icd
  }
  
  property set ICDCode(newCode : String){
    var icd : ICDCode
    var pageProc = new pcf_gs.Medicare_PageProc()
    var icdVersion = pageProc.claimICDVersion
    if(newCode!=null){
      icd = libraries.ICDCodeUtil.ICDSearch(newCode, null, null, false, "ICD Codes", icdVersion, true).FirstResult
    }
    else
      icd=null
    _contactICD.ICDCode = icd
    _icd = newCode
  }
}
