package gw.entity
uses java.lang.IllegalStateException

enhancement GWVehicleEnhancement : entity.Vehicle
{
  /**
   * Retrieves the currency set for this vehicle's associated Policy
   *
   * @return a member of the Currency typelist representing this Vehicle's associated Policy's 
   *         currency.  Returns NULL if the Policy is not currently reachable
   *         (for example, if the necessary entity connections have not yet been made).
   */
  property get PolicyCurrency() : Currency {
    return this.AssociatedPolicyInternal.Currency
  }
}
