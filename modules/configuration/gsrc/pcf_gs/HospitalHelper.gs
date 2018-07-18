package pcf_gs
uses gw.rules.ExitCode

class HospitalHelper {
 
  private var _claim : Claim
  
  construct(claim : Claim) {
    _claim = claim
  }
  
  property get Hospitals() : MedicalCareOrg {
    return _claim.hospital.last() as MedicalCareOrg
  }
  
  property set Hospitals(hospital : MedicalCareOrg){
    _claim.addRole(ContactRole.TC_HOSPITAL, hospital)
  }

}