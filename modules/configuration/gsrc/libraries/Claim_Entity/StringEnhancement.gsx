package libraries.Claim_Entity
uses org.apache.commons.lang.StringEscapeUtils

enhancement StringEnhancement : java.lang.String {
  // Defect 8143 - pdash2 - 1/27/16 - To escape Xml meta charaters in message payload for EDW messaging 
  property get removeSpecialChar() : String
  {
     if(null!= this) 
     return StringEscapeUtils.escapeXml(this)
     return this
  }  
}
