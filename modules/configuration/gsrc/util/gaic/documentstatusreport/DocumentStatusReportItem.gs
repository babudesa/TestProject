package util.gaic.documentstatusreport

// variables for DocumentStatusReport.gst form 
class DocumentStatusReportItem {
  private var _claimNumber : String as ClaimNumber
  private var _name : String as DocumentName
  private var _ecfId : String as ECFID
  private var _author : String as Author
  private var _createTime : String as CreateTime
  private var _numberOfDocs : int as Unprocessed
  private var _centralPrint : String as CentralPrint
  private var _centralPrintCanceled : String as CentralPrintCancel
  private var _centralPrintSuccessful : String as CentralPrintSuccess
  
  construct(doc:Document, numOfDocs : int, CP:String, CPCanceled:String, CPSuccessful:String){
    _claimNumber = doc.Claim.ClaimNumber
    _name = doc.Name
    _ecfId = doc.ECFIDExt
    _author = doc.Author
    _createTime = gw.api.util.StringUtil.formatDate(doc.CreateTime, "yyyy-MM-dd HH:mm:ss")
    _numberOfDocs = numOfDocs
    _centralPrint = CP
    _centralPrintCanceled = CPCanceled
    _centralPrintSuccessful = CPSuccessful
  }
}