package gw.entity

enhancement GWLargeLossClaimIndicatorEnhancement : entity.LargeLossClaimIndicator
{
  property get MoneyCurrency() : Currency {
    return this.Claim.Currency
  }
}
