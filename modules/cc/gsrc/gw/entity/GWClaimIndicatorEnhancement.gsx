package gw.entity

enhancement GWClaimIndicatorEnhancement : entity.Claim {
  
  property get OrderedIndicators() : ClaimIndicator[] {
    return this.ClaimIndicators.sortBy(\ i -> i.Subtype)
  }

  property get OrderedOnIndicators() : ClaimIndicator[] {
    return this.OrderedIndicators.where(\ i -> i.IsOn)
  }

}
