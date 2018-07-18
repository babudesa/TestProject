package gw.api.iso

/**
 * Empty subclass of ISOClaimSearchRequest, provided so customers can
 * override methods and properties in the base implementation.
 */
@Export
class ISOClaimSearchRequest extends ISOClaimSearchRequestBase {

  construct(inClaim : Claim)  {
    super(inClaim)
  }
  
  /**
   * bestor 10/03/2011 - overriden to make sure we don't send Exposure data into ISO if it's not yet reconnected.
   */
  override function addExposureToClaimLevelSearchRequest(exposure : Exposure) {
    if (!exposure.ReconnectFailExt && exposure.isValid(ValidationLevel.TC_ISO)) {
      super.addExposureToClaimLevelSearchRequest(exposure)
    } else {
      return
    }
  }
}
