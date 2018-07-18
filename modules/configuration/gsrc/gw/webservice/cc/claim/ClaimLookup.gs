package gw.webservice.cc.claim
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
uses com.gaic.integration.cc.plugins.policy.claimsconversion.SetClmCurrency


@WebService(WSRunlevel.NODAEMONS)
class ClaimLookup {

  construct() {

  }
  @Throws(DataConversionException, "If the claimID does not exist.")
  @Throws(PermissionException, "If the user does not have VIEW_CLAIM permission.")
  @Throws(SOAPException, "")
  @Throws(SOAPServerException, "")

  function getClaim(claimNumber : String) : Claim{
    var claim = Claim.finder.findClaimByClaimNumber(claimNumber)
    claim.Currency = Currency.TC_USD
    return claim
  }

}

