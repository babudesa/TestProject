package util.gaic.billimport.injurytype

uses util.gaic.billimport.injurytype.InjuryTypePriority.WCInjuryTypePriority
uses java.util.Comparator
uses java.lang.Integer

class InjuryTypeComparator implements Comparator<InjuryTypePriority>{

  construct() {}

  override function compare(p0 : InjuryTypePriority, p1 : InjuryTypePriority) : int {
    var priorityResult = p0.Priority.compareTo(p1.Priority)
    
    if(priorityResult == 0){
      var createTimeResult = p0.TransactionCreateTime.compareTo(p1.TransactionCreateTime)
      if(createTimeResult == 0){
        //in the unlikely event that the create times match, then try to use IDs to determine which transaction was created first
        return (p0.Transaction.ID.Value as Integer).compareTo(p1.Transaction.ID.Value as Integer)
      }
      return createTimeResult
    }
    
    return priorityResult
  }

}
