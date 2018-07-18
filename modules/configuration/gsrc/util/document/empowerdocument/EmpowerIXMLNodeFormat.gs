package util.document.empowerdocument
uses gw.xml.IXMLNodeFormat
uses javax.xml.namespace.QName

class EmpowerIXMLNodeFormat implements IXMLNodeFormat{

  construct() {

  }

  override property get AttributePerLine() : boolean {
    return false
  }

  override property get CommentLineBreak() : int {
    return 0
  }

  override property get NewLinePerTopLevelElement() : boolean {
    return false
  }

  override property get NewLinesForValue() : boolean {
    return false
  }

  override property get UseCDATAForNodeContents() : boolean {
    return true // to generate XML payload in CDATA tags
  }

  override property get UseDoubleQuotes() : boolean {
    return false
  }

  override function sortAttributes(p0 : QName, p1 : List<String>) {
    //## todo: Implement me
  }
}