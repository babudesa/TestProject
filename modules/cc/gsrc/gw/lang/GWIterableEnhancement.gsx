package gw.lang
uses gw.api.financials.CurrencyAmount

@ReadOnly
enhancement GWIterableEnhancement<T> : java.lang.Iterable<T>
{
  function sumCurrencyAmount( mapper(element:T):CurrencyAmount ) : CurrencyAmount {
    var sum : CurrencyAmount = null
    for( elt in this ) {
      if ( sum == null ) {
        sum = mapper(elt)
      } else {
        var tmp = mapper(elt)
        if ( tmp != null ) {
          sum += tmp
        }
      }
    }
    return sum
  }
}
