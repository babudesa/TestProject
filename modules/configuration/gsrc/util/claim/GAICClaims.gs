/*
 * This was added to add Draft Claims in the recently Viewed list in the Menu Bar. This function
 * is referenced in TabBar.pcf  - Santosh Dalal
 */


package util.claim; 
uses gw.api.claim.ClaimUtil; 
uses gw.api.claim.NewClaimWizardInfo; 
//uses gw.api.community.PublicUserUtil; 
uses com.guidewire.cc.web.controller.CCWebSession; 
//uses com.guidewire.pl.web.controller.request.WebRequestWrapper; 
uses com.guidewire.pl.system.dependency.PLDependencies; 
//uses com.guidewire.pl.web.auth.LoginHelper; 

class GAICClaims 
{ 
  construct()
  { 
  } 
   
  public static function returnRecentClaim (): boolean 
  { 
    var u = User.util.CurrentUser; 

    /*  def 559 - invoke new function  */
    clearDraftsFromSessionList(u);

    /*var tmp = find (c in Claim where c.CreateUser == u and c.State == "draft"); */
    var tmp = find (c in Claim where c.CreateUser == u and c.State == "draft"); 
   
    for (draftClaim in tmp) 
    { 
      gw.api.claim.ClaimUtil.addToSessionList( draftClaim ); 
    } 
    return true; 
  } 

  /* def 559 by KSO/SDalal. This function removes any draft claims from the user's session list that should not be there because the draft claims are
      retired or were created by another user. */
  /* def 559 by KSO.  Removed the check for CreateUser - any claim viewed show stay on the list*/    
  
  public static function clearDraftsFromSessionList(u: User)
  {
    var ss = gw.api.claim.ClaimUtil.getRecentlyViewedClaims();
    for (claimstate in ss)
    {
      var cc = claimstate.Claim;
      if (cc != null && cc.Retired)
      /* if (cc != null && (cc.Retired or cc.CreateUser != u)) */
        removeClaimFromSessionList(cc);
    }
  }

  /* This function exists because there's no api for changing the ClaimSessionState label */ 
  /* 5.29.15 - cmullin - Workers Comp NCW works differently because the exposures are created
    later in the process than for non-WC claims. Because of this, a "Coverage outside the Effective Dates"-error
    - if applicable - is generated after Finish instead of after Step 4 as for non-WC claims. This late error, 
    when it occurs, interferes with the afterFinish process (FNOLWizard) and causes a user displayable error. 
    To avoid this error for WC claims, this function was changed to send the user directly to NewClaimSaved 
    rather than through the OOTB goAfterFinish function.  
  */
  public static function refreshClaimNumber(c : Claim, wiz : NewClaimWizardInfo) 
  { 
    removeClaimFromSessionList(c); 
    gw.api.claim.ClaimUtil.addToSessionList(c); 
    if(util.WCHelper.isWCorELLossType(c)){
      pcf.NewClaimSaved.goInMain(c)
    }else{
      wiz.goAfterFinish(); 
    }
  }
   
  public static function removeClaimFromSessionList(claim : Claim) 
  { 
     var s = PLDependencies.getWebController().getSession() as CCWebSession; 
          s.getClaimSessionList().removeClaim(claim); 
  } 
} 




