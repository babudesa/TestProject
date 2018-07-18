package gw.fnolmapper.acord
uses gw.api.financials.CurrencyAmount
uses java.math.BigDecimal

/**
 * Class with static utility methods and constants for ACORD mapping.
 */
@ReadOnly
class AcordUtil 
{
  //constants
  public static final var ROLE_CLAIMANT:String = "CLM"
  public static final var ROLE_DRIVER_OTHER:String = "DOC"
  public static final var ROLE_DRIVER:String = "DRV"
  public static final var ROLE_VEHICLE_OWNER:String = "VEH"
  public static final var ROLE_PROPERTY_OWNER:String = "PRO"
  
  public static final var LOC_IN_VEHICLE:String = "INSVEH"
  
  private construct() {}

  public static function getCurrencyAmount(amt:BigDecimal, currCode:String) : CurrencyAmount {
     return currCode==null ? new CurrencyAmount(amt) : CurrencyAmount.getStrict(amt, Currency.get(currCode))
  }
}
