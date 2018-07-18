package gw.api.financials

enhancement GWArrayOfCurrencyAmountsEnhancement : CurrencyAmount[]
{
  function sum() : CurrencyAmount
  {
    var sum = 0 as CurrencyAmount
    for( elt in this ) 
    {
      sum += elt
    }
    return sum
  }
}
