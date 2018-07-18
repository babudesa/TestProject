package gaic.plugin.cc.businessunit
uses gaic.plugin.cc.abstract.AbstractCustomBatch
uses gw.api.database.Query
uses java.util.ArrayList
uses java.lang.StringBuilder
uses com.gaic.integration.cc.plugins.gscript.prm.PRMProducer
uses gw.api.util.Logger

class SyncGAIBusinessUnitsBatch extends AbstractCustomBatch {

  construct() {
    super(BatchProcessType.TC_SYNCGAIBUSINESSUNITS);
  }

  override function doIt() {
    var user = "batchsu";
    var prm = new PRMProducer();
    var bus = prm.BusinessUnits.partitionUniquely(\ p -> p.Id);
    
    var old = Query.make(GAIBusinessUnitExt).select().toList().partitionUniquely(\ o -> o.PRM_ID);
    
    var add = new ArrayList<String>(bus.Keys);
    add.removeAll(old.Keys);
    
    var remove = new ArrayList<String>(old.Keys);
    remove.removeAll(bus.Keys);
    
    var updates = new ArrayList<String>(old.Keys);
    updates.retainAll(bus.Keys);
    
    if (checkIfINeedToStopAndSendNotify()) return;
    
    if (!updates.Empty) {
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
        for (var u in updates) {
          var gai = old.get(u);
          var bu = bus.get(u);
          if (!bu.Name.equals(gai.Name)) {
            bundle.add(gai).Name = bu.Name;
            Logger.logInfo("Updating GAIBusinessUnit["+gai.PRM_ID+"] from "+gai.Name+" to "+bu.Name)
          }
        }
      }, user);
    }
    
    if (checkIfINeedToStopAndSendNotify()) return;
    
    if (!remove.Empty) {
      var sb = new StringBuilder();
      sb.append("The following business units have been removed from PRM. They were not removed from ClaimCenter: \r\n");
      for (var r in remove index i) {
        sb.append("\r\n");
        sb.append(r);
        sb.append(": ");
        sb.append(old.get(r).Name);
        Logger.logInfo("GAIBusinessUnit needs removed: "+r);
      }
      sendEmail("Sync GAI Business Units - Removed Business Units", sb.toString(), null);
    }
    
    if (checkIfINeedToStopAndSendNotify()) return;
    
    if (!add.Empty) {
      var sb = new StringBuilder();
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
        for (var a in add) {
          var bu = bus.get(a);
          sb.append("\r\n");
          sb.append(a);
          sb.append(": ");
          sb.append(bu.Name);
          Logger.logInfo("GAIBusinesssUnit added: "+bu.Id+", "+bu.Name);
          
          var x = new GAIBusinessUnitExt(bundle);
          x.Name = bu.Name;
          x.PRM_ID = bu.Id;
        }
      }, user);
      sendAddEmail(sb.toString());
    }
    
  }
  
  public static function sendAddEmail(body:String) {
      var sb = new StringBuilder();
      sb.append("The following business units have been added from the PRM. They need associated with the typelist that matches. \r\n");
      sb.append(body);
      sendEmail("Sync GAI Business Units - Added Business Units", sb.toString(), null);
  }

}
