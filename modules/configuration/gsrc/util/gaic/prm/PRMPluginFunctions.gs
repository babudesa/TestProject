package util.gaic.prm
uses java.lang.String
uses entity.ex_Agency
uses com.gaic.integration.cc.plugins.gscript.prm.PRMProducer
uses pcf.ProducerNotFoundWorksheet

class PRMPluginFunctions {

  private static var prmProducer : PRMProducer = new PRMProducer();

  construct() {
  }

  static function getProducerFromPRM(producerCode : String) : ex_Agency {
    var agncy : ex_Agency = null;
    
    try {
      if(producerCode != null) {
        agncy = prmProducer.findProducer(producerCode);
      }
    }
    catch(e) {
      ProducerNotFoundWorksheet.goInWorkspace();
    }
  
    return agncy;
  }
}
