package gw.lang
uses java.lang.StringBuilder
uses java.lang.IllegalStateException

@ReadOnly
enhancement GWStringEnhancement : String {

  /**
   * Attempts to combine the lines of a multi-line String somewhat prettily, by separating
   * the lines by comma followed by a space, omitting the comma if it
   * already exists in the source string.
   *
   * @returns the lines of this String combined together into a new String
   */
  function combineLines() : String {
    return combineLines("," as char)
  }

  /**
   * Attempts to combine the lines of a multi-line String somewhat prettily, by separating
   * the lines by a delimiter character followed by a space, omitting the delimiter if it
   * already exists in the source string.
   *
   * @returns the lines of this String combined together into a new String
   */
  function combineLines(delim : char) : String {
    var lines = this.split("\n")
    var prevHadDelim = true
    var isFirst = true
    var result = new StringBuilder()
    for( line in lines ) {
      line = line.trim()
      if( !line.Empty ) {
        if( !isFirst ) {
          if( !prevHadDelim ) {
            result.append( delim )
          }
          result.append( " " )
        }
        result.append( line )
        prevHadDelim = line.charAt(line.size-1) == delim
        isFirst = false
      }
    }
    return result.toString()
  }

  function safeSubstring( beginIndex : int, endIndex : int) : String {
    return this.substring( beginIndex, java.lang.Math.min(endIndex, this.length) )
  }

  /**
   * Removes everything but digits and decimal points
   */
  property get Digits() : String {
    return this.replaceAll( "[^0-9.()]", "" )
  }

  property get AsNumber() : Number {
    var d = this.Digits
    if( d.startsWith("(") and d.endsWith(")") ) {
      return -(d.substring(1,d.length-1) as Number)
    } else {
      return d as Number
    }
  }

  /**
   * Returns the number of non-overlapping occurrences (matching case) of subString in this String.
   * @return  the number of non-overlapping occurrences of subString in this String
   */
  function countOccurrences( subString : String ) : int {
    var found = 0
    var cursor = 0
    while( true ) {
      cursor = this.indexOf( subString, cursor )
      if( cursor == -1 ) {
        return found
      }
      found++
      cursor += subString.size
    }
    throw new IllegalStateException( "impossible!" )
  }

  /**
   * Returns s, converting a null value to an empty string if necessary.
   */
  static function makeSafe( s : String ) : String {
    return s==null ? "" : s
  }
}
