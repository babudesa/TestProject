package gw.plugin.exchangerate.impl;
uses gw.plugin.exchangerate.IExchangeRateSetPlugin
uses gw.api.util.CurrencyUtil
uses soap.ExchangeRateService.api.FXWS
uses java.util.ArrayList
uses gw.api.util.DateUtil

@Export
class SampleExchangeRateSetPlugin implements IExchangeRateSetPlugin
{
  construct()
  {
  }

  public override function createExchangeRateSet() : ExchangeRateSet {
    // the sample ExchangeRateService uses newyorkfed.org, which only provides exchange rates to and from USD
    var defaultCurrency = typekey.Currency.TC_USD;
    var api = new FXWS();
    var exchangeRates = new ArrayList<ExchangeRate>()
    for (var currency in typekey.Currency.getTypeKeys( true )) {
      if (currency != defaultCurrency) {
        var rate : Number
        if( currency == typekey.Currency.TC_RUB ) {
          // newyorkfed.org doesn't provide exchange rates in Rubles, so use an arbitrary sample value here
          rate = .04156103;
        } else {
          rate = extractRate(api,defaultCurrency,currency);
        }
        exchangeRates.add( CurrencyUtil.createExchangeRate( currency, defaultCurrency, rate ) )
      }
    }
    return CurrencyUtil.createMarketExchangeRateSet( "Test ExchangeRateSet", "From SampleExchangeRateSetPlugin.",
                                                     DateUtil.currentDate(), null, exchangeRates )
  }

  /**
   * @return  the number in units of defaultCurrency per unit of currency
   */
  private function extractRate(api : FXWS, defaultCurrency : Currency, currency : Currency) : float {
    var response : String
    try {
      response = api.getLatestNoonRate(currency.Code)
    } catch (e) {
      return 1  // insert arppropriate error handling if there is a problem while communicating with the exchange rate service
    }
    // The response from the external service is an XML document.
    // The value we want is the number within the frbny:OBS_VALUE element.
    // If the UNIT attribute of the frbny:Series element is "USD", the conversion rate
    // we want is the reciprocal of the value we got.
    // Otherwise, we just return the value.
    var node = gw.api.xml.XMLNode.parse(response);
    var match = node.findFirst(\x -> x.ElementName == "frbny:OBS_VALUE");
    var value = java.lang.Float.valueOf(match.Text);
    var unit = node.findFirst(\x -> x.ElementName == "frbny:Series").Attributes["UNIT"];
    if (unit == defaultCurrency.Code.toUpperCase()) {
      return value;
    } else {
      return 1/value;
    }
  }
}
