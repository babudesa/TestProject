package libraries.Policy_Entity
uses util.PolicyRefresh;

enhancement RefreshFunctions : entity.Policy {

  function isPolicyInRefresh(inVal:Number):Boolean{
    var refresher : PolicyRefresh = new PolicyRefresh();
    var claimNumber : String;
  
    try{
      if(this.Claim.ClaimNumber != null){
        claimNumber =this.Claim.ClaimNumber;
      }else{
        claimNumber = (this.OriginalVersion as Policy).Claim.ClaimNumber;
      }
      if(claimNumber == null){ //claim number is null on new claim when loading policy from PSAR
        return inVal == 0; //return - the claim is not in refresh
       // throw new gw.api.util.DisplayableException("Current Policy is missing Claim information necessary to determine Refresh status.");
      }
      if(inVal == 1){
        return refresher.policyIsInRefresh(claimNumber);
      }else return !refresher.policyIsInRefresh(claimNumber);
    }catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( this, null, e, null );
      return inVal == 0;
    }
  }//end isPolicyInRefresh
  
  function isPolicyRefreshFailed(inVal:Number):Boolean{
    var refresher : PolicyRefresh = new PolicyRefresh();
    var claimNumber : String;
  
    try{
      if(this.Claim.ClaimNumber != null){
        claimNumber =this.Claim.ClaimNumber;
      }else{
        claimNumber = (this.OriginalVersion as Policy).Claim.ClaimNumber;
      }
      if(claimNumber == null){ //claim number is null on new claim when loading policy from PSAR
        return inVal == 0; //return - the claim is not in refresh
       // throw new gw.api.util.DisplayableException("Current Policy is missing Claim information necessary to determine Refresh status.");
      }
      if(inVal == 1){
        return refresher.policyRefreshFailed(claimNumber+"Fail");
      }else return !refresher.policyRefreshFailed(claimNumber+"Fail");
    }catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( this, null, e, null );
      return inVal == 0;
    }
  }//end isPolicyInRefresh

  /*2/10/10 erawe:defect 2971 Moved setPolicyInRefresh() and setPolicyOutOfRefresh() to ClaimRefreshPolicy
  on Claim class extension.  (OriginalVersion did not work here so we had to move it to Claim).
  */


  //function setPolicyInRefresh( ){
  //  var isPolicyRefresh session : List;
  //  
  //  if(isPolicyRefresh==null){
  //    isPolicyRefresh = new List();
  //    isPolicyRefresh.add(this.Claim.ClaimNumber);
  //  } 
  //  else if(!isPolicyRefresh.contains(this.Claim.ClaimNumber)){
  //  isPolicyRefresh.add(this.Claim.ClaimNumber);
  //  }
  //}

  //function setPolicyOutOfRefresh(){
  //  var isPolicyRefresh session : List
  //  if(isPolicyRefresh != null){
  //    if(isPolicyRefresh.contains(this.Claim.ClaimNumber)){
  //      isPolicyRefresh.remove(this.Claim.ClaimNumber);
  //      if(isPolicyRefresh.length == 0){
  //        isPolicyRefresh = null
  //      }    
  //    }
  //  }
  //}
}
