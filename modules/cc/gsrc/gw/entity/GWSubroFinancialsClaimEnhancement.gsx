package gw.entity
uses gw.api.financials.FinancialsCalculationUtil
uses gw.api.util.Logger
uses gw.api.financials.CurrencyAmount
uses java.math.BigDecimal
uses gw.api.util.CurrencyUtil

@Export
enhancement GWSubroFinancialsClaimEnhancement : entity.Claim
{
  function ReserveLinesforClaimCost() : ReserveLine[]{

    var list = new java.util.ArrayList()

      for (aline in this.ReserveLines) {
        if (aline.CostType=="claimcost") {
            list.add(aline)
          }
      }

    return list as ReserveLine[]
  }

  function getClaimNetPaidExcludingSubroRecovery() : CurrencyAmount {
    var ClaimNetPaidExcludingSubroRecovery = this.ReserveLines.toList()
                                                 .sumCurrencyAmount( \ r -> {
                                                                              if (r.CostType =="claimcost") {
                                                                                return r.getNetPaidExcludingSubroRecovery()
                                                                              } else {
                                                                                return null
                                                                              }
                                                                            })

    return  (ClaimNetPaidExcludingSubroRecovery == null) ? CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency ) : ClaimNetPaidExcludingSubroRecovery
  }


  function AutoSetOpenRecoveryReserve(validateonly : Boolean) : String{
    //zero amount used for currencyAmount comparison
    var zero = CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency )
        
    var CalculateOSRecReserveComment : String = null

     // Note:  TotalExpectedRecovery will need to be divided by 100 to convert to a decimals
    var TotalExpectedRecoveryPercentage : Number = 0
    var CurrentRecoveredPercentage : Number = 0

    // Determine Expected Recovery  and cap at 100%

    TotalExpectedRecoveryPercentage = this.AdversePartyExpectedRecoveryPercent()


    if ( TotalExpectedRecoveryPercentage > 100)  {
       TotalExpectedRecoveryPercentage = 100
     }
    // This is acutally a percentage, therefore divide by 100

     TotalExpectedRecoveryPercentage = TotalExpectedRecoveryPercentage / 100     

    var ClaimNetPaidExcludingSubroRecovery: CurrencyAmount = CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency )
    var ClaimRecoveryforRecCatSubro: CurrencyAmount = CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency )

    var RLNetPaidExcludingSubroRecovery: CurrencyAmount = CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency )
    var RLSubroRec: CurrencyAmount = CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency )

    // Determine Net Paid (Excluding Subro Recovery) &amp; Subro Recovery for the claim

    for (eachRL in this.ReserveLines ) {
      if (eachRL.CostType =="claimcost") {
        RLNetPaidExcludingSubroRecovery = eachRL.getNetPaidExcludingSubroRecovery()
        RLSubroRec = FinancialsCalculationUtil.getTotalRecoveries().getAmount( eachRL, "subro" )
        if (RLSubroRec ==  null)
        {
          RLSubroRec = CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency )
        }
        // ClaimPaidNetNonSubroRecovery -> ClaimNetPaidExcludingSubroRecovery
        ClaimNetPaidExcludingSubroRecovery = ClaimNetPaidExcludingSubroRecovery + RLNetPaidExcludingSubroRecovery
        ClaimRecoveryforRecCatSubro  = ClaimRecoveryforRecCatSubro + RLSubroRec 
        if (RLNetPaidExcludingSubroRecovery <> zero 
            and ((RLSubroRec.divideStrict(RLNetPaidExcludingSubroRecovery, CurrencyUtil.getRoundingMode())  ) > TotalExpectedRecoveryPercentage))  //
        {

          CalculateOSRecReserveComment = displaykey.Subrogation.SetRecoveryResToExpected.RecGTExpect(TotalExpectedRecoveryPercentage * 100, eachRL.DisplayName )
          //api.util.Logger.logInfo( "Log Rule displaykey.DisplayName" + displaykey.Java.DisplayName.NewlyCreated)
          Logger.logInfo( "rlSubroRec" +  RLSubroRec)
          Logger.logInfo( "RLNetPaidExcludingSubroRecovery" +  RLNetPaidExcludingSubroRecovery)
        }
      }
    }

    if (ClaimNetPaidExcludingSubroRecovery > zero) {
      CurrentRecoveredPercentage = ClaimRecoveryforRecCatSubro.divideStrict(ClaimNetPaidExcludingSubroRecovery, CurrencyUtil.getRoundingMode())
    } else {
      CalculateOSRecReserveComment = displaykey.Subrogation.SetRecoveryResToExpected.ZeroNetPaid
    }
    if ((ClaimNetPaidExcludingSubroRecovery * TotalExpectedRecoveryPercentage)== (ClaimRecoveryforRecCatSubro+FinancialsCalculationUtil.getOpenRecoveryReserves().getAmount(this, CostType.TC_CLAIMCOST).Amount)) {
      CalculateOSRecReserveComment = displaykey.Subrogation.SetRecoveryResToExpected.EqualsExpected
    }

    if ((Not validateonly) and (CalculateOSRecReserveComment == Null)) {
      var AmountofOpenRecoveryReserveNeededForRL : CurrencyAmount = CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency )

      // Set the recovery
      for (eachRL in this.ReserveLines ) {
        if (eachRL.CostType =="claimcost" and (eachRL.getNetPaidExcludingSubroRecovery() > zero or FinancialsCalculationUtil.getOpenRecoveryReserves().getAmount( eachRL ) > zero)){
          RLNetPaidExcludingSubroRecovery = eachRL.getNetPaidExcludingSubroRecovery()
          RLSubroRec = FinancialsCalculationUtil.getTotalRecoveries().getAmount( eachRL, "subro" )
          if (RLSubroRec == Null) {
            RLSubroRec = CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency )
          }
          if (RLNetPaidExcludingSubroRecovery <> zero 
              and (RLSubroRec.divideStrict(RLNetPaidExcludingSubroRecovery, CurrencyUtil.getRoundingMode())) < TotalExpectedRecoveryPercentage ) {
            AmountofOpenRecoveryReserveNeededForRL = (RLNetPaidExcludingSubroRecovery * TotalExpectedRecoveryPercentage ) - RLSubroRec
            if (AmountofOpenRecoveryReserveNeededForRL > zero) {
              eachRL.setOpenRecoveryReserves( "subro", AmountofOpenRecoveryReserveNeededForRL , User( "default_data:1" /* Super User */ ))
            }
          }

          else // Actual Recovery must equal Expected Recovery, therefore RL should have zero Outstanding Recovery Reserves
          {
            if (zero < (FinancialsCalculationUtil.getOpenRecoveryReserves().getAmount(eachRL))) {
              eachRL.setOpenRecoveryReserves( "subro", CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency ) , User( "default_data:1" /* Super User */ ))
            }
          }

        } // if(eachRL.CostType =="claimcost" ...

      } // for(eachRL in this.ReserveLines ) ...
    }  //if (Not RLActualRecoveredGreaterThanExpected

    return CalculateOSRecReserveComment
  }

  function getClaimCostsRecovSubroOnly() : CurrencyAmount {
     var ClaimRecoveryforRecCatSubro = this.ReserveLines
                                           .toList()
                                           .sumCurrencyAmount( \ r -> {
                                                                        if (r.CostType =="claimcost") {
                                                                          return FinancialsCalculationUtil.getTotalRecoveries().getAmount( r, "subro" )
                                                                        } else {
                                                                          return null
                                                                        }
                                                                      })

    return (ClaimRecoveryforRecCatSubro == null) ? CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency ) : ClaimRecoveryforRecCatSubro
  }


  function getClaimLevelRecoveriesSubroOnly(aReserveLine : ReserveLine) : CurrencyAmount
  {
     var total = this.getRecoveriesIterator( false /*newAndModifiedOnly*/ )
                     .toList().sumCurrencyAmount( \ t -> {
                                                               var rec = (t as Recovery)
                                                               if (rec.Exposure == null 
                                                                   and rec.CostType == "claimcost"
                                                                   and aReserveLine == rec.ReserveLine   
                                                                   and rec.RecoveryCategory == "subro") {
                                                                 return rec.ClaimAmount
                                                               } else {
                                                                 return null
                                                               }
                                                             } )

     return (total == null) ? CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency ) : total
  }


  function getTotAmountRecoveredByAdvParties() : CurrencyAmount
  {
    var TotAmountRec = this.SubrogationSummary.SubroAdverseParties
                           .toList().sumCurrencyAmount( \ s -> s.getTotClaimCostSubroRecoveryForParty() )
    
    return (TotAmountRec == null) ? CurrencyAmount.getStrict( BigDecimal.ZERO, this.getClaim().Currency ) : TotAmountRec
  }
}
