package gw.entity
uses gw.api.financials.CurrencyAmount
uses java.math.BigDecimal

@Export
enhancement GWSubroAdversePartyEnhancement : entity.SubroAdverseParty
{

  function getTotAmountRecoveredForParty() : CurrencyAmount {
    var TotAmountRec = this.Claim.getRecoveriesIterator( false /*newAndModifiedOnly*/ )
                           .toList().sumCurrencyAmount( \ t -> {
                                                                     if ((this.AdverseParty.PublicID == (t as Recovery).Payer.PublicID) 
                                                                         and  (t as Recovery).Status != "draft") {
                                                                       return (t as Transaction).ClaimAmount
                                                                     } else {
                                                                       return null
                                                                     }
                                                                   })
    
    return (TotAmountRec == null) ? CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency ) : TotAmountRec
  }


  function getTotClaimCostSubroRecoveryForParty() : CurrencyAmount {
    var TotAmountRec = this.Claim.getRecoveriesIterator( false /*newAndModifiedOnly*/ )
                           .toList().sumCurrencyAmount( \ t -> {
                                                                     if ((this.AdverseParty.PublicID == (t as Recovery).Payer.PublicID) 
                                                                         and (t as Recovery).Status != "draft"
                                                                         and (t as Recovery).CostType == "claimcost"
                                                                         and (t as Recovery).RecoveryCategory =="subro") {
                                                                       return (t as Transaction).ClaimAmount
                                                                     } else {
                                                                       return null
                                                                     }
                                                                   })

    return (TotAmountRec == null) ? CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency ) : TotAmountRec
  }


  function TotPromissoryAmount() : CurrencyAmount {
     
    var TotCalculatedAmount = this.ScheduledPayments.toList()
                                  .sumCurrencyAmount( \ s -> s.SubroInstallmentAmount )

    return (TotCalculatedAmount == null) ? CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency ) : TotCalculatedAmount
  }


  function PromissoryAmountDueAsOf() : CurrencyAmount {
    //Calculates total amount of estimated payments
    var TotCalculatedAmount = this.ScheduledPayments.toList()
                                  .sumCurrencyAmount( \ s -> {
                                                               if (s.PaymentExpDate  < gw.api.util.DateUtil.currentDate()) {
                                                                 return s.SubroInstallmentAmount 
                                                               } else {
                                                                 return null
                                                               }
                                                             } )
                                                             
    return (TotCalculatedAmount == null) ? CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency ) : TotCalculatedAmount

  }

}
