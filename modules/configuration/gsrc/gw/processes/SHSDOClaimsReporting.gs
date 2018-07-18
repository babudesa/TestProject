package gw.processes
uses gw.transaction.Transaction
uses gw.processes.BatchProcessBase
uses java.lang.String
uses java.text.SimpleDateFormat
uses java.util.HashMap
uses gw.processes.ClaimsRptgCoreProc
uses com.gaic.claims.env.Environment
uses java.util.GregorianCalendar

class SHSDOClaimsReporting extends BatchProcessBase {
  var env = Environment.getInstance()
  construct(batchProcessType : BatchProcessBase) {
    this(batchProcessType)
  }
  
  construct() {
    super(BatchProcessType.TC_SHSDOCLAIMSRPTGPROCESS)
    gw.api.util.Logger.logInfo("SHSDOClaimsReporting.gs called")
  }
  
 Override function doWork(): void {
   Transaction.runWithNewBundle(\ bundle -> SHSDOClaimsDataExtract(), "su")
 }
 
  public function SHSDOClaimsDataExtract(): void{

     var dateFormat =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ssss.mmm")

     var clmMap = new HashMap()

     var runType = "Full"
     print(" Full Run")
     
     var lastRunTran = dateFormat.parse("1900-01-01 01:01:0001.001")

     var processHistoryQuery = gw.api.database.Query.make(entity.ProcessHistory)
     processHistoryQuery.compare("ProcessType", Equals, BatchProcessType.TC_SHSDOCLAIMSRPTGPROCESS )
     var historyQueryResultSet = processHistoryQuery.select().orderBy(\ row -> row.CompleteDate)
     
     for (run in historyQueryResultSet){
       if (run.CompleteDate <> null and run.FailureReason == null){
         lastRunTran = run.CompleteDate
       }
     }

     print("Last Run Time: " + lastRunTran.formatDateTime(LONG, LONG))
     var lastRunSum = lastRunTran
     if (runType == "Full" or runType == "Rerun") {
       lastRunSum = lastRunTran.addDays(-2)
     }
     print("Summary Extract Date: " + lastRunSum.formatDateTime(LONG, LONG))
     var cal = new GregorianCalendar()
     var month = cal.get(cal.MONTH) + 1
     var year = cal.get(cal.YEAR)
     var day = cal.get(cal.DAY_OF_MONTH)
     var runDate = year + "-" + month + "-" + day

     var monthStr = String.valueOf(month)
     if (month < 10) {
       monthStr = "0" + monthStr
     }
     
     var dayStr = String.valueOf(day)
     if (day < 10) {
       dayStr = "0" + dayStr
     }
     var clmsRptgCoreProc = new ClaimsRptgCoreProc()
     var lobPrefix = "SHSDO"
     var lobCode = LOBCode.TC_SPECIALHUMSERV
     
     clmsRptgCoreProc.ClaimsDataProcess(runType, clmMap, lastRunTran, lobPrefix, runDate, lobCode)
  }
}