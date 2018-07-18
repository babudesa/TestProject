package libraries

@Export
enhancement Payment : entity.Payment
{
  
  //If this method is still used, please uncomment the following code and 
  //make sure deductiblestatus is added in the extensions table
  /*function showDeductible(): Boolean {

    
  if (this.Claim.DeductibleStatus!="paid" and
  (this.Claim.LOBCode=="pr" or this.Claim.LOBCode == "auto" or
  this.Claim.LOBCode =="gl" or this.Claim.LOBCode == "wc" ) and
  this.CostType == "claimcost") {

  return true
  }

  else return false
  }*/

  function isPayeeClaimant() : Boolean {
    for (payee in this.Check.Payees) {
      if (payee.PayeeType=="claimant" or payee.PayeeType=="insured") {
        //print ("is a clamant")
        return true
      }
    }
    //print ("not a claimant")
    return false
  }

  function sampleDeductible () : java.math.BigDecimal {
    if (this.Exposure.Coverage.Deductible<>null) { 
      return this.Exposure.Coverage.Deductible
    } else {
      return 0
    }
  }

  //If this method is still used, please uncomment the following code and 
  //make sure originalamount and deductibleamount are added in the extensions table
  /*function calculateNetAmount() : java.math.BigDecimal {
  
      if (this.OriginalAmount==null or this.DeductibleAmount==null or this.OriginalAmount<this.DeductibleAmount) {
  
  return 0
  
  }
  else return  (this.OriginalAmount - this.DeductibleAmount)
  
  }
*/
  //Function filters out the payment types for Transfer and Recoding payments
  //Defect 450/454 - kmboyd
  function findPaymentTypes(pay : String) : boolean {
      if (this.PaymentType== "final" or this.PaymentType == "partial"){
        if(pay == "final" or pay == "partial"){
          return true;
        }else{
          return false;
        }
      }else{
        if(pay == "supplemental"){
          return true;
        }else{
          return false;
        }
      }
  }

  function exceedsReserves() : boolean{
    var total = this.Exposure.getAvailableReserves(this.ReserveLine.CostType, this.ReserveLine.CostCategory)
    if(this.Amount > total){
      return true;
    }
    return false;
  }

  function isPendingRecode() : boolean{
    if(this.Status == TransactionStatus.TC_PENDINGRECODE){
          return true;
    }
  
    for(payment in this.Claim.PaymentsQuery.iterator()){
       if((payment as PaymentView).Check_CheckNumber == this.Check.CheckNumber and (payment as PaymentView).Status == TransactionStatus.TC_PENDINGRECODE){
        return true;
      }
    }
  
    return false;

  }

  function isPaymentTypeEditable() : Boolean {
    var result : Boolean = true;
  
    if(this.PaymentType == "final" and this.Status == "awaitingsubmission"){
      result = false;
    }
  
    return result;
  }
}