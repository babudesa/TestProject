package libraries.MessageContext_Entity

enhancement MessageContextEnhancement : entity.MessageContext {
  
  function isIgnorableEDWDraftClaimEvent() : boolean{
    var root = this.Root;


    if (root typeis CoverageReinsuranceExt) {
      if(root.Coverage.Policy.Claim == null or root.Coverage.Policy.Claim.State == "draft"){
        return true;
      }
    } else if (root typeis ClaimInfo) {
      if(root.Claim == null or root.Claim.State == "draft"){
        return true;
      }
    } else if (root typeis ClaimContact) {
      if(root.Claim == null or root.Claim.State == "draft"){
        return true;
      }
    } 
    else if (root typeis ClaimContactRole) {
      if(root.ClaimContact.Claim == null or root.ClaimContact.Claim.State == "draft"){
        return true;
      }
    }
    else if(root typeis RiskUnit){
      if(root.Policy.Claim == null or root.Policy.Claim.State == "draft"){
        return true;
      }
    }
    else if(root typeis Coverage){
      if(root.Policy.Claim == null or root.Policy.Claim.State == "draft"){
        return true;
      }
    }
    else if(root typeis Policy){
      if(root.Claim == null or root.Claim.State == "draft"){
        return true;
      }
    }
    else if(root typeis Claim){
      if(root == null or root.State == "draft"){
        return true;
      }
    }
    else if(root typeis Endorsement){
      if(root.Policy.Claim == null or root.Policy.Claim.State == "draft"){
        return true;
      }
    }
    return false;
  }
  
}
