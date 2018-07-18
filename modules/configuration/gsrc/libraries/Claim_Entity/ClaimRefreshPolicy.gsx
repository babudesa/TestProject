package libraries.Claim_Entity
uses util.PolicyRefresh;

enhancement ClaimRefreshPolicy : entity.Claim {
  /*2/10/10 erawe:defect 2971 Moved setPolicyInRefresh() and setPolicyOutOfRefresh() to ClaimRefreshPolicy
  on Claim class extension.  (OriginalVersion did not work on the Policy so we had to move it here to the Claim).
  */
  function setPolicyInRefresh( ){
    var refresher : PolicyRefresh = new PolicyRefresh();
    
    refresher.setClaimRefresh( this.ClaimNumber )
  }//end setPolicyInRefresh


  function setPolicyOutOfRefresh(){
    var refresher : PolicyRefresh = new PolicyRefresh();
  
    refresher.removeClaimRefresh(this.ClaimNumber);  
  }//end setPolicyOutOfRefresh
  
  function setPolicyRefreshFailed(){
    var refresher : PolicyRefresh = new PolicyRefresh();
    var claimFailed : String = this.ClaimNumber + "Fail"; 
    refresher.setClaimRefresh(claimFailed);  
  }//end setPolicyRefreshFailed
}
