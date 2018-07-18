package gw.xml.xsd.types

uses java.math.BigDecimal
uses java.lang.Exception
uses java.util.StringTokenizer
uses java.lang.RuntimeException
uses java.util.NoSuchElementException
uses java.lang.StringBuilder
uses java.math.BigInteger

class XSDDuration
{
  
  static property get Zero() : XSDDuration 
  {
    return new XSDDuration( "PT0S" )
  }
  
  public var Negative : boolean = false
  public var Years : BigInteger = 0
  public var Months : BigInteger = 0
  public var Days : BigInteger = 0
  public var Hours : BigInteger = 0
  public var Minutes : BigInteger = 0
  public var Seconds : BigDecimal = 0.0

  construct()
  {
  }

  construct( s : String )
  {
    var properlyTerminated = false
    var ex = new Exception()
    try {
      var st = new StringTokenizer( s, "PTZ-YMDHS", true )
      var token = st.nextToken()
      if ( token == "-" )
      {
        Negative = true
        token = st.nextToken()
      }
      if ( token != "P" )
      {
        throw ex
      }
      properlyTerminated = true
      token = st.nextToken()
      while ( token != "T" )
      {
        properlyTerminated = false
        var tmp = token
        token = st.nextToken()
        properlyTerminated = true
        switch ( token )
        {
          case "Y": 
            Years = tmp as BigInteger
            break
          case "M": 
            Months = tmp as BigInteger
            break
          case "D": 
            Days = tmp as BigInteger
            break
          default:
            throw ex
        }
        token = st.nextToken()
      }
      properlyTerminated = true
      token = st.nextToken()
      while ( true )
      {
        properlyTerminated = false
        var tmp = token
        token = st.nextToken()
        properlyTerminated = true
        switch ( token )
        {
          case "H": 
            Hours = tmp as BigInteger
            break
          case "M": 
            Minutes = tmp as BigInteger
            break
          case "S": 
            Seconds = new BigDecimal( tmp )
            break
          default:
            throw ex
        }
        token = st.nextToken()
      }
    }
    catch ( e : NoSuchElementException )
    {
      if ( not properlyTerminated )
      {
        throw new RuntimeException( "Could not parse duration: " + s )
      }
    }
    catch ( e : Exception ) 
    {
      throw new RuntimeException( "Could not parse duration: " + s, e == ex ? null : e )
    }
  }
  
  override function toString() : String
  {
    if ( IsZero )
    {
      // at least one field is required - we'll use "zero seconds"
      if ( Negative )
      {
        return "-${ ZERO.toString() }"
      }
      else
      {
        return "${ ZERO.toString() }"
      }
    }    
    var sb = new StringBuilder()
    if ( Negative )
    {
      sb.append( "-" )
    }
    sb.append( "P" )
    if ( ! Years.IsZero )
    {
      sb.append( "${ Years }Y" )
    }
    if ( ! Months.IsZero )
    {
      sb.append( "${ Months }M" )
    }
    if ( ! Days.IsZero )
    {
      sb.append( "${ Days }D" )
    }
    if ( ! ( Hours.IsZero and Minutes.IsZero and Seconds.IsZero ) )
    {
      sb.append( "T" )
      if ( ! Hours.IsZero )
      {
        sb.append( "${ Hours }H" )
      }
      if ( ! Minutes.IsZero )
      {
        sb.append( "${ Minutes }M" )
      }
      if ( ! Seconds.IsZero )
      {
        sb.append( "${ Seconds }S" )
      }
    }
    return sb.toString()
  }
  
  property get IsZero() : boolean
  {
    return Years.IsZero and Months.IsZero and Days.IsZero and Hours.IsZero and Minutes.IsZero and Seconds.IsZero
  }
  
}
