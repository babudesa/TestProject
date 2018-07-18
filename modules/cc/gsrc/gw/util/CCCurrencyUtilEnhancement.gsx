package gw.util

uses gw.api.financials.CurrencyAmount
uses java.math.BigDecimal

enhancement CCCurrencyUtilEnhancement : gw.api.util.CurrencyUtil {

  /**
   * If amount is null, returns a CurrencyAmount with BigDecimal.ZERO, and the
   * given currency. Otherwise, returns amount.
   * @param amount CurrencyAmount to test for null
   * @param currency the currency to use with ZERO if it is null. Should be
   *                 the same currency property as amount uses
   * @return a non-null CurrencyAmount, either amount or Zero with the given currency.
   */
  public static function nz( amount : CurrencyAmount, currency : Currency) : CurrencyAmount {
    return amount != null ? amount : CurrencyAmount.getStrict(BigDecimal.ZERO, currency);
  }
}
