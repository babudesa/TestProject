package gw.api.iso
uses xsd.iso.req.AdjusterParty

/**
 * Empty subclass of ISOAdjusterPartiesBase, provided so customers can
 * override methods and properties in the base implementation.
 */
@Export
class ISOAdjusterParties extends ISOAdjusterPartiesBase {

  construct(inClaimSearch : ISOClaimSearchRequestBase) {
    super(inClaimSearch)
  }
  
  /**
   * Creates the AdjusterParty aggregate. Called by addAdjuster if there is not
   * an existing AdjusterParty aggregate for the given adjuster
   */
  override protected function createAdjusterParty(adjuster : Contact) : AdjusterParty {
    super.createAdjusterParty(adjuster)
    var claim = ClaimSearch.Claim
    var adjusterParty = super.createAdjusterParty(adjuster)
    // send the one in claim's assigned group instead
    adjusterParty.ItemIdInfo.AgencyId = libraries.ISO.getClaimLevelISOAgencyId(claim)
    //ClaimSearch.getClaimLevelISOAgencyId()
    
    return adjusterParty
  }

}
