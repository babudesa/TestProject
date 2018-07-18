package gw.entity
uses java.lang.Integer
@Export

enhancement GWClaimTierEnhancement : entity.Claim {
   
  /**
   * The goal is to set the appropriate tier for the Claim
   * <ul>
   * <li>First, the claim's tier is set based upon its most complex exposure as
   *    determined by the exposure's ExposureTier priority
   * <li>Second, the claim's Tier may be escalated because of a variety of
   *     special conditions
   * </ul>
   */ 
  function setClaimTier() : void {
    var maxTier = this.Exposures.maxBy(\ e -> e.ExposureTier).ExposureTier.Priority
    if (this.Claim.Policy.PolicyType == "comp") {
      setWCClaimTier(maxTier)
    } else {
      setNonCompClaimTier(maxTier)
    }
  }
  
  private function setWCClaimTier(maxTier: Integer) : void {
    switch (maxTier) {
      case 100:
        this.ClaimTier = "medicalonly"
        break
      case 200:
        this.ClaimTier = "indemnity"
        break
      case 300:
        this.ClaimTier = "el"
        break
      default:
        this.ClaimTier = "incidentreport"
    }
    if (this.ClaimTier == "incidentreport" and not this.IncidentReport) {
      this.ClaimTier = "medicalonly"
    }
  }

  private function setNonCompClaimTier(maxTier: Integer) : void {
    switch (maxTier) {
      case 200:
        this.ClaimTier = "medium"
        break
      case 300:
        this.ClaimTier = "high"
        break
      default:
       this.ClaimTier = "low"
    }

    if (this.ClaimTier != "high"
            and (this.LitigationClaimIndicator.IsOn
                    or this.FatalityClaimIndicator.IsOn
                    or this.IsVeryComplexProperty)) {
      this.ClaimTier = "high"        
    } 
    if (this.ClaimTier == "low"
            and (this.VehicleIncidentsOnly.Count > 2
                    or this.CoverageInQuestionClaimIndicator.IsOn
                    or this.VehicleIncidentsOnly.hasMatch(\ v -> v.TotalLoss)
                    or this.IsComplexProperty)) {
      this.ClaimTier = "medium"     
    }
  } 

  property get IsVeryComplexProperty() : boolean {
    return this.LossType =="PR" and this.LossCause == "fire" and
            (this.Policy.PolicyType <> "homeowners"
            or (this.PropertyFireDamage.FireDeptResponded and not this.PropertyFireDamage.SmokeDamageOnly))
  }

  property get IsComplexProperty() : boolean {
    return this.LossType =="PR"
            and (this.LossCause == "mold" or this.LossCause == "burglary")
  }
}
