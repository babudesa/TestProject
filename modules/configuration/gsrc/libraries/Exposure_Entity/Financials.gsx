package libraries.Exposure_Entity

enhancement Financials : entity.Exposure {
  function hasFinancials() : Boolean{
    if(!this.TransactionsQuery.Empty){
      return true; 
    }
    return false;
  }
  
  property get HasLossPayment() : boolean{
    return this.getTransactionsIterator(false).toList()
      .where(\ trans : Transaction -> (typeof trans == Payment) && trans.CostType == CostType.TC_CLAIMCOST).Count > 0
  }
  
  property get HasPartialLossPayment() : boolean{
    return this.getTransactionsIterator(false).toList()
      .where(\ trans : Transaction -> (typeof trans == Payment) && 
                                       trans.CostType == CostType.TC_CLAIMCOST &&
                                       (trans as Payment).PaymentType == PaymentType.TC_PARTIAL).Count > 0  
  }
  
  property get HasOnlySupplementalLoss() : boolean{
    var suppLossCount = this.getTransactionsIterator(false).toList()
        .where(\ trans : Transaction -> (typeof trans == Payment) &&
                                         trans.CostType == CostType.TC_CLAIMCOST &&
                                         (trans as Payment).PaymentType == PaymentType.TC_SUPPLEMENT).Count
                                         
    var lossCount = this.getTransactionsIterator(false).toList()
        .where(\ trans : Transaction -> (typeof trans == Payment) &&
                                         trans.CostType == CostType.TC_CLAIMCOST).Count
                                         
    return suppLossCount != 0 && suppLossCount == lossCount                                                                                        
  }
  
  property get HasExpensePayment() : boolean{
    return this.getTransactionsIterator(false).toList()
      .where(\ trans : Transaction -> (typeof trans == Payment) && trans.CostType == CostType.TC_EXPENSE).Count > 0    
  }

  public function createNewReserveSet(costType:String, category:String, amount:java.math.BigDecimal) {
  
    var TransSetx = new ReserveSet(this.Claim);
    var Transx = new Reserve(this);
    var TransxLI = new TransactionLineItem(Transx);
  
    TransSetx.Claim = this.Claim;
    Transx.Claim = this.Claim;
    Transx.Exposure = this;
  
    Transx.CostType = costType;
    Transx.CostCategory = category;
    Transx.Status = "submitting";
    Transx.RptCreateDateExt = gw.api.util.DateUtil.currentDate();
  
    //TransxLI.Amount = amount;
    Transx.addToLineItems( TransxLI );
    TransSetx.RequestingUser = this.Claim.AssignedUser;
    TransSetx.addToReserves( Transx )
  }

  public function createNewReserveSet(costType:String, category:String, amount:java.math.BigDecimal,factorreserve:boolean) {
  
    var TransSetx = new ReserveSet(this.Claim);
    var Transx = new Reserve(this);
    var TransxLI = new TransactionLineItem(Transx);
  
    TransSetx.Claim = this.Claim;
    Transx.Claim = this.Claim;
    Transx.Exposure = this;
  
    Transx.CostType = costType;
    Transx.CostCategory = category;
    Transx.Status = "submitting";
    Transx.FactorReserveExt = factorreserve;
    Transx.RptCreateDateExt = gw.api.util.DateUtil.currentDate();
  
    //TransxLI.Amount = amount;
    Transx.addToLineItems( TransxLI );
    TransSetx.RequestingUser = this.Claim.AssignedUser;
    TransSetx.addToReserves( Transx )
  }
  
  function getPaidPayments(costType : CostType, costCat : CostCategory):double{
  // var amount = 0.0
    var payments = 0.0
    for(payment in this.PaymentsQuery.iterator()){
      if((payment as PaymentView).CostType == costType and (payment as PaymentView).CostCategory == costCat and (payment as PaymentView).PaymentType != "supplement" and !(payment as PaymentView).Transaction.NotApproved){
        payments = payments + (payment as PaymentView).Amount.Amount as double 
      }
    }
    return payments
  }

  function getAvailableReserves(costType : CostType, costCat : CostCategory) : double{
    var amount = 0.0
    var payments = 0.0
    for(reserve in this.ReservesQuery.iterator()){
      if((reserve as ReserveView).CostType == costType and (reserve as ReserveView).CostCategory == costCat and !(reserve as ReserveView).Transaction.NotApproved){
        amount = amount + (reserve as ReserveView).Amount.Amount as double
      }
    }
    for(payment in this.PaymentsQuery.iterator()){
      if((payment as PaymentView).CostType == costType and (payment as PaymentView).CostCategory == costCat and (payment as PaymentView).PaymentType != "supplement" and !(payment as PaymentView).Transaction.NotApproved){
        payments = payments + (payment as PaymentView).Amount.Amount as double 
      }
    }
    if(payments > amount){
      return 0;
    }else{
      return amount - payments;
    }
  }
  public function getCoverageLimit():int{
    for(limit in this.Coverage.CoverageBasisLimitsExt){
      if(limit.CoverageLimitTypeExt.Code!=null and this.CoverageSubType.Code!=null){
        if(limit.CoverageLimitTypeExt.Code.compareTo("coveragea") == 0 and this.CoverageSubType.Code.compareTo("ab_FPAD_dwell") == 0){
          return limit.LimitAmountExt as int;
        }
        else if(limit.CoverageLimitTypeExt.Code.compareTo("coverageb") == 0 and this.CoverageSubType.Code.compareTo("ab_FPAD_struc") == 0){
          return limit.LimitAmountExt as int;  
        }
        else if(limit.CoverageLimitTypeExt.Code.compareTo("coveragec") == 0 and this.CoverageSubType.Code.compareTo("ab_FPAD_hpp") == 0){
          return limit.LimitAmountExt as int;  
        }
        else if(limit.CoverageLimitTypeExt.Code.compareTo("coveraged") == 0 and this.CoverageSubType.Code.compareTo("ab_FPAD_lou") == 0){
          return limit.LimitAmountExt as int;  
        }  
      }
    }
    return 0  
  }
}
