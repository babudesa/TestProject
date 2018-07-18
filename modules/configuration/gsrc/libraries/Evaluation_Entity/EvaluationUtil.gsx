package libraries.Evaluation_Entity

uses java.util.ArrayList;
uses gw.api.financials.CurrencyAmount
uses gw.api.financials.FinancialsCalculationUtil
uses com.guidewire.pl.system.database.impl.QueryProcessorImpl

enhancement EvaluationUtil : entity.Evaluation {

  function filterRelatedTo() : List { 
    var relatedList:List = new ArrayList();
  
    for(exp in this.Claim.Exposures){
      relatedList.add( exp )
    }
    relatedList.add( this.Claim )
  
    return relatedList;
  }

  public function getRelatedToValue() : Object{

      if(this.RelatedTo.IntrinsicType.TypeInfo == Exposure.Type.TypeInfo){ //check to see if related object is an exposure
        return this.RelatedTo as Exposure;
      }
      if(this.RelatedTo.IntrinsicType.TypeInfo == Matter.Type.TypeInfo){ 
        return this.RelatedTo as Matter;
      }
      if(this.RelatedTo.IntrinsicType.TypeInfo == Contact.Type.TypeInfo){ 
        return this.RelatedTo as Contact;
      }
    
      return null
  }

  public function calculateNetEstimate(): double
  {
    var lossEstimate = 0
    var deductible = 0
    var depreciation = 0
    var coinsPenalty = 0
    var other = 0
    var netEstimate = 0
  
    if (this.LossEstimateExt != null)
    {
     lossEstimate = this.LossEstimateExt as int
    }
  
    if (this.DeductibleExt != null)
    {
     deductible = this.DeductibleExt as int
    }
  
    if (this.DepreciationExt != null)
    {
      depreciation = this.DepreciationExt as int 
    }
  
    if(this.CoinsuranceExt != null)
    {
     coinsPenalty = this.CoinsuranceExt as int 
    }
  
    if(this.OtherDeductionsExt != null)
    {
     other = this.OtherDeductionsExt as int
    }
   
     netEstimate = lossEstimate - (deductible + depreciation + coinsPenalty + other )
     return netEstimate
   
  }

  public function calculateTotalPastMedical(): double
  {
    //var ambulance = 0
    //var emergRoom = 0
    //var hospital = 0
    //var surgery = 0
    //var physician = 0
    //var therapy = 0
    //var medEquip = 0
    //var medication = 0
    //var diagnostics = 0
    //var otherMed = 0
    var pastMedTotal = 0
  
  if (this.AmbulanceDamagesPastExt != null && this.AmbulanceDamagesPastExt != NaN)
    {
     pastMedTotal = this.AmbulanceDamagesPastExt + pastMedTotal as int
    }
  
    if (this.EmergencyRoomDamagesPastExt != null && this.EmergencyRoomDamagesPastExt != NaN)
    {
     pastMedTotal = this.EmergencyRoomDamagesPastExt + pastMedTotal as int
    }
   
    if (this.HospitalER.Amount != null && this.HospitalER.Amount != NaN)
    {
      pastMedTotal = this.HospitalER.Amount + pastMedTotal as int 
    }
  
    if(this.SurgeryDamagesPastExt != null && this.SurgeryDamagesPastExt != NaN)
    {
      pastMedTotal = this.SurgeryDamagesPastExt + pastMedTotal as int
    }

    if(this.TreatingPhysician.Amount != null && this.TreatingPhysician.Amount != NaN)
    {
      pastMedTotal = this.TreatingPhysician.Amount + pastMedTotal as int
    }
  
    if(this.TherapyDamagesPastExt != null && this.TherapyDamagesPastExt != NaN)
    {
      pastMedTotal = this.TherapyDamagesPastExt + pastMedTotal as int
    }
  
    if(this.MedicalEquipment.Amount != null && this.MedicalEquipment.Amount != NaN)
    {
      pastMedTotal = this.MedicalEquipment.Amount + pastMedTotal as int
    }
  
    if(this.MedicationDamagesPastExt != null && this.MedicationDamagesPastExt != NaN)
    {
      pastMedTotal = this.MedicationDamagesPastExt + pastMedTotal as int
    }
   
    if (this.Diagnostic.Amount != null && this.Diagnostic.Amount != NaN)
    {
      pastMedTotal = this.Diagnostic.Amount + pastMedTotal as int
    }
  
    if (this.OtherMedicalDamagesPastExt != null && this.OtherMedicalDamagesPastExt != NaN)
    {
      pastMedTotal = this.OtherMedicalDamagesPastExt + pastMedTotal as int 
    }
     //pastMedTotal = ambulance + emergRoom + hospital + surgery + physician + therapy + 
     //medEquip + medication + diagnostics + otherMed
     return pastMedTotal
   
  }
  //1/21/09 current way we are doing calcuateTotalPastMedical()
  //  if (this.AmbulanceDamagesPastExt != null)
  //  {
  //   ambulance = this.AmbulanceDamagesPastExt
  //  }
  //  
  //  if (this.EmergencyRoomDamagesPastExt != null)
  //  {
  //   emergRoom = this.EmergencyRoomDamagesPastExt
  //  }
  //   
  //  if (this.HospitalER != null)
  //  {
  //    hospital = this.HospitalER 
  //  }
  //  
  //  if(this.SurgeryDamagesPastExt != null)
  //  {
  //   surgery = this.SurgeryDamagesPastExt 
  //  }
  //
  //  if(this.TreatingPhysician != null)
  //  {
  //   physician = this.TreatingPhysician
  //  }
  //  
  //  if(this.TherapyDamagesPastExt != null)
  //  {
  //   therapy = this.TherapyDamagesPastExt
  //  }
  //  
  //  if(this.MedicalEquipment != null)
  //  {
  //     medEquip = this.MedicalEquipment 
  //  }
  //  
  //  if(this.MedicationDamagesPastExt != null)
  //  {
  //    medication = this.MedicationDamagesPastExt 
  //  }
  //   
  //  if (this.Diagnostic != null)
  //  {
  //    diagnostics = this.Diagnostic 
  //  }
  //  
  //  if (this.OtherMedicalDamagesPastExt != null)
  //  {
  //     otherMed = this.OtherMedicalDamagesPastExt 
  //  }
  //   pastMedTotal = ambulance + emergRoom + hospital + surgery + physician + therapy + 
  //   medEquip + medication + diagnostics + otherMed
  //   return pastMedTotal
  //   
  //}

  public function calculateSpecialDamage():double
  {
    var totalPastMedical = this.calculateTotalPastMedical()
    var wageLoss = 0
    var damageOther = 0
    var totalSpecialDamages = 0
  
    if (this.WageLossDamagesPastExt != 0 && this.WageLossDamagesPastExt != null && this.WageLossDamagesPastExt !=NaN)
    {
      wageLoss = this.WageLossDamagesPastExt + wageLoss as int 
    }
    if(this.Other.Amount !=null && this.Other.Amount !=NaN)
    {
      damageOther = this.Other.Amount + damageOther as int
    }
      totalSpecialDamages = totalPastMedical + wageLoss + damageOther as int
    return totalSpecialDamages 
  }
  //was this was as of 1/21/09  
  //  if (this.WageLossDamagesPastExt != 0 && this.WageLossDamagesPastExt != null)
  //  {
  //     wageLoss = this.WageLossDamagesPastExt 
  //  }
  //  if(this.Other != null)
  //  {
  //    damageOther = this.Other 
  //  }
  //  
  //  totalSpecialDamages = totalPastMedical + wageLoss + damageOther
  //  return totalSpecialDamages
  //}

  public function getTotalGeneralDamagesLow():double
  {
    var lowTotal = 0
    //var lowDisfigurement = 0
    //var lowPandS = 0
    //var lowOther = 0
  
    if (this.DisfigurementDamagesLowExt != null && this.DisfigurementDamagesLowExt != NaN)
    {
      lowTotal = this.DisfigurementDamagesLowExt + lowTotal as int 
    }  
    if(this.PainSufferingDamagesLowExt != null && this.PainSufferingDamagesLowExt != NaN)
    {
      lowTotal = this.PainSufferingDamagesLowExt + lowTotal as int 
    }
    if(this.OtherDamagesLowExt != null && this.OtherDamagesLowExt != NaN)
    {
      lowTotal = this.OtherDamagesLowExt + lowTotal as int
    }
    return lowTotal
  }
  //was this was as of 1/21/09
  //  if (this.DisfigurementDamagesLowExt != null )
  //  {
  //    lowDisfigurement = this.DisfigurementDamagesLowExt 
  //  }  
  //  if(this.PainSufferingDamagesLowExt != null)
  //  {
  //    lowPandS = this.PainSufferingDamagesLowExt  
  //  }
  //  if(this.OtherDamagesLowExt != null)
  //  {
  //      lowOther = this.OtherDamagesLowExt
  //  }
  //  lowTotal = lowDisfigurement + lowPandS + lowOther
  //  return lowTotal
  //}

  public function getTotalGeneralDamagesHigh():double
  {
    var highTotal = 0
    //var highDisfigurement = 0
    //var highPandS = 0
    //var highOther = 0
  
  if (this.DisfigurementDamagesHighExt != null && this.DisfigurementDamagesHighExt != NaN)
    {
      highTotal = this.DisfigurementDamagesHighExt + highTotal as int 
    }  
    if(this.PainSufferingDamagesHighExt != null && this.PainSufferingDamagesHighExt != NaN)
    {
      highTotal = this.PainSufferingDamagesHighExt + highTotal as int 
    }
    if(this.OtherDamagesHighExt != null && this.OtherDamagesHighExt != NaN)
    {
        highTotal = this.OtherDamagesHighExt + highTotal as int
    }
    return highTotal
  }
  //was this was as of 1/21/09
  //  if (this.DisfigurementDamagesHighExt != null)
  //  {
  //    highDisfigurement = this.DisfigurementDamagesHighExt  
  //  }  
  //  if(this.PainSufferingDamagesHighExt != null)
  //  {
  //    highPandS = this.PainSufferingDamagesHighExt  
  //  }
  //  if(this.OtherDamagesHighExt != null)
  //  {
  //      highOther = this.OtherDamagesHighExt
  //  }
  //  highTotal = highDisfigurement + highPandS + highOther
  //  return highTotal
  //}
  public function calculateFutureDamagesTotal():int
  {
     var futureDamage = 0
     //var medical = 0
     //var wages = 0
     //var other = 0
   
     if(this.FutureMedical.Amount != null && this.FutureMedical.Amount != NaN)
     {
       futureDamage = this.FutureMedical.Amount + futureDamage as int 
     }
     if(this.FutureWagesDamagesExt != null && this.FutureWagesDamagesExt != NaN)
     {
       futureDamage = this.FutureWagesDamagesExt + futureDamage as int
     }
     if(this.FutureOtherDamagesExt != null && this.FutureOtherDamagesExt != NaN)
     {
       futureDamage = this.FutureOtherDamagesExt + futureDamage as int
     }
   
     return futureDamage
  }
   
  //   if(this.FutureMedical != null)
  //   {
  //     medical = this.FutureMedical 
  //   }
  //   if(this.FutureWagesDamagesExt != null)
  //   {
  //     wages = this.FutureWagesDamagesExt 
  //   }
  //   if(this.FutureOtherDamagesExt != null)
  //   {
  //     other = this.FutureOtherDamagesExt 
  //   }
  //   
  //   futureDamage = medical + wages + other
  //   return futureDamage
  //}
  public function getAllDamagesTotal():double
  {
     var allTotal = 0
     var special = calculateSpecialDamage()
     var future = calculateFutureDamagesTotal()
   
     allTotal = special + future as int
     return allTotal
   
  }

  public function getReserveLineReserveTotal(inObject:Object, inCostType:CostType, flag:String):double
  {
    //This formula will accept the passed in Evaluation.RelatedTo from the Liability Evaluation, determine what type of object it is,
    //then cycle through all of the reserve lines until it finds one with the same cost type as what was passed in. Then the 
    //reserve amount is calculated for that particular cost type and passed back. Zero will be returned if the cost type doesn't exist.
    //For a Claim object, all of the particular cost type reserve lines are totaled for the entire claim. For the
    //Exposure type object, that particular cost type reserve is totaled only for the exposure.
    //jlmiller, 1/9/08 for Agri sprint 10
  
    var reserve = 0
    if(inObject typeis Exposure)
    {
       for(expResLine in inObject.ReserveLines)
       {
          if(expResLine.CostType == inCostType)
         {
            var cl = expResLine.Claim
            var exp = expResLine.Exposure
            var costType = expResLine.CostType
            var costCat = expResLine.CostCategory
     
           reserve = gw.api.financials.FinancialsCalculationUtil.getOpenReserves().getAmount( cl, exp, costType, costCat ) as int
         }
       }
    } else {
       for(claimResLine in (inObject as Claim).ReserveLines)
       {
          if(claimResLine.CostType == inCostType)
         {
            var cl = claimResLine.Claim
            var costType = claimResLine.CostType
            var costCat = claimResLine.CostCategory
           reserve = gw.api.financials.FinancialsCalculationUtil.getOpenReserves().getAmount( cl, costType, costCat ) as int
         }
       }
    }
    //save it to the datebase. This is necessary because the value clause in the pcf contains this function instesad of 
    //Evaluation.CurrentLossReserveExt.
    if(flag == "1") //only store the value to the table if the flag is 1, don't store for 0
    {     
     //store the reserve amount on the evaluation to save it.
       if(inCostType == "claimcost")
            {
                this.CurrentLossReserveExt = reserve 
            }
            else
            {
                this.CurrentExpenseReserveExt = reserve
            }
    }
    return reserve
  }

  //calculates the reserve change
  //*note: this no longer calculates for Expense reserve. Per Karen, Liability Evals are only for Loss reserves. They
  // will come up with an expense reserve eval later.  jlmiller 4/3/08
  public function calculateReserveChange():double
  {
    var resChange = 0.0
    var holdRecReserve = this.RecReserveExt
    var holdLossRes = this.CurrentLossReserveExt
    var holdExpRes = this.CurrentExpenseReserveExt
  
    if(holdRecReserve == null)
    {
       holdRecReserve = 0 
    }
  
    if(holdLossRes == null)
    {
          holdLossRes = 0
    }
    if(holdExpRes == null)
    {
          holdExpRes = 0
    }
    //if(this.EvaluationForExt == "loss")
    //{
        if(holdRecReserve == 0)
        {
          resChange = holdLossRes as double
        }
        else
        {
            resChange = holdRecReserve - holdLossRes as double 
        }
    /*}
    else
    {
       if(holdRecReserve == 0)
        {
          resChange = holdExpRes
       }
        else
        {
             resChange = holdRecReserve - holdExpRes 
        }
    }*/
  
    this.ReserveChangeExt = resChange
    return resChange
  
  }

  public function getTotalDamageLow():double
  {
     var totalDamLow = 0
     var all = getAllDamagesTotal()
     var genLow = getTotalGeneralDamagesLow()
   
     totalDamLow = all + genLow as int
     return totalDamLow
   
  }
  public function getTotalDamageHigh():double
  {
     var totalDamHigh = 0
     var all = getAllDamagesTotal()
     var genLow = getTotalGeneralDamagesHigh()
   
     totalDamHigh = all + genLow as int
     return totalDamHigh
   
  }


  public function checkReserves(): boolean
  {
    var lossRes = getReserveLineReserveTotal(this.RelatedTo,"claimcost","0")
    //var expRes = getReserveLineReserveTotal(this.RelatedTo,"expense",0)
    if (lossRes == this.CurrentLossReserveExt){
    //if (lossRes == this.CurrentLossReserveExt && expRes == this.CurrentExpenseReserveExt){
      return false
      }
    else{ 
      return true  
    }
   }

  public function refreshReserves()
  {
    this.getReserveLineReserveTotal(this.RelatedTo,"claimcost","1")
    this.getReserveLineReserveTotal(this.RelatedTo,"expense","1")
  
   }
 
  public function getDamageRange(lowValue:double, highValue:double, symbol:String):String
  {
    if(lowValue == null or lowValue == NaN){
      lowValue = 0
    }
    if(highValue == null or highValue ==NaN){
      highValue = 0
    }
    if(lowValue == 0 and highValue == 0){
      return 0 as java.lang.String
    }
   else {
     if(symbol == "$"){
       return "$"+lowValue + " - $"+ highValue
     }
     else
     return lowValue +"% - " +  highValue + "%"
   }
  }
 
  public function refreshFields(){
    if(this.EvaluationTypeExt=="liability" or this.EvaluationTypeExt=="medical" or this.EvaluationTypeExt=="vocational"
     or this.EvaluationTypeExt=="indemnity"){
       
      refreshReserves()
      this.LossLocationExt = this.Claim.LossLocation
    }
    if(this.getRelatedToValue() typeis Exposure){
      this.Claimant = (this.getRelatedToValue() as Exposure).Claimant
      this.ClaimantNameExt = this.Claimant.DisplayName    
    } else {
      this.Claimant = null
      this.ClaimantNameExt = null
    }
  
  }
  // Defect 2407 - blawless - 8/31/09
  function calcFeatureRangeLow(){
    if(this.JVVRangeLowExt != null and this.LowInsuredLiabilityExt != null){
      this.PotFeatRangeLowExt =  (java.lang.Math.round(this.JVVRangeLowExt * this.LowInsuredLiabilityExt as float)/100)
    }else{
      this.PotFeatRangeLowExt = null
    }
  }
  // Defect 2407 - blawless - 8/31/09
  function calcFeatureRangeHigh(){
    if(this.JVVRangeHighExt != null and this.HighInsuredLiabilityExt != null){
      this.PotFeatRangeHighExt =  (java.lang.Math.round(this.JVVRangeHighExt * this.HighInsuredLiabilityExt as float)/100)
    }else{
      this.PotFeatRangeHighExt = null
    }
  }
  // Defect 7831 - dcarson2 - 10/08/15  
  function initSaveToECF():boolean{  
    if(this.SaveToECFExt == true){ 
      this.SaveToECFExt = false
    }
    return true
  }

  function getRehabTotal():CurrencyAmount{
    var total : java.math.BigDecimal = 0
      for (amt in this.Rehabs){
        if(amt.RehabTotal!=null){
          total=amt.RehabTotal+total
        }
      }
    return total
    }
  
 /* 4.24.15 - cmullin - This function is used to calculate Disability Totals Paid To Date on the Indemnity Evaluation. 
 * This function is based on very specific mappings between Disability Type, Bureau Benefit Type and WC Injury Type. 
 * See Workers' Comp Requirements for more information. 
 * 1.18.16 - Defect 8196 - added new WCInjuryTypeExt values
 */
  public function getDisabilityBenefitsToDate(disabilityType : DisabilityTypeExt) : CurrencyAmount {
    var sum : java.math.BigDecimal = 0
    var claimTransactions = this.Claim.TransactionsQuery as QueryProcessorImpl
  
    if(disabilityType == DisabilityTypeExt.TC_PERMPARTIAL){
      for(each in claimTransactions){
        var trans = each as TransactionDefaultView
        if(trans.Transaction.Subtype == "payment" && trans.Exposure.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS){
          if(trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_MAJORPERMPARTIAL || 
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_MINORPERMPARTIAL || 
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_PERMPARTIAL || 
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_PERMPARTIALNOSUPP){
            sum += trans.Transaction.Amount
          }
        }
      }
    }else if(disabilityType == DisabilityTypeExt.TC_PERMTOTAL){
      for(each in claimTransactions){
        var trans = each as TransactionDefaultView
        if(trans.Transaction.Subtype == "payment" && trans.Transaction.Exposure.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS){
          if(trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_PERMTOTALDISABILITY ||
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_LIFETIMEINCOMETXONLY){
            sum += trans.Transaction.Amount
          }
        }
      }
    }else if(disabilityType == DisabilityTypeExt.TC_SUPPLEMENTAL){
      for(each in claimTransactions){
        var trans = each as TransactionDefaultView
        if(trans.Transaction.Subtype == "payment" && trans.Transaction.Exposure.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS){
          if(trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_SUPPEARNNOPERM || 
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_SUPPBENEFITSFLONLY || 
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_SUPPEARNPERM ||
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPIMPAIRSUPPTXONLY){
            sum += trans.Transaction.Amount
          }
        }
      }
    }else if(disabilityType == DisabilityTypeExt.TC_TEMPTOTAL){
      for(each in claimTransactions){
        var trans = each as TransactionDefaultView
        if(trans.Transaction.Subtype == "payment" && trans.Transaction.Exposure.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS &&
          (trans.Transaction.Exposure.BureauBenefitTypeExt == BureauBenefitExt.TC_TEMPTOTALDISABILITY ||
           trans.Transaction.Exposure.BureauBenefitTypeExt == BureauBenefitExt.TC_TEMPINCOMEBEN)){
          if(trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPINJURY ||
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPPARTIALINJURY ||
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPTOTALINJURY ||
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPINCOMETXONLY){
            sum += trans.Transaction.Amount
          }
        }
      }
    }else if(disabilityType == DisabilityTypeExt.TC_TEMPPARTIAL){
      for(each in claimTransactions){
        var trans = each as TransactionDefaultView
        if(trans.Transaction.Subtype == "payment" && trans.Transaction.Exposure.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS &&
          (trans.Transaction.Exposure.BureauBenefitTypeExt == BureauBenefitExt.TC_TEMPPARTDISABILITY ||
           trans.Transaction.Exposure.BureauBenefitTypeExt == BureauBenefitExt.TC_TEMPINCOMEBENPART)){
          if(trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPINJURY ||
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPPARTIALINJURY ||
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPTOTALINJURY ||
             trans.Transaction.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPINCOMETXONLY){
            sum += trans.Transaction.Amount
          }
        }
      }
    }else{
      return null
    }
    return sum
  }
  
  function getMedicalPaymentsToDate() : CurrencyAmount {
    var sum : java.math.BigDecimal = 0
    for(each in this.Claim.Exposures){
      if(each.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS){
        sum = gw.api.financials.FinancialsCalculationUtil.getTotalPaymentsIncludingPending().getAmount(each)
      }
    }
    return sum
  }
    
  function getIndemnityPaymentsToDate() : CurrencyAmount {
    var sum : java.math.BigDecimal = 0
    for(each in this.Claim.Exposures){
      if(each.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS){
        sum = gw.api.financials.FinancialsCalculationUtil.getTotalPayments().getAmount(each)
      }
    }
    return sum
  }
    
  // Defect 8444 - dcarson2 - 7/6/16
  function getIndemnityFuturePayments() : CurrencyAmount {
    var sum : java.math.BigDecimal = 0
    for(each in this.Claim.Exposures){
      if(each.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS){
        sum = gw.api.financials.FinancialsCalculationUtil.getFuturePayments().getAmount(each)
      }
    }
    return sum
  }
  
  function getCurrentReserves() : CurrencyAmount {
    var sum : java.math.BigDecimal = 0
    for(each in this.Claim.Exposures){
      if(each.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS){
        sum = gw.api.financials.FinancialsCalculationUtil.getAvailableReserves().getAmount(each)
      }
    }
    return sum
  }

  function getDeathBenefitsToDate() : CurrencyAmount {
      var sum : java.math.BigDecimal = 0
      var claimTransactions = this.Claim.Transactions
      for(trans in claimTransactions){
        if(trans typeis Payment){
          if(trans.Exposure.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS && trans.WCInjuryTypeExt == WCInjuryTypeExt.TC_DEATH){
            sum = sum + trans.Amount
          }
        }
      }
      return sum
    }

  function setDeathBenefitsPaid(){
    this.IndemnityEval.DeathBenefitsPaid = this.getDeathBenefitsToDate()
  }
} // End EvaluationUtil