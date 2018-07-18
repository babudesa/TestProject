package gaic.plugin.cc.admin
uses gw.processes.BatchProcessBase
uses java.util.Date
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.profiler.Profiler

class ActivityCleanupNFBatch extends BatchProcessBase {
  
  static var tag = new gw.api.profiler.ProfilerTag("ActivityNFCleanupTag1", "Activity Non-Financial Cleanup Tag");

  construct() {
    super("ActivityCleanupNF");
  }

  override function requestTermination() : boolean {
    super.requestTermination();
    return true;
  }
  
  override function doWork() : void {
    var frame = Profiler.push(tag);
    var limit = 1000;
    //do not run in prod
    //this batch should also not have a scheduled run time
    if(gw.api.system.server.ServerUtil.getEnv() != "prod") {
      try {
        var twoWeeks = (new Date()).addDays(-14);
        var approvalQry = Query.make(Activity)
        approvalQry.compare("Status", Relop.Equals, ActivityStatus.TC_OPEN)
        approvalQry.compare("TargetDate", Relop.LessThan, twoWeeks)
        approvalQry.subselect("ID", CompareNotIn, Activity, "id").startsWith("Subject", "review and approve", true)
        
        print("Found: " + approvalQry.select().Count);
        var nfin = 0;
        var pauseCount = 0;
        var approvals = approvalQry.select().keyIterator()
        while(approvals.hasNext() && pauseCount < limit) {
          if (TerminateRequested) {
            return;
          }
          var approvalID = approvals.next();
          var approval : Activity;
          try {
            gw.transaction.Transaction.runWithNewBundle(\ b ->  {            
              approval = b.loadByKey(approvalID) as Activity;
              approval.CloseDate = new Date();
              approval.complete();
            }, "su");
            nfin++;
            if(pauseCount % 100 == 0){
              try{
                java.lang.Thread.sleep(5000);
              }catch(e){
                // we are just sleeping toss any errors
              }            
            }          
            pauseCount++;
          } catch (ex){
            print("Claim: " + approval.Claim.ClaimNumber)
            print("Error: " + ex.Message);
            print(" Type: Non-Financial");
            print("============")    
          }
        }
        print("Found Non-Financial: " + nfin);
      } finally {
        Profiler.pop(frame);
      }
    }
  }
}
