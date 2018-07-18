package gw.api.iso
uses java.lang.IllegalStateException

/**
 * Allows access to the PropertyLossInfo and WorkCompLossInfo aggregates as if they
 * were simple singular properties on ClaimInvestigationAddRq, rather than arrays.
 * This is useful because when sending requests to ISO you can only have a single
 * PropertyLossInfo and a single WorkCompLossInfo in any ClaimInvestigationAddRq, so
 * it is very convenient to refer to, for example, request.PropertyLossInfo rather
 * than manipulating the request.PropertyLossInfos array. However, when parsing
 * responses from ISO, you should always use the array forms of these properties
 * as ISO does sometimes send responses with multiple PropertyLossInfo or
 * WorkCompLossInfo aggregates. In general for a particular piece of code you
 * should either use just these enhancement properties or just the array accessors;
 * don't mix the two. For constructing XML to send to ISO, use the enhancement
 * properties. For parsing responses from ISO, use the array accessors.
 */
@Export
enhancement GWClaimInvestigationAddRqEnhancement : xsd.iso.req.ClaimInvestigationAddRq {
  
  /**
   * Gives access to a single PropertyLossInfo on a ClaimInvestigationAddRq. Use this
   * property rather than the PropertyLossInfos array accessor when constructing XML
   * to send to ISO, as ISO only accepts a single PropertyLossInfo in a
   * ClaimInvestigationAddRq.
   */
  @Autocreate
  property get PropertyLossInfo() : xsd.iso.req.PropertyLossInfo {
    verifyPropertyLossInfoState()
    return this.PropertyLossInfos.Count > 0 ? this.PropertyLossInfos.first() : null
  }
  
  property set PropertyLossInfo(newValue : xsd.iso.req.PropertyLossInfo) {
    verifyPropertyLossInfoState()
    if (this.PropertyLossInfos.Count == 1) {
      this.PropertyLossInfos.remove(0)
    }
    if (newValue != null) {
      this.PropertyLossInfos.add(newValue)
    }
  }

  /**
   * Gives access to a single WorkCompLossInfo on a ClaimInvestigationAddRq. Use this
   * property rather than the WorkCompLossInfos array accessor when constructing XML
   * to send to ISO, as ISO only accepts a single WorkCompLossInfo in a
   * ClaimInvestigationAddRq.
   */
  @Autocreate
  property get WorkCompLossInfo() : xsd.iso.req.WorkCompLossInfo {
    verifyWorkCompLossInfoState()
    return this.WorkCompLossInfos.Count > 0 ? this.WorkCompLossInfos.first() : null
  }
  
  property set WorkCompLossInfo(newValue : xsd.iso.req.WorkCompLossInfo) {
    verifyWorkCompLossInfoState()
    if (this.WorkCompLossInfos.Count == 1) {
      this.WorkCompLossInfos.remove(0)
    }
    if (newValue != null) {
      this.WorkCompLossInfos.add(newValue)
    }
  }
  
  private function verifyPropertyLossInfoState() {
    if (this.PropertyLossInfos.Count > 1) {
      throw new IllegalStateException("Should not create multiple PropertyLossInfo objects in a ClaimInvestigationAddRq")
    }
  }
  
  private function verifyWorkCompLossInfoState() {
    if (this.WorkCompLossInfos.Count > 1) {
      throw new IllegalStateException("Should not create multiple WorkCompLossInfo objects in a ClaimInvestigationAddRq")
    }
  }
    
}
