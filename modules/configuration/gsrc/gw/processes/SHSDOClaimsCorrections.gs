package gw.processes
uses gw.transaction.Transaction
uses gw.processes.BatchProcessBase
uses java.util.GregorianCalendar
uses java.lang.System
uses java.lang.String
uses java.util.Date
uses java.text.SimpleDateFormat
uses java.text.DecimalFormat
uses java.util.Date
uses java.io.FileReader
uses java.io.BufferedReader
uses java.util.HashMap
uses gw.processes.ClaimsRptgCoreProc
uses com.gaic.claims.env.Environment

class SHSDOClaimsCorrections extends BatchProcessBase {

  construct(batchProcessType : BatchProcessBase) {
    this(batchProcessType)
  }
  
  construct() {
    super(BatchProcessType.TC_SHSDOCLAIMSRPTGCORRECTIONS)
    gw.api.util.Logger.logInfo("SHSDOClaimsReporting.gs called")
  }
  
 Override function doWork(): void {
   Transaction.runWithNewBundle(\ bundle -> SHSDOClaimsDataExtract(), "su")
 }
 
  public function SHSDOClaimsDataExtract(): void{
      var env = Environment.getInstance()
     var df = new DecimalFormat("#.00")
     var dateFormat =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ssss.mmm")
     
     var rejectedTranClmNbrFile = "rejectedTranClmNbrs.txt"
     var rejectedTranClmNbrFileNameIncPath = ""
     if (env <> Environment.LOCAL) {
       rejectedTranClmNbrFileNameIncPath = "/app/tomcat/tomcat-cccore/apache-tomcat-6.0.30/temp/"
     }
     else {
       rejectedTranClmNbrFileNameIncPath = "c:/work/"
     }
     var fixStartDate = ""
     var line = ""
     var runType = ""
     var runDate = ""
     var clmMap = new HashMap()
     try {
           var fr = new FileReader(rejectedTranClmNbrFileNameIncPath + rejectedTranClmNbrFile)
           var br = new BufferedReader(fr)
           if (br <> null) {
             line = br.readLine()
             fixStartDate = line.substring(0,10)
             runDate = fixStartDate
             fixStartDate = fixStartDate + " 01:01:01.001"
             print("Start date of correction run: " + fixStartDate)
             var str_line = br.readLine()
             if (str_line <> null) {
                print("Error Correction Run with Specific Claims")
                runType = "Claim"
                while (str_line != null)
                {
                    str_line = str_line.trim();
                    if ((str_line.length()!=0)) 
                    {
                      clmMap.put(str_line.substring(0,9), str_line)
                    }  
                    str_line = br.readLine()
                }
                br.close()
             }
             else {
               print("Error Correction Run")
               runType = "Rerun"
             }
           }
           else {
             print("Corrections File is Empty; Run Terminating without Send")
             return
           }
     }catch(e){
       print("Corrections File is Empty; Run Terminating without Send")
       return
     }
     
     var lastRunTran = dateFormat.parse("1900-01-01 01:01:0001.001")
     lastRunTran = fixStartDate as java.util.Date
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

     var monthStr = String.valueOf(month)
     if (month < 10) {
       monthStr = "0" + monthStr
     }
     
     var dayStr = String.valueOf(day)
     if (day < 10) {
       dayStr = "0" + dayStr
     }
     
     var date = new Date()
     
     var clmsRptgCoreProc = new ClaimsRptgCoreProc()
     //Parameters set for each new LOB:
     var lobPrefix = "SHSDO"
     var lobCode = LOBCode.TC_SPECIALHUMSERV
     //end parms
     
     clmsRptgCoreProc.ClaimsDataProcess(runType, clmMap, lastRunTran, lobPrefix, runDate, lobCode)
  }
}
