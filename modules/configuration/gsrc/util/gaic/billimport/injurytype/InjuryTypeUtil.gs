package util.gaic.billimport.injurytype
uses java.util.ArrayList
uses util.gaic.billimport.injurytype.InjuryTypePriority
uses java.util.Collections
uses util.gaic.billimport.injurytype.InjuryTypeComparator
uses java.math.BigDecimal

class InjuryTypeUtil {

  construct() {}
  
  
  static function getInjuryType(claim : Claim) : WCInjuryTypeExt{
    try{
      var priorities = new ArrayList<InjuryTypePriority>()
      
      getReserveCandidates(claim, priorities)
                                                                        
      if(!priorities.HasElements){ //small optimization when you already have all needed candidates
        getPaymentCandidates(claim, priorities)
      }
      
      if(priorities.HasElements){    
        Collections.sort(priorities, new InjuryTypeComparator())
        return priorities[0].Transaction.WCInjuryTypeExt
      }
    }catch(ex){
      //catch any exceptions so at least the other parts of the check can go through
      gw.api.util.Logger.logInfo("Unable to determine injury type for claim: " + claim.ClaimNumber)
      gw.api.util.Logger.logInfo(ex.StackTraceAsString)
    }
    
    //default
    return WCInjuryTypeExt.TC_MEDICALONLY
  }
  
  
  static function getReserveCandidates(claim : Claim, priorities : List<InjuryTypePriority>){
    
    var candidates = (claim.getReservesIterator(false).toList() as List<Reserve>)
        .where(\ r -> r.WCInjuryTypeExt != null &&
                      r.Status == TransactionStatus.TC_SUBMITTED &&
                      gw.api.financials.FinancialsCalculationUtil.getOpenReserves().getAmount(r.ReserveLine) > 0 &&
                      (r.Exposure.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS || r.Exposure.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS))
                      
    for(res in candidates){
      var existingPriorityUpdated = false
      
      //look for any priorities which have already been added, that should be superceded by another
      //due to having a more recent create time
      for(r in priorities.where(\ i -> i.Priority.TransType == res.Subtype &&
                                       i.Priority.ExpoType == res.Exposure.ExposureType&&
                                       i.Priority.CostType == res.CostType)){
                                
        if(res.CreateTime > r.Transaction.CreateTime){
          r.Transaction = res
          existingPriorityUpdated = true 
        }
      }
      
      if(!existingPriorityUpdated){
        priorities.add(new InjuryTypePriority(res)) 
      }
    }
  }
  
  
  static function getPaymentCandidates(claim : Claim, priorities : List<InjuryTypePriority>){
    
    var candidates = (claim.getPaymentsIterator(false).toList() as List<Payment>)
        .where(\ p -> p.WCInjuryTypeExt != null && 
                      p.Status == TransactionStatus.TC_SUBMITTED &&
                      p.Amount > BigDecimal.ZERO && //keep transferred payments out of the candidates
                     (p.Exposure.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS || p.Exposure.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS))
                     
    for(pay in candidates){      
      var existingPriorityUpdated = false   
      
      //look for any priorities which have already been added, that should be superceded by another 
      //due to having a more recent create time            
      for(p in priorities.where(\ i -> i.Priority.TransType == pay.Subtype &&
                                       i.Priority.ExpoType == pay.Exposure.ExposureType &&
                                       i.Priority.CostType == pay.CostType)){
      
        if(pay.CreateTime > p.Transaction.CreateTime){
          p.Transaction = pay
          existingPriorityUpdated = true
        }
      }
      
      if(!existingPriorityUpdated){
        priorities.add(new InjuryTypePriority(pay))                                  
      }
    }    
  }

}
