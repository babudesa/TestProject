package libraries.Claim_Entity

enhancement ClaimTransactionsEnhancement : entity.Claim {
  
  function getAllTransactions():Transaction[]{
    //var transList:List = new ArrayList()
    var transQuery = gw.api.database.Query.make(Transaction)
    transQuery.compare("Claim", Equals, this);
    var transResultSet = transQuery.select()
    
    //for(trans in transResultSet.){
    //    transList.add(trans)
    //}
    
    return transResultSet.toTypedArray();
  }
  
   function CheckExposureClaimAssist(reserveLimit : int):boolean{
   /*****************************************************************************************************
   *Cycles through all the features on a claim and adds up all the reserves that don't have a Corporate Claims assist 
   * assigned at the feature level if the total is more than the reserveLimit then a true value is returned.
   * This function doesn't check for a corporate claims assist at the claim level.
   *Author: Mark Bendure
   *Date: April 12, 2012
   *Updated: -
   *****************************************************************************************************/
    var reserveTotal = 0 
    for(exposure in this.Exposures){
      var person = this.AllRoleAssignments.where(\ e -> e.Exposure == exposure and e.Active)
      if(person.IsEmpty and exposure.OpenReserves != null)
        reserveTotal  = reserveTotal + (exposure.OpenReserves as int)
    }
    if(reserveTotal >= reserveLimit){
      return true
    }else{
      return false
    }
  }
  
  
  function CheckCorpClaimAssistForTotalIncurred(thresholdLimit : int):boolean{
   /*****************************************************************************************************
   * Cycles through all the features on a claim and adds up all the payments that don't have a Corporate Claims assist 
   * assigned at the feature level if the total is more than the paymentLimit then a true value is returned.
   * This function doesn't check for a corporate claims assist at the claim level.
   *Author: Chandra Prakash kathroju
   *Date: January 22,2016
   *Updated: - replaced the sum of payment to total incurred 1/26/2016
   * Updated - removed User Role Assignment Condition check 3/7/2016
   *****************************************************************************************************/
    var totalIncurredOnClaim  = gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetMinusOpenRecoveryReserves().getAmount(this) as java.math.BigDecimal
    if(totalIncurredOnClaim >= thresholdLimit){
      return true
    }else{
      return false
    }
  }


  
}
