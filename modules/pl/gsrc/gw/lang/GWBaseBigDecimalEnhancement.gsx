package gw.lang

enhancement GWBaseBigDecimalEnhancement : java.math.BigDecimal
{
  
  property get IsZero() : boolean
  {
    return this.negate() == this
  }
  
}
