package gw.lang

enhancement GWBaseBigIntegerEnhancement : java.math.BigInteger
{
  
  property get IsZero() : boolean
  {
    return this.negate() == this
  }
  
}
