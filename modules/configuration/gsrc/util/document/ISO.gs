package util.document;
uses java.io.StringWriter
uses javax.xml.transform.TransformerFactory
uses javax.xml.transform.Transformer
uses javax.xml.transform.stream.StreamSource
uses javax.xml.transform.stream.StreamResult
uses java.io.File
uses javax.xml.transform.dom.DOMSource
uses java.io.StringBufferInputStream
uses javax.xml.transform.Source
uses gw.api.util.Logger //Added for logging in Debug - SR

class ISO
{
  construct()
  {
  }
  
  static function convertMatchReportTopHtml(inputString:String):String
  {
    var sw : StringWriter = new StringWriter();
  try {
	var file : File = new File("iso/Cs_Xml_Output.xsl");
	var tfactory : TransformerFactory = TransformerFactory.newInstance();
	var transformer : Transformer = tFactory.newTransformer(new StreamSource(file));
	transformer.transform(new StreamSource(new StringBufferInputStream(inputString)) as Source, new StreamResult(sw));
    } catch (e) {
      //changed to logging in Debug - SR
      Logger.logDebug("ERROR!");
    }
    
    //changed to logging in Debug - SR
    Logger.logDebug("HTML is <" + sw.toString() + ">");
    return sw.toString();

  }
}
