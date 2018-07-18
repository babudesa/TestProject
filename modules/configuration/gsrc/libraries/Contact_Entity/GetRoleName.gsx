package libraries.Contact_Entity

enhancement GetRoleName : entity.Contact {
  //getContactRoleName accepts a ContactRole code string and returns a string with the name corresponding to the given code.
  // 12/3/2009 - zthomas - Defect 2606, made changes to display More Named Insured/More Named Insured rather than Additional Interest
  // when the covered party type of a role is addnlnaminsured/morenameinsureddba.
    // 5/2/2014 - kniese - added in code to change the insured to principal for bonds claims

  public function getContactRoleName(roleCode : String, cContact : ClaimContact) : String{  
    var roleName : String = new String();
    var ccRole : ClaimContactRole;  
    
    
    for(role in ContactRole.getTypeKeys(false)){    
      if(role.Code == roleCode){    
        if(role.Code == "coveredparty" or role.Code == "formercoveredparty" or 
        ((role.Code == ContactRole.TC_INSURED or role.Code == ContactRole.TC_FORMERINSURED) and cContact.Claim.LossType == typekey.LossType.TC_COMMBONDS)){
          for(ccr in cContact.Roles){
            if(ccr.Role.Code == roleCode){
              ccRole = ccr;
              break;
            }
          }
          if(role.Code == ccRole.Role.Code){    
            if(role.Code == "coveredparty" and ccRole.CoveredPartyType == "addnlnameinsured"){
              roleName = "More Named Insured"
            }else if(role.Code == "coveredparty" and ccRole.CoveredPartyType == "morenameinsureddba"){
              roleName = "More Named Insured DBA"
            }else if(role.Code == "formercoveredparty" and ccRole.CoveredPartyType == "addnlnameinsured"){
              roleName = "Former More Named Insured"
            }else if(role.Code == "formercoveredparty" and ccRole.CoveredPartyType == "morenameinsureddba"){
              roleName = "Former More Named Insured DBA"
            }else if(role.Code == ContactRole.TC_INSURED and cContact.Claim.LossType == typekey.LossType.TC_COMMBONDS){
              roleName = "Principal"
            }else if(role.Code == ContactRole.TC_FORMERINSURED and cContact.Claim.LossType == typekey.LossType.TC_COMMBONDS){
              roleName = "Former Principal"
            }
            
            else{
              roleName = role.DisplayName;
            }
          }
        }
        
        //WCOMP Development: To reflect Supervisor fields to Injured Worker Supervisor and Doctor fields to Doctoe role and VocRehabSpecialist to Medical Provider Non-Phyisician role
        //Date : 04/29/2015
        //Developer : Amulya Saikumar
        
        else if(role.Code == ContactRole.TC_SUPERVISOR and (util.WCHelper.isWCorELLossType(cContact.Claim)) ){
             roleName =  ContactRole.TC_INJWORKERSUPER.DisplayName}
        else{
          roleName = role.DisplayName;
        }
      }  
    } 
  
    return roleName
  }

  public function getBIContactRoleName(roleCode : String) : String{  
    var roleName : String = ""
    
    for(role in ContactRole.getTypeKeys(false)){    
      if(role.Code == roleCode){    
        roleName = role.DisplayName
      }  
    }  
    return roleName
  }  
}
