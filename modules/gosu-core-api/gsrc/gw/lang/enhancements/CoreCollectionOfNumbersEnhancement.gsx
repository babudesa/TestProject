package gw.lang.enhancements
uses java.util.Collection
uses java.math.BigDecimal

enhancement CoreCollectionOfNumbersEnhancement<N extends java.lang.Number> : Collection<N> {

  function sum() : N {
    return this.sum( \ i -> i )
  }

  function average() : BigDecimal {
    return this.average( \ i -> i )
  }  
}
