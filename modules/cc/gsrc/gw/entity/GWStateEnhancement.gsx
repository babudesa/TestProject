package gw.entity

enhancement GWStateEnhancement : typekey.State {
  /** This will return the denormed code for this state, i.e., the code within 
   * this country
   *
   * @return the code without the country prefix
   */
  property get DenormCode() : String { 
    var codeStr = this.Code
    var pos = codeStr.indexOf("_")
    return pos == -1 ? codeStr : codeStr.substring(pos + 1)
  }

}
