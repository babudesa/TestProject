package util.financials;
uses java.util.ArrayList
/** Sets up the Recovery Summary list for use in the Create Recoveries screen of ClaimCenter **/
class RecoverySummary
{
  private var transSet : Transaction
  private var recoverySummary : RecoverySummaryList[]
  
  construct(tSet : Transaction)
  {
    transSet = tSet;
    createArray()
  }
  
  private function createArray(){
   var recList : List = new ArrayList();
   var costCat : List;
   
   //Loop through all the type keys for CostCategory
   for(key in CostCategory.getTypeKeys(false)){
     //Only interested in cost categories that are OTHER than Cost Category (unspecified)
     if(key != "unspecified"){
       //reset the costCat variable
       costCat = new ArrayList()
       //Loop through all Transactions on this claim
       for(trans in transSet.Claim.TransactionsQuery.iterator()){
         //If the transaction is a recovery and or a recovery estimate
         if((trans as TransactionView).Transaction.Subtype == "Recovery" or (trans as TransactionView).Transaction.Subtype == "RecoveryReserve"){
           //If the transaction reserve line's cost category matches the current key add this transaction to the costCat list
           if((trans as TransactionView).Transaction.ReserveLine.CostCategory == key){
             costCat.add((trans as TransactionView).Transaction.ReserveLine)
           }
         }
       }
       //If the costCat list wasn't empty after the previous loop, add all the unique line items that processList() comes up with to the
       //recList variable
       if(!costCat.isEmpty()){
         recList.addAll(processList(costCat))
       }
     }
   }
   
   if(!recList.isEmpty()){
     while(recList.contains( null )){
       recList.remove(null)
     }
   }

   recoverySummary = recList as RecoverySummaryList[]
  }
  
  //Returns the value of recoverySummary
  public property get recoveryList() : RecoverySummaryList[]{
    return recoverySummary;
  }
  
  
  private function processList(costCatList : List) : List{
    var tempSum : RecoverySummaryList
    var tempList : List = new ArrayList()
    
    do{
      var resLine : ReserveLine = (costCatList.get(0) as ReserveLine)
     
      tempSum = addToList(resLine.CostCategory, resLine)
     
      do{
         costCatList.remove(resLine)
      }while(costCatList.contains(resLine))
     
      tempList.add(tempSum)
    }while(!costCatList.isEmpty())
    
    return tempList
  }
  
  private function addToList(recCat : CostCategory, resLine : ReserveLine) : RecoverySummaryList{
    var retRecoverySummary : RecoverySummaryList;
    var totalEstimate : double = 0;
    var totalReceipts : double = 0;
    var costCategoryString : String;
    var costTypeString : String;
    var exposureString : String;
    
    totalEstimate = calcEstimate(recCat, resLine);
    totalReceipts = calcReceipts(recCat, resLine);
     
    totalEstimate = totalEstimate - totalReceipts;
    
    if(totalEstimate < 0){
      totalEstimate = 0;
    }
    
    costTypeString = createCostType(resLine);
    costCategoryString = org.apache.commons.lang.WordUtils.capitalize( recCat.DisplayName);
    exposureString = resLine.Exposure.DisplayName; 
     
    if(totalEstimate != 0 or totalReceipts != 0){
      retRecoverySummary = new RecoverySummaryList(costCategoryString, exposureString, costTypeString, totalEstimate, totalReceipts);
      return retRecoverySummary;
    }else{
      return null;
    }
  }
  
  private function calcEstimate(recCat : CostCategory, resLine : ReserveLine) : double{
    var estimate : double = 0;
    for(recEst in (transSet.Claim.RecoveryReservesQuery.iterator())){
      if((recEst as RecoveryReserveView).Transaction.ReserveLine.CostCategory == recCat 
          and resLine.CostType == (recEst as RecoveryReserveView).Transaction.ReserveLine.CostType
          and resLine.Exposure == (recEst as RecoveryReserveView).Transaction.ReserveLine.Exposure){
        estimate =  estimate + (recEst as RecoveryReserveView).Amount.Amount as double;
      }
    }
    
    return estimate;
  }
  
  private function calcReceipts(recCat : CostCategory, resLine : ReserveLine) : double{
    var receipt : double = 0;
    for(recEst in (transSet.Claim.RecoveriesQuery.iterator())){
      if((recEst as RecoveryView).Transaction.ReserveLine.CostCategory == recCat 
          and resLine.CostType == (recEst as RecoveryView).Transaction.ReserveLine.CostType
          and resLine.Exposure == (recEst as RecoveryView).Transaction.ReserveLine.Exposure){
        receipt =  receipt + (recEst as RecoveryView).Amount.Amount as double;
      }
    }
    return receipt;
  }
  
  private function createCostType(resLine : ReserveLine) : String{    
    return resLine.CostType.DisplayName
  }
}
