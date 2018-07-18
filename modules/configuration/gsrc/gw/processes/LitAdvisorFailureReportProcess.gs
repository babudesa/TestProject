package gw.processes

uses java.sql.Connection
uses gw.processes.BatchProcessBase
uses com.gaic.claims.util.db.DatabaseUtil
uses util.gaic.LitAdvisorReport.LitAdvisorFailureReportItem
uses java.util.ArrayList
uses java.sql.Statement
uses java.sql.ResultSet
uses java.lang.String
uses util.gaic.LitAdvisorReport.LitAdvisorFailureReportItem
uses com.gaic.claims.env.Environment

class LitAdvisorFailureReportProcess  extends BatchProcessBase {

private var errorList = new ArrayList<LitAdvisorFailureReportItem>()
private var _env = gw.api.system.server.ServerUtil.getEnv()
private var con:Connection = null
private var _emailRecipient = (Environment.getInstance() == Environment.PROD) ? "ClaimCenterSupport@gaig.com" : "ClaimCenterTesting@gaig.com";
private static final var SELECT_RECYCLE_RECORDS = "SELECT le.ClaimNo, le.TaxID, le.MatterID, le.InvoiceNo, le.OriginalAmount,"+
                            " le.PaymentAmount, le.RecycleCount, le.ErrorMsg, le.LastUpdateTime, le.BusinessUnit, le.ReceivedTime FROM  "+
                            " LitAdvisor_external le WHERE le.RecycleCount = 3 and DATEDIFF(DAY,le.ReceivedTime,GETDATE()) > 21 "
                              
  construct() {
    super(BatchProcessType.TC_LITADVISORFAILUREREPORT)
    con = DatabaseUtil.openConnectionToExternalWithDefaultProperties();
    con.setAutoCommit(false);
  }

  override function doWork(){
    retrieveList() 
    print("Record count:"+errorList.Count)
    report()
  }

  private function retrieveList() {
    var st:Statement = null
    var rs:ResultSet = null
    try {
      st = con.createStatement()
      rs = st.executeQuery(SELECT_RECYCLE_RECORDS)      
      while (rs.next()) {
          var item = new LitAdvisorFailureReportItem()
          item.ClaimNumber = rs.getString("ClaimNo")
          item.TaxID = rs.getString("TaxID")
          item.MatterID = rs.getString("MatterID")
          item.InvoiceNumber = rs.getString("InvoiceNO")
          item.OriginalAmount= rs.getString("OriginalAmount")
          item.PaymentAmount = rs.getString("PaymentAmount")
          item.RecycleCount = rs.getInt("RecycleCount") as java.lang.String
          item.ErrorMessage = rs.getString("ErrorMsg")
          item.LastUpdateTime= rs.getDate("LastUpdateTime") as java.lang.String
          item.BusinessUnit = rs.getString("BusinessUnit")
          item.ReceivedTime = rs.getString("ReceivedTime")
          
          errorList.add(item)
      }      
    } finally {
      DatabaseUtil.closeDatabaseResources(null, st, rs)
    }
  }
  
  /**
   * convert the confirmed suspects into CheckStatusReportItems, then generate the email
   */
  private function report() {
    try{
      var body = templates.email.LitAdvisorFailureReport.renderToString(errorList)
      if(_env == "prod"){
        var emailAddys:String[] = ScriptParameters.DocumentStatusReportEmail.toString().split(",")
        for(contact in emailAddys){
          gw.api.email.EmailUtil.sendEmailWithBody(null, contact, null, "ClaimCenterSupport@gaig.com", null, this.EmailSubject, body)
        }
      }
      else{
        gw.api.email.EmailUtil.sendEmailWithBody(null, 
                                "ClaimCenterTesting@gaig.com", null, "ClaimCenterSupport@gaig.com", null, this.EmailSubject, body)
      }
 
     }catch(e){
      util.Email.sendMail(_emailRecipient, 
                                "LitAdvisor Recycled Errored Report Failed Operations", 
                                OperationsFailed + " operations failed to generate LitAdvisor Recycled Errored Report.  Check logs for details.")       
      throw e 
    }
  } //end report
  
  private property get EmailSubject() : String{
    return "Report of aged(>21days) recycle records" + (_env == "prod" ? "" : (" - " + _env))
  }
}
