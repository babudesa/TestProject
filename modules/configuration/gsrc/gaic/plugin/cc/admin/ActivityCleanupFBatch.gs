package gaic.plugin.cc.admin
uses gw.processes.BatchProcessBase
uses java.util.Date
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.profiler.Profiler
uses com.gaic.claims.env.Environment
uses java.util.ArrayList

class ActivityCleanupFBatch extends BatchProcessBase {

  static var tag = new gw.api.profiler.ProfilerTag("ActivityCleanuFpTag1", "Activity Cleanup Financial Tag");

  construct() {
    super("ActivityCleanupF");
  }

  override function requestTermination() : boolean {
    super.requestTermination();
    return true;
  }

  override function doWork() : void {
    var frame = Profiler.push(tag);
    var limit = 1000;
    //var errors = new ArrayList();
    //do not run in prod
    //this batch should also not have a scheduled run time
    if(gw.api.system.server.ServerUtil.getEnv() != "prod") {
      try {
	var twoWeeks = (new Date()).addDays(-14);
	var approvalQry = Query.make(Activity)
	approvalQry.compare("Status", Relop.Equals, ActivityStatus.TC_OPEN)
	approvalQry.compare("TargetDate", Relop.LessThan, twoWeeks)
	approvalQry.startsWith("Subject", "Review and approve", true)
        var emailOutput : String = "Found: " + approvalQry.select().Count + "<BR>";
	print("Found: " + approvalQry.select().Count);
	var fin = 0;
	var pauseCount = 0;
	var approvals = approvalQry.select().keyIterator();
	while(approvals.hasNext() && pauseCount < limit) {
	  if (TerminateRequested) {
	    return;
	  }
	  var approval : Activity;
	  var approvalID = approvals.next();
	  try {
	    gw.transaction.Transaction.runWithNewBundle(\ b ->  {
	      approval = b.loadByKey(approvalID) as Activity;
	      approval.CloseDate = new Date();
	      approval.approve();
	    }, "batchsu");
	    fin++
	    if(pauseCount % 100 == 0){
	      try{
		java.lang.Thread.sleep(5000)
	      }catch(e){
		// we are just sleeping toss any errors
	      }
	    }
	    pauseCount++;
	  } catch (ex){
	    emailOutput =  emailOutput + "Claim: " + approval.Claim.ClaimNumber + "<BR>" +
			  "Error: " + ex.Message + "<BR>" +
			  "============<BR><BR>";
	  }
	}
	print("Updated Financial: " + fin);
        emailOutput = emailOutput + "Fixed: " + fin + "<BR>"
        util.Email.sendMail( "ClaimCenterTesting@gaig.com",
        	      Environment.getInstance() + " - " + "Financial Activites Cleanup Results",
        	      emailOutput);
      } finally {
	Profiler.pop(frame);
      }
    }
  }
}