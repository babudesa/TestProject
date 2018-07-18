package libraries.ClaimContact_Entity

enhancement MNInsuredClaimContactFunctions : entity.ClaimContact {
  function isInsuredContact():Boolean{
    if(exists(ccRole in this.Roles where ccRole.Role == "insured" or ccRole.Role == "doingbusinessas" or (ccRole.Role == "coveredparty" and 
      (ccRole.CoveredPartyType == "addnlnameinsured" or ccRole.CoveredPartyType == "morenameinsureddba")))){
      return true;      
    }else{
      return false;
    }
  }
}
