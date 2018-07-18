package util.gaic.checkstatusreport
uses util.gaic.checkstatusreport.SuspectCheckCondition
uses java.util.Date
uses java.text.NumberFormat
uses java.math.BigDecimal

class CheckStatusReportItem {
  
  private var _claimPublicID : String
  private var _businessLine : String as BusinessLine
  private var _claimGroupName : String as AssignedClaimGroup
  private var _claimNumber : String as ClaimNumber
  private var _checkNumber : String as CheckNumber
  private var _adjusterPublicID : String
  private var _checkPublicID : String
  protected var _condition : SuspectCheckCondition as Condition
  private var _adjuster : User
  private var _createTime : Date as CreateTime
  
  construct(claimPublicID : String, claimGroupName : String, claimNum : String, checkNum : String, adjusterPublicID : String, checkPublicID : String, triggerCondition : SuspectCheckCondition, checkCreateTime : Date){
    _claimPublicID = claimPublicID
    _claimGroupName = claimGroupName
    _claimNumber = claimNum
    _checkNumber = checkNum
    _adjusterPublicID = adjusterPublicID
    _checkPublicID = checkPublicID
    _condition = triggerCondition
    _adjuster = User(_adjusterPublicID)
    _businessLine = util.custom_Ext.OfficeBranchFunctions.getClaimOfficeBranch(Claim(_claimPublicID))
    _createTime = checkCreateTime
  }
  
  property get NetAmount() : BigDecimal{
    return Check(_checkPublicID).NetAmount.Amount
  }
  
  property get CheckTotal() : String{
    var amt = NetAmount
    if(amt != null){
      return NumberFormat.getCurrencyInstance().format(amt) 
    }
    return ""
  }
  
  property get AdjusterName() : String{    
    return getUserContactFullName(_adjuster.Contact)
  }
  
  property get AdjusterSupervisor() : String{
    return getUserContactFullName(util.user.GroupsHelper.getDirectSupervisor(_adjuster).Contact)
  }
  
  private function getUserContactFullName(aPerson : UserContact) : String{
    var name = ""
    name += aPerson.FirstName != null ? aPerson.FirstName : ""
    name += aPerson.MiddleName != null ? " " + aPerson.MiddleName : ""
    name += aPerson.LastName != null ? " " + aPerson.LastName : ""   
    
    return name
  }
}
