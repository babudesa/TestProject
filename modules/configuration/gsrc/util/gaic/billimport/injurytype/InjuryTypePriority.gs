package util.gaic.billimport.injurytype
uses typekey.Transaction
uses entity.Exposure
uses entity.Transaction
uses typekey.ExposureType
uses util.gaic.billimport.injurytype.InjuryTypePriority.WCInjuryTypePriority
uses typekey.CostType
uses java.util.Date

class InjuryTypePriority {

  public enum WCInjuryTypePriority{
    //the order in which these are declared is vital to how this works
    MEDICAL_LOSS_RES(ExposureType.TC_WC_MEDICAL_DETAILS, CostType.TC_CLAIMCOST, typekey.Transaction.TC_RESERVE),
    MEDICAL_EXP_RES(ExposureType.TC_WC_MEDICAL_DETAILS, CostType.TC_EXPENSE, typekey.Transaction.TC_RESERVE),
    INDEMNITY_LOSS_RES(ExposureType.TC_WC_INDEMNITY_TIMELOSS, CostType.TC_CLAIMCOST, typekey.Transaction.TC_RESERVE),
    INDEMNITY_EXP_RES(ExposureType.TC_WC_INDEMNITY_TIMELOSS, CostType.TC_EXPENSE, typekey.Transaction.TC_RESERVE),
    MEDICAL_LOSS_PAY(ExposureType.TC_WC_MEDICAL_DETAILS, CostType.TC_CLAIMCOST, typekey.Transaction.TC_PAYMENT),
    MEDICAL_EXP_PAY(ExposureType.TC_WC_MEDICAL_DETAILS, CostType.TC_EXPENSE, typekey.Transaction.TC_PAYMENT),
    INDEMNITY_LOSS_PAY(ExposureType.TC_WC_INDEMNITY_TIMELOSS, CostType.TC_CLAIMCOST, typekey.Transaction.TC_PAYMENT),
    INDEMNITY_EXP_PAY(ExposureType.TC_WC_INDEMNITY_TIMELOSS, CostType.TC_EXPENSE, typekey.Transaction.TC_PAYMENT)
    
    private var _expoType : ExposureType as ExpoType
    private var _costType : CostType as CostType
    private var _transactionType : typekey.Transaction as TransType
    
    private construct(eType : ExposureType, cType : CostType, tType : typekey.Transaction){
      _expoType = eType 
      _costType = cType
      _transactionType = tType
    }
  }
  
  private var _trans : Transaction as Transaction
  private var _wcInjuryTypePriority : WCInjuryTypePriority as Priority
  
  construct(trans : Transaction) {
    _trans = trans
    _wcInjuryTypePriority = WCInjuryTypePriority.AllValues.where(\ w -> w.ExpoType == _trans.Exposure.ExposureType &&
                                                                        w.CostType == _trans.CostType &&
                                                                        w.TransType == _trans.Subtype).first()
  }
  
  /**
   * Returns the RptCreateDateExt if it isn't null, otherwise returns CreateTime.
   * RptCreateDateExt is preferable, since Converted transactions often have identical CreateTime values.
   */
  property get TransactionCreateTime() : Date {
    if(_trans.RptCreateDateExt != null){
      return _trans.RptCreateDateExt 
    }else{
      return _trans.CreateTime 
    }
  }
}
