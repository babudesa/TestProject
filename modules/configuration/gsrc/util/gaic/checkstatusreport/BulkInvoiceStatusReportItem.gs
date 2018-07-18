package util.gaic.checkstatusreport
uses java.util.Date
uses java.text.NumberFormat
uses java.math.BigDecimal

class BulkInvoiceStatusReportItem{
  
  private var _condition : SuspectCheckCondition as Condition
  private var _invoiceNumber : String as InvoiceNumber
  private var _invoiceType : BulkInvoiceType as InvoiceType
  private var _checkNumber : String as CheckNumber
  private var _netAmount : BigDecimal
  private var _createUserPublicID : String
  private var _createUser : User
  private var _createTime : Date as CreateTime
  private var _payeePublicID : String

  construct(triggerCondition : SuspectCheckCondition, invoiceNum : String, bulkInvoiceType : BulkInvoiceType, checkNum : String, netAmt : BigDecimal, createUserPubID : String, binCreateTime : Date, payee : String) {
    _condition = triggerCondition
    _invoiceNumber = invoiceNum
    _invoiceType = bulkInvoiceType
    _checkNumber = checkNum
    _netAmount = netAmt
    _createUserPublicID = createUserPubID
    _createTime = binCreateTime
    _payeePublicID = payee
    _createUser = User(_createUserPublicID)
  }
  
  property get CreateUserName() : String{
    return getUserContactFullName(_createUser.Contact) 
  }
  
  property get PayeeName() : String{
    return Contact(_payeePublicID).DisplayName
  }
  
  property get NetAmount() : String{
    if(_netAmount != null){
      return NumberFormat.getCurrencyInstance().format(_netAmount) 
    }
    return ""
  }
  
  private function getUserContactFullName(aPerson : UserContact) : String{
    var name = ""
    name += aPerson.FirstName != null ? aPerson.FirstName : ""
    name += aPerson.MiddleName != null ? " " + aPerson.MiddleName : ""
    name += aPerson.LastName != null ? " " + aPerson.LastName : ""   
    
    return name
  }

}
