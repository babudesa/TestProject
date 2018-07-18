package util.gaic.reinsurance;
uses java.math.BigDecimal;
uses com.gaic.integration.cc.plugins.reinsurance.ReinsuranceSearchAndRetrieval;
uses com.gaic.services.cededloss.CededSummaryFeatureContract;
uses java.text.DecimalFormat
uses java.util.ArrayList

class ReserveReinsuranceExtUtil {
  
  private static var rsal : ReinsuranceSearchAndRetrieval = new ReinsuranceSearchAndRetrieval();
  private var reinsContracts : CededSummaryFeatureContract[];
  
  construct(claimNumber : String) {
    reinsContracts = rsal.searchReinsContracts(claimNumber);
  }

 /* Defect 3777, 1/13/11 erawe 
     Don't believe there was an issue here, reverting file back to what was in maint before merge
     to CA. Replacing reinsContract with a variable did cause an issue with getContractName(), so
     we back all the changes out.  Now we probably need to add errorhandling too at some point
     , having issue with the throw */

  /******* Exposure Level Calculations for Reinsurance Summary Data ***/
  public function calculateReinsurancesExtTotalPaid(exposure: Exposure) : BigDecimal {
    var totalPaid: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber){
        totalPaid = totalPaid + reinsContract.TotalPaid;
      }
    }
    return totalPaid;
  }

  public function calculateReinsurancesExtCededReserveAmount(exposure: Exposure) : BigDecimal {
    var ceded: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber){
        ceded = ceded + reinsContract.OpenReserves;
      }
    }
    
    return ceded
  }

  public function calculateReinsurancesExtRecoveryReceipts(exposure: Exposure) : BigDecimal {
    var recoveryReceipts: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber){
        recoveryReceipts = recoveryReceipts + reinsContract.RecoveryReceipts;
      }
    }
    return recoveryReceipts;
  }
  
  //****** 9/7/10 erawe - for calculations on the ReserveReinsurancesExtLV screen *******/
  public function calculateReinsurancesExtTotalPaid(exposure: Exposure, costType: String) : BigDecimal {
    var totalPaid: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      var ct: String = reinsContract.FinancialLossCategory
      if(ct.equals( "claimcost" )){
        ct = "Loss"
      }
        else{
          ct = "Expense"
        }
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber and costType.equals( ct )){
        totalPaid = totalPaid + reinsContract.TotalPaid;
      }
    }
    return totalPaid;
  }
  
  public function calculateReinsurancesExtCededReserveAmount(exposure: Exposure, costType: String) : BigDecimal {
    var ceded: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      var ct: String = reinsContract.FinancialLossCategory
      if(ct.equals( "claimcost" )){
        ct = "Loss"
      }
        else{
          ct = "Expense"
        }
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber and costType.equals( ct )){
        ceded = ceded + reinsContract.OpenReserves;
      }
    }
    return ceded;
  }

  public function calculateReinsurancesExtRecoveryReceipts(exposure: Exposure,costType: String) : BigDecimal {
    var recoveryReceipts: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      var ct: String = reinsContract.FinancialLossCategory
      if(ct.equals( "claimcost" )){
        ct = "Loss"
      }
        else{
          ct = "Expense"
        }
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber and costType.equals( ct )){
        recoveryReceipts = recoveryReceipts + reinsContract.RecoveryReceipts;
      }
    }
    return recoveryReceipts;
  } 
  

  /******** Claim Level Calculations for Reinsurance GrandTotal Summary Data **********/
  public function calculateReinsurancesExtTotalPaid() : BigDecimal {
    var totalPaid: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      totalPaid = totalPaid + reinsContract.TotalPaid;
    }
    return totalPaid;
  }

  public function calculateReinsurancesExtCededReserveAmount() : BigDecimal {
    var ceded: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      ceded = ceded + reinsContract.OpenReserves;
    }
    return ceded;
  }

  public function calculateReinsurancesExtRecoveryReceipts() : BigDecimal {
    var recoveryReceipts: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      recoveryReceipts = recoveryReceipts + reinsContract.RecoveryReceipts;
    }
    return recoveryReceipts;
  }

  //9/15/10 erawe - use to retrieve contract names
  public function getContractName(exposure : Exposure, costType : String): CededSummaryFeatureContract[] {
    var list = new ArrayList()
    for (reinsContract in reinsContracts) {
      var ct: String = reinsContract.FinancialLossCategory
      if(ct.equals( "claimcost" )){
        ct = "Loss"
      }
        else{
          ct = "Expense"
        }
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber and costType.equals( ct )){
        
        list.add( reinsContract )
      }
      }
    return list.toArray() as CededSummaryFeatureContract[]
  }
  
  //9/2/10 erawe - use to retrieve costtype
  public function getCostType(exposure : Exposure): String[]{
    var hasLoss : boolean = false
    var hasExp : boolean = false
    for (reinsContract in reinsContracts) {
       if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber){
         if("claimcost" == reinsContract.FinancialLossCategory){
           hasLoss = true
         }
          else{
            hasExp = true
          }
          if(hasLoss and hasExp){
            return new String[] {"Loss", "Expense"}
          }
       }
    }
    if(hasLoss){
      return new String[] {"Loss"}
    }
    if(hasExp){
      return new String[] {"Expense"}
    }
    return null
  }
  
  // 9/17/10 function to format BigDecimal as a String for financial data
  public static function formatReinsuranceValue(valueToFormat:BigDecimal):String{
    var formatedValue:String = (new DecimalFormat("$###,####,##0.00;($-###,####,##0.00)")).format(valueToFormat)
    return formatedValue;
  }
  
//10/27/2010 function to concatenate the contract number and name
 public static function formatContractNumberAndName(contractNumber:String, contractName:String):String {
   var contractNumberAndName:String = contractNumber.concat(" - ").concat(contractName)
   return contractNumberAndName;
   }
   
}//end class
