package gw.webservice.cc.pcintegration.v1
uses gw.webservice.cc.pcintegration.v1.pcentities.PCClaim
uses java.util.ArrayList
uses gw.api.webservice.WSRunlevel
uses gw.webservice.cc.pcintegration.v1.pcentities.PCClaimSearchCriteria
uses java.lang.Integer
uses gw.api.webservice.exception.DataConversionException
uses gw.api.webservice.exception.PermissionException
uses gw.api.webservice.exception.SOAPServerException
uses gw.api.webservice.exception.SOAPException
uses gw.webservice.cc.pcintegration.v1.pcentities.PCClaimDetail
uses java.lang.IllegalArgumentException
uses com.guidewire.pl.system.webservices.XMLBadIdentifierException
uses gw.api.database.IQueryBeanResult

@ReadOnly
@WebService(WSRunlevel.NODAEMONS)
class PCClaimSearchIntegrationAPI
{
  construct()
  {
  }
  
  @Throws(DataConversionException, "If any of the reqired field in PCClaimSearchCriteria is null or the end date is before the begin date")
  @Throws(SOAPException, "")
  function searchForClaims(criteria : PCClaimSearchCriteria) : PCClaim[] {
    return searchForClaimsMultiCriteria(new PCClaimSearchCriteria[] {criteria})
  }

  @Throws(DataConversionException, "If any of the reqired field in PCClaimSearchCriteria is null or the end date is before the begin date")
  @Throws(SOAPException, "")
  function searchForClaimsMultiCriteria(criteria : PCClaimSearchCriteria[]) : PCClaim[] {
    criteria.each(\c -> checkRequiredField(c))
    var results = new ArrayList<PCClaim>()
    criteria.each(\c -> addClaims(results, c))
    return results as PCClaim[]
  }
  
  @Throws(DataConversionException, "If any of the reqired field in PCClaimSearchCriteria is null or the end date is before the begin date")
  @Throws(SOAPException, "") 
  function getNumberOfClaims(criteria : PCClaimSearchCriteria) : Integer {
    return getNumberOfClaimsMultiCriteria(new PCClaimSearchCriteria[] {criteria})
  }

  @Throws(DataConversionException, "If any of the reqired field in PCClaimSearchCriteria is null or the end date is before the begin date")
  @Throws(SOAPException, "") 
  function getNumberOfClaimsMultiCriteria(criteria : PCClaimSearchCriteria[]) : Integer {
    criteria.each(\c -> checkRequiredField(c))
    return criteria.sum(\ c -> countClaims(c))
  }

  private function addClaims(results : List<PCClaim>, criteria : PCClaimSearchCriteria) {
    var claimState = criteria.Status as typekey.ClaimState
    var qp = findClaimQuery(criteria, claimState)
    for (claim in qp.iterator()) {
      results.add( new PCClaim(claim as Claim) )
    }
    // search for archived claims, too, but only for selected states
    if (claimState != typekey.ClaimState.TC_OPEN and claimState != typekey.ClaimState.TC_DRAFT) {  
      var archivedqp = findArchivedClaimQuery(criteria)
      for (ccClaim in archivedqp.iterator()) {
          results.add( new PCClaim(ccClaim as ClaimInfo) )
      }
    }
  }

  private function countClaims(criteria : PCClaimSearchCriteria) : int {
    var claimState = criteria.Status as typekey.ClaimState
    var count = findClaimQuery(criteria, claimState).Count

    // search for archived claims, too, but only for selected states
    if (claimState != typekey.ClaimState.TC_OPEN and claimState != typekey.ClaimState.TC_DRAFT) {  
      count += findArchivedClaimQuery(criteria).Count
    }
    
    return count
  }

  private function findClaimQuery(criteria : PCClaimSearchCriteria, claimState : typekey.ClaimState) : IQueryBeanResult {
    return Claim.finder.findByPolicyNumbers(criteria.PolicyNumbers, criteria.BeginDate, criteria.EndDate,claimState)
  }

  private function findArchivedClaimQuery(criteria : PCClaimSearchCriteria) : IQueryBeanResult {
    return Claim.finder.findArchivedClaimInfoByPolicyNumbers(criteria.PolicyNumbers, criteria.BeginDate, criteria.EndDate)
  }

  @Throws(DataConversionException, "If any of the reqired field in PCClaimSearchCriteria is null")
  @Throws(SOAPException, "")
  function getClaimByClaimNumber(claimNumber : String) : PCClaimDetail {
    try {
      var claiminfo = Claim.finder.findClaimInfoByClaimNumber(claimNumber)
      return (claiminfo != null) ? ((claiminfo.Claim != null) ? 
                                        new PCClaimDetail(claiminfo.Claim) : 
                                        new PCClaimDetail(claiminfo)) :
                                   null
    } catch (e : IllegalArgumentException) {
      throw new DataConversionException(displaykey.Java.Claim.RequiredFieldIsNull("claimNumber"))
    }
  }

 
  @Throws(DataConversionException, "If either claimPublicID or userName is null")
  @Throws(SOAPException, "") 
  function giveUserClaimViewPermission(claimPublicID : String, userName : String) {
    if (claimPublicID == null || claimPublicID.length == 0 ) {
      throw new DataConversionException(displaykey.Java.Claim.RequiredFieldIsNull("ClaimPyblicID"))
    }  
    if (userName == null || userName.length == 0 ) {
      throw new DataConversionException(displaykey.Java.Claim.RequiredFieldIsNull("userName"))
    }
    var user = User.finder.findUserByUserName(userName)
    if (user == null) {
     throw new DataConversionException(displaykey.Java.Claim.UserNotExistInCC)
    }
    try {
      var claimAPI = new gw.api.webservice.cc.claim.ClaimAPIImpl()
      claimAPI.giveUserPermissionsOnClaim( claimPublicID,user.PublicID, {ClaimAccessType.TC_VIEW}) 
    } catch (e : XMLBadIdentifierException) {
      throw new DataConversionException(e.Message)
    }
  }
        
  private function checkRequiredField(pcClaimSearchCriteria : PCClaimSearchCriteria) {
    if (pcClaimSearchCriteria.PolicyNumbers == null || 
        pcClaimSearchCriteria.PolicyNumbers.length == 0) {
      throw new DataConversionException(displaykey.Java.Claim.RequiredFieldIsNull("PolicyNumbers"))
    }
    if (pcClaimSearchCriteria.BeginDate > pcClaimSearchCriteria.EndDate) {
      throw new DataConversionException(displaykey.Java.Claim.EndDateIsBeforeBeginDate.Exception)
    } 
  }
  
}
