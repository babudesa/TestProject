package util.gaic.test;
uses com.gaic.integration.cc.plugins.PSARPluginTesterTool;
uses com.gaic.integration.cc.plugins.PSARTestAndResult;
uses java.util.ArrayList
uses gw.api.util.Logger

class TestPlugins {
  private static var testerTool : PSARPluginTesterTool = new PSARPluginTesterTool();
  private static var logger = Logger.forCategory("Plugin.IPolicySearchAdapter")

  public static function testPSARPlugin2() : PSARTestCase[] {
    var returnList = new ArrayList();
    try {
      var list : java.util.List<PSARTestAndResult> = testerTool.getTestCaseAndResults();
      for (item in list) {
        var tc = new PSARTestCase((item.Id as String), item.getDescription(), item.getThreshold() as String,
            item.getTestResults());
        returnList.add(tc);
      }
    } catch (e) {
      logger.error("[TestPlugins] - " + e.StackTraceAsString);
    }
    return returnList.toArray() as PSARTestCase[]
  }

  public static function executeTestCases(){
    try {
      testerTool.executeTestCases();
    } catch (e){
      logger.error("[TestPlugins] - " + e.StackTraceAsString);
    }
  }

  public static function executeTestCase(policyID : int) {
    try {
      testerTool.executeTestCase(policyID);
    } catch (e){
      logger.error("[TestPlugins] - " + e.StackTraceAsString);
    }
  }
}