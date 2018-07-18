package gw.entity
uses java.lang.IllegalStateException

enhancement GWBenefitsEnhancement : entity.Benefits
{
  /**
   * Retrieves the currently set currency for this benefits' associated claim.
   *
   * @return The associated Claim's currency, if any.  Returns NULL if the Claim is not currently reachable
   *         (for example, if the necessary entity connections have not yet been made).
   */
  property get ClaimCurrency() : Currency {
    return this.OwningClaimInternal.Currency
  }
}
