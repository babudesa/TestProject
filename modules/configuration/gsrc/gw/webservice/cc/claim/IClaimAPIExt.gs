package gw.webservice.cc.claim
uses entity.Claim
uses entity.User
uses entity.Credential
uses typekey.ClaimState
uses gw.api.messaging.SynchStateData
uses gw.api.webservice.exception.PermissionException;
uses gw.api.webservice.exception.DataConversionException;
uses gw.api.webservice.exception.EntityStateException
uses gw.api.webservice.exception.SOAPException
uses gw.api.webservice.exception.SOAPServerException
uses gw.api.webservice.exception.BadIdentifierException
uses gw.api.webservice.WSRunlevel

@WebService(WSRunlevel.NODAEMONS)
class IClaimAPIExt extends IClaimAPI {

  construct() {

  }
  @Throws(DataConversionException, "If the claimID does not exist.")
  @Throws(PermissionException, "If the user does not have VIEW_CLAIM permission.")
  @Throws(SOAPException, "")
  @Throws(SOAPServerException, "")
  function migrateClaim(claim : Claim, userName: String, state : ClaimState, assignedGroupId : String, assignedUserId : String, syncState : SynchStateData[]) : Claim{
    print("in migrateClaim")
    var user = User.finder.findUserByUserName(userName)
    //var cred = find(c in Credential where c.UserName == "dlusby").FirstResult
    //user.Credential = cred
    claim.AssignedUser = user
    state = ClaimState.TC_OPEN
    migrateClaim (claim, state, assignedGroupId, assignedUserId, syncState)
    print("signature " + user.ex_Signature + " claim nbr " + claim.ClaimNumber + " state " + state)
    var exposure =    claim.Exposures[0];
    var policy = claim.Policy;
    var prop = policy.RiskUnits[0]
    exposure.setCoverage(prop.Coverages[0])
    migrateClaim( claim, state, assignedGroupId, assignedUserId, syncState )
    claim = Claim.finder.findClaimByClaimNumber(claim.ClaimNumber)
    return claim
  }

}
