package gw.entity
uses gw.api.util.CurrencyUtil

@Export
enhancement GWEmploymentDataEnhancement : entity.EmploymentData
{
  /**
   * Retrieves the currency of the claim that owns this EmploymentData object,
   * or else the default currency if the claim is unreachable.
   * <p>
   * Note: The owning Claim is only found if this EmploymentData is referred to by one of the foreign keys
   * pointing to it in the base configuration: Claim.EmploymentData, Exposure.NewEmpData, Exposure.PriorEmpData.
   * Otherwise, it returns the default currency. This fallback is fine in single currency mode. In multiple
   * currency mode implementations, if additional foreign keys to EmploymentData are added in extensions,
   * this method must be overriden to potentially find a path back to the Claim via those alternative
   * owning entities.
   * 
   * @return The associated Claim's currency, if any. Default currency if the Claim is not currently reachable
   *         (for example, if the necessary entity connections have not yet been made).
   */
  property get ClaimCurrency() : Currency {
    var claim = this.OwningClaimInternal
    return claim == null ? CurrencyUtil.getDefaultCurrency() : claim.Currency
  }
}
