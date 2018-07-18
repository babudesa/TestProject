package gw.lang.enhancements
uses java.math.BigDecimal

enhancement CoreArrayOfNumbersEnhancement<N extends java.lang.Number> : N[]
{
  function sum() : N {
    return this.toList().sum( \ i -> i )
  }

  function average() : BigDecimal {
    return this.toList().average( \ i -> i )
  }
}
