package libraries.Exposure_Entity

enhancement PaymentRequirements : entity.Exposure {
  //defect 1382 djohnson 09/08/08 Stat Type of Loss error message....one for all transactions
  //defect 1087 sprzygocki 08/14/09 Method of Settlement - added the error message here as well
  //sprzygocki 1/30/10 - updated the function for all method of settlement fields
  function checkLoss() : String{
    var result : String = null;
    //var msg : String = displaykey.Rules.Validation.Exposure.MethodOfSettlement.Message
    //var msg2: String = displaykey.Rules.Validation.Exposure.TotalLossIndicator.Message
    if(this == null){
      result = displaykey.NVV.Financials.SelectaFeature
    } else {
      if(this.Coverage.State!=null and this.Coverage.SublineExt!=null and this.Coverage.SublineExt!="0" and this.Coverage.SublineExt!="NR"){
        if(this.typeOfLossIsIncomplete()){
          result = displaykey.NVV.Financials.LossDueTo(this)
        }
      }
      //3/26/10 erawe - defect 2894 - removed this check as it is no longer needed for Total Loss Ind at this point
  //    if(this.totalLossNeededForPymt() &amp;&amp; this.getFeatureFinancialStatus()=="Closed" &amp;&amp; this.TotalLossIndExt==null){
  //      if(exists(trans in this.Claim.TransactionsQuery.iterator() where 
  //        ((trans as TransactionDefaultView).TransactionSubtype=="Payment"
  //          and (trans as TransactionDefaultView).CostType == "claimcost"
  //          and (trans as TransactionDefaultView).Exposure==this))){
  //        if(result!=null){
  //          result = result + "/n" + msg2
  //        } else {
  //          result = msg2
  //        }
  //      }
  //    }
    }
    return result;
  }
 
   function checkLossForReserves(amt : double) : String{
    var result : String = null;
    //var msg : String = displaykey.Rules.Validation.Exposure.MethodOfSettlement.Message
    //var msg2: String = displaykey.Rules.Validation.Exposure.TotalLossIndicator.Message
     /*if((this.ExposureType=="ab_AGG_auto_BodInjury" || this.ExposureType=="ab_AGG_gl_BodInjury" || this.ExposureType=="ab_BodilyInjury")
         &amp;&amp; this.MethodOfSettlementExt==null &amp;&amp; this.ExposureRpt.getOriginalValue( "OpenReserves" )&gt;0 and amt==0){
        if(exists(trans in this.Claim.TransactionsQuery.iterator() where 
          ((trans as TransactionDefaultView).TransactionSubtype=="Payment"
            and (trans as TransactionDefaultView).CostType == "claimcost"
            and (trans as TransactionDefaultView).Exposure==this))){
          if(result!=null){
            result = result + "/n" + msg
          } else {
            result = msg
          }
        }
      }*/
      if(this.Coverage.State!=null and this.Coverage.SublineExt!=null and this.Coverage.SublineExt!="0" and this.Coverage.SublineExt!="NR"){
        if(this.typeOfLossIsIncomplete() and util.WCHelper.isWCorELLossType(this.Claim)){
          result = displaykey.NVV.Financials.LossDueToWC(this.Claim)
        }else{        
          if(this.typeOfLossIsIncomplete()){
            result = displaykey.NVV.Financials.LossDueTo(this)
          }
        }
      }
      //3/26/10 erawe - defect 2894 - removed this check as it is no longer needed for Total Loss Ind at this point
  //    if(this.totalLossNeededForPymt() &amp;&amp; this.TotalLossIndExt==null  &amp;&amp; this.ExposureRpt.getOriginalValue( "OpenReserves" )&gt;0 and amt==0){
  //      if(exists(trans in this.Claim.TransactionsQuery.iterator() where 
  //        ((trans as TransactionDefaultView).TransactionSubtype=="Payment"
  //          and (trans as TransactionDefaultView).CostType == "claimcost"
  //          and (trans as TransactionDefaultView).Exposure==this))){
  //        if(result!=null){
  //          result = result + "/n" + msg2
  //        } else {
  //          result = msg2
  //        }
  //      }
  //    }
      return result;
   }
}
