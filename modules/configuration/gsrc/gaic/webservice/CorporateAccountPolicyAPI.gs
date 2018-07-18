package gaic.webservice
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.util.Logger
uses java.lang.Exception
uses util.Stopwatch

@WebService
class CorporateAccountPolicyAPI {
  public function updateCorporateAccountPolicy(loadCommandId:int):int{
    var stopwatch = new Stopwatch("LoadCommandID: " + loadCommandId)
    
    try {      
      gw.api.util.Logger.logInfo("Corporate account policy implementation Starts" )
      var claimsAgnstLoadCmdId=Query.make(Claim).compare("LoadCommandID", Relop.Equals, loadCommandId).select()   
      stopwatch.addToSplits("claimsAgnstLoadCmdId init")  
      if(claimsAgnstLoadCmdId.Count==0) {
        gw.api.util.Logger.logInfo("Loadcommandid : " + loadCommandId + " is not  available  in Claim table" )
      }else{
        for(claim in claimsAgnstLoadCmdId){
          stopwatch.addToSplits("for loop begin" + claim.ClaimNumber)
          var claimBundle = gw.transaction.Transaction.getCurrent().add(claim)
          util.admin.SecurityUtil.updateClaim(claimBundle)
          stopwatch.addToSplits("after updateClaim(...)")
          gw.api.util.Logger.logInfo("Updated Corporate Account User Role for claim " + claim.ClaimNumber )
          claimBundle.rebuildClaimACL()
          stopwatch.addToSplits("after rebuildClaimACL()")
          claimBundle.Bundle.commit()
          stopwatch.addToSplits("after bundle commit")
          gw.api.util.Logger.logInfo("Rebuilds the ACL for the claim " + claim.ClaimNumber + " is done" )
        }
        
        gw.api.util.Logger.logInfo("Corporate account policy implementation Ends" )
           
      }
    }catch (e:Exception) {
      e.printStackTrace()
      return -1
    }finally{
      gw.api.util.Logger.logInfo(stopwatch.toString())
    }
    return 0
  }
}