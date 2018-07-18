package libraries.Claim_Entity
uses java.util.ArrayList;
uses gw.api.database.*
uses java.math.BigDecimal

enhancement Custom_Ext : entity.Claim {
  function clearEstimatedDamage_Ext( ) : void
  {
    if(this.Catastrophe==null)
    {
      this.EstimatedDamage_Ext=null
    }
  }

  //******************************************************************************************
  // jlm 04/10/08: Initial version
  // Name Validation for ISO.
  // 1 = name can't be null
  // 2 = last name must be at least 2 characters
  // 3 = name can't be a substitution like n/a
  //******************************************************************************************
  function performNameValidation(name:String):String
    {
      var inName = name
      var msg = "0"

      if(inName == null)
      {
	msg = "1"
	return msg
      }
      if(inName.length() < 2)
      {
	msg = "2"
      }

      if(inName == "unknown" || inName == "unk" || inName == "na" || inName == "n/a" || inName == "unkn" || inName == "uk" || inName == "ukn")
      {
	  msg = "3"
      }
      if(inName == "spouse" || inName == "daughter" || inName == "same" || inName == "son" || inName == "none")
      {
	  msg = "3"
      }
      return msg
    }

  //******************************************************************************************
  // rbr 07/31/07: Initial version
  // nscavelli 01/03/2008: Changed this function to actually populate the LossType from the
  //                       business line
  // zthomas 03/26/2008: Added Agribusiness BusinessLineExt functionality to Equine.
  //******************************************************************************************
  function populateLossType()
  {
    this.LossType = this.BusinessLineExt.Code
  }

 //   //*****************************************************************************
 /* 4/23/14 erawe - only allows FidCrime Security Zone users to create FidCrime claims
    This method should ALWAYS exist as long as Security Zones are in place */
   function filterSecureBusLossNCW(VALUE:String) :Boolean {
      var flag = true;
      if((VALUE =="Fidelity and Crime") || (VALUE == "fc") or (VALUE =="Kidnap and Ransom")){
	var currentUser = gw.plugin.util.CurrentUserUtil.getCurrentUser().User
	var fidelityAndCrime = Query.make(Group)
				    .compare("Name", Relop.Equals, "Fidelity and Crime Claims Division")
				    .select()
				    .AtMostOneRow

	//4/16/14:*** I added Role superuser and ignoreacl, not sure if this should be there or not
	if(User.util.getCurrentUser().hasPermission("ignoreacl") or
	(currentUser.AllGroups.contains(fidelityAndCrime) or
	(currentUser.AllGroups as java.util.Set<Group>).where(\ e -> e.Parent == fidelityAndCrime).Count>0)){
	  flag = true;
	}else{
	  flag = false
	}
      }
      return flag
   }

  //*****************************************************************************

  ////7/16/13 erawe: commment out to turn ON Excess for prod and cert.  Leave funtion as it will be used in the future
//  //for testing change env. to local, but be sure to change it back to cert, uat, prod
// 10/1/14 anicely: In the future, remove false condition and add LOB Name. Format: && (VALUE == "Environmental")
// erawe 5/10/16 Turn On Work Comp, EM82
//anicely - Hiding M&A everywhere except local and Dev

  function filterLossType(VALUE:String) :Boolean {
    var flag = false;
    var env = gw.api.system.server.ServerUtil.getEnv();
    //dcarson2 - Hiding TruckingAuto in CERT and PROD.
    if((env == "prod" || env == "cert") and
       (VALUE == "Trucking-Auto")){
        flag = false;
    } else {
        flag = true;
    }
    return flag
  }


  
  ////7/16/13 erawe: commment out to turn ON Excess for prod and cert.  Leave funtion as it will be used in the future
  // 10/1/14 anicely: In the future, remove false condition and add BusinessUnitExt code.  Format: && (VALUE == "en")
  // 8/7/15 cmullin: added block to hide AM Runoff, Discontinued Ops, Spec Lines and Spec Runoff - these are used for 
  // conversion only. New WC/EL claims will not be created for these businesses, per updated requirements.
  //erawe 5/10/16 - 'Turn On' workers comp, we will leave (ar,do,sl,sr) as hidden values unless told otherwise, EM82
  //anicely - Hiding M&A everywhere except local
  function filterBusinessUnit(VALUE:String) :Boolean{
    var flag = false;
    var env = gw.api.system.server.ServerUtil.getEnv();
    
    if (VALUE == "ar" || VALUE == "do" || VALUE == "sl" || VALUE == "sr"){
        return false; 
    } else {
        flag = true;
    }
    return flag
  }
  
  


//9/19/11 erawe - for defect 4581 removed filterLossType() and created filterPolicySymbol.  Basically works the same way
  //when IMP is ready for production we will comment this out and remove call from FNOLWizardFindPolicyPanelSet.Create filter property
  //3/20/12 erawe - I was asked to turn "off" displaying IMP in all env. Probably get turned back on in phases so I'll code for each env.
//11/7/14 dnmiller - IMP going to PROD in December 2014. Commenting out function and removing call from FNOLWizardFindPolicyPanelSet.Create

/*  function filterPolicySymbol(VALUE:String) : Boolean {
    //for testing change env. to local, but be sure to change it back to cert
    //print("vl;"  + VALUE)
    if((gw.api.system.server.ServerUtil.getEnv() == "uat" ||
      gw.api.system.server.ServerUtil.getEnv() == "cert" ||
      gw.api.system.server.ServerUtil.getEnv() ==  "prod" ||
      //gw.api.system.server.ServerUtil.getEnv() == "local" ||
      // DMILLER: testing new coverages for Builder's Risk
      gw.api.system.server.ServerUtil.getEnv() == "dev2" ||
      gw.api.system.server.ServerUtil.getEnv() == "int2" )
      and VALUE=="IMP"){
	 return false
    }
   else{
    return true
   }
  }*/

  
  // ***********************
  // 1/5/14 dnmiller - Function added to filter the business units when Workers Comp loss types are selected.
  // 8/7/15 cmullin - refactored the filter to hide PIM, SPES, OM, Agri, AM Runoff, Discontinued Ops, Spec Lines
  // & Spec Runoff business units if WC or EL loss type is chosen. These businesses will not be creating new
  // WC/EL claims. The codes are used for conversion only, per updated requirements. 
  // ***********************
  function filterWCBusinessUnits(bunit: String, lossType:String):Boolean{
    if(this.NCWOnlyBusinessUnitExt == null){
      if (lossType == "Workers' Compensation" || lossType == "Employers' Liability"){
        if (bunit == "am" || bunit == "ec" || bunit == "mi" || bunit == "oc" || bunit == "sc" || bunit == "tk"){
            //bunit == "im" || bunit == "sp" || bunit == "om" || bunit == "ab" || bunit == "ar" || 
            //bunit == "do" || bunit == "sl" || bunit == "sr"
            return true
        } else {
            return false
        }
      }
    }
    return true
  }

  //9/19/11 erawe - for defect 4581
  //3/20/12 erawe - I was asked to turn "off" displaying ITEMS in all env. Probably get turned back on in phases so I'll code for each env.
  function filterItems() :Boolean {
    //for testing change env. to local, but be sure to change it back to cert
    //print("env;" + gw.api.system.server.ServerUtil.getEnv())
      if(gw.api.system.server.ServerUtil.getEnv() == "cert" ||
      gw.api.system.server.ServerUtil.getEnv() == "uat" ||
      gw.api.system.server.ServerUtil.getEnv() ==  "prod" ||
      gw.api.system.server.ServerUtil.getEnv() == "local" ||
      gw.api.system.server.ServerUtil.getEnv() == "dev2" ||
      // dnmiller: adding DEV3 for Builder's Risk Testing
      gw.api.system.server.ServerUtil.getEnv() == "dev3" ||
      gw.api.system.server.ServerUtil.getEnv() == "dev4" ||
      gw.api.system.server.ServerUtil.getEnv() == "dev5" ||
      gw.api.system.server.ServerUtil.getEnv() == "dev6" ||
      gw.api.system.server.ServerUtil.getEnv() == "dev7" ||
      gw.api.system.server.ServerUtil.getEnv() == "dev8" ||
      gw.api.system.server.ServerUtil.getEnv() == "dev9" ||
      gw.api.system.server.ServerUtil.getEnv() == "int" ||
      gw.api.system.server.ServerUtil.getEnv() == "int2" ||
      gw.api.system.server.ServerUtil.getEnv() == "int3" ) {
       return false
      }
    else{
     return true
    }
  }
  //******************************************************************************************
  // 6/19/08: Eric Rawe
  // Function to sort catastrophes by loss date (no wiggle room)
  // This was originally done in Agribusiness then added to Equine
  //Updated 6/20/08 ER:  added compareIgnoreTime
  //******************************************************************************************
  function findValidCatastrophes(): List
  {
    var c : CatastropheQuery;
    var catlist:List = new ArrayList()
    //var fromDate : String
    //var toDate : String
    try
  {
      //fromDate = gw.api.util.DateUtil.addDays( this.LossDate, (scriptparameters.Catastrophe_DaysOfWiggleRoom*(-1)))
      //toDate = gw.api.util.DateUtil.addDays( this.LossDate, scriptparameters.Catastrophe_DaysOfWiggleRoom )
    if( this.LossType=="AGRIAUTO" or this.LossType=="AGRILIABILITY" or this.LossType=="AGRIPROPERTY" or this.LossType=="AGRIXSUMBAUTO" or this.LossType=="AGRIXSUMBLIAB"
        or this.LossType=="AGRIWC" or this.LossType=="AGRIEL")
      c = find(var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "AgriB" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="EQUINE")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "Equin" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="PIMINMARINE" or this.LossType=="PIMINMARINEWC" or this.LossType=="PIMINMARINEEL")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "PrpIM" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="FIDCRIME" or this.LossType=="KIDNAPRANSOM")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "FidCr" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="EXECLIABDIV")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "ExecL" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="EXCESSLIABILITY" or this.LossType=="EXCESSLIABILITYAUTO")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "Excss" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="PROFLIABDIV")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "ProfL" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="SPECIALTYES" or this.LossType=="SPECIALTYESWC" or this.LossType=="SPECIALTYESEL")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "RiskSol" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="COMMBONDS")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "Bonds" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="ENVLIAB")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "EnvL" or cat.Type == "iso" or cat.Type =="internal"))      
    else if (this.LossType=="ALTMARKETSWC" or this.LossType=="ALTMARKETSEL" or this.LossType==LossType.TC_ALTMARKETSAUTO)
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "AltMt"  or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="STRATEGICCOMPWC" or this.LossType=="STRATEGICCOMPEL")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "StCmp" or cat.Type == "iso" or cat.Type =="internal"))  
    else if (this.LossType=="TRUCKINGWC" or this.LossType=="TRUCKINGEL" or this.LossType==LossType.TC_TRUCKINGAUTO)
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "Trkng"  or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="OMWC" or this.LossType=="OMEL")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "OcMrn" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="ECUWC" or this.LossType=="ECUEL")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "EnvCU" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="PERSONALAUTO")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "PsnL" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="OMAVALON")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "OMAvn" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="MERGACQU")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "MerAc" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="AVIATION")
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "Aviat" or cat.Type == "iso" or cat.Type =="internal"))
    else if (this.LossType=="SPECIALHUMSERV" or this.LossType==LossType.TC_SHSAUTO)
      c = find( var cat in Catastrophe where cat.Active == true and (cat.BusinessCatNameExt == "SHS" or cat.Type == "iso" or cat.Type =="internal"))
  for(cat in c.iterator())
	{
	  if(this.LossDate!=null and cat.Ex_EarliestStartDate!=null and cat.Ex_LatestEndDate!=null){
	    if(gw.api.util.DateUtil.compareIgnoreTime( cat.Ex_EarliestStartDate,this.LossDate  ) <= 0
	       and gw.api.util.DateUtil.compareIgnoreTime( cat.Ex_LatestEndDate,this.LossDate  ) >= 0)
	    {
	      catlist.add( cat )
	    }
	  }
	}
	return catlist;
    }
    catch(e){
       gw.api.util.Logger.logInfo( "An error occurred in Claim.Custom_Ext.findValidCatastrophes")
       return null
    }
  }


    function getLossCause() : String
    {
	//Related to FlashNotice Property Defect 524
	var lc = this.LossCause.DisplayName
	var lcd = this.ex_DetailLossCause.DisplayName
	if( this.LossType == "Equine" )
	{
	   var LossCause = lc + ", " + lcd
	   if(lc == null and lcd == null)
	     return null
	   else if (lc == null and lcd != null )
	     return lcd
	   else if ( lcd == null and lc != null )
	     return lc
	   else
	     return LossCause
	}
	else
	{
	  if( lc != null )
	    return lc
	  return null
	}
    }

    function getProfitCenter() : String
    {
      var profitCenterCode = this.Policy.ex_Agency.ex_AgencyProfitCenter
      var profitCenterName = this.Policy.ex_Agency.AgencyProfitCenterNameExt

      if( profitCenterCode == null or profitCenterName == null)
	return null

      return profitCenterCode + ", " + profitCenterName
    }
    
    /* erawe 10/15/15 Added this because Corp Claim wanted profit center number first then name.  I used the original method above
        but they want a specific order, and the above methode was found in 27 places.  Too much to test at this time that just
        changing the above method would be valid all the other places it is used.  So as of 10/15/15 getProfitCenterNameNumber only
        used on Ent Trial Notice doc
    */
    function getProfitCenterNameNumber() : String
    {
      var profitCenterCode = this.Policy.ex_Agency.ex_AgencyProfitCenter
      var profitCenterName = this.Policy.ex_Agency.AgencyProfitCenterNameExt

      if( profitCenterCode == null or profitCenterName == null)
	return null

      return profitCenterName + ", " + profitCenterCode  
    }
    
    function getLossReserve() : String {
      if(gw.api.financials.FinancialsCalculationUtil.getOpenReserves().getAmount( this, CostType.TC_CLAIMCOST, "unspecified") != null)
	return  gw.api.util.StringUtil.formatNumber( gw.api.financials.FinancialsCalculationUtil.getOpenReserves().getAmount( this, CostType.TC_CLAIMCOST, "unspecified"), "#,##0.00")
      return "0.00"
    }
    
    // function to get Total Expense Reserve on a claim, for all exposures (from Financials - Summary screen, sum of blue Expense cells, minus all Recoveries)
    function getTotalExpenseReserve():BigDecimal{
      var totalExpense = gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetMinusOpenRecoveryReserves().getAmount(this, CostType.TC_EXPENSE, "unspecified").Amount
      if(totalExpense!=null){
        // getting all recoveries
        var overpayment = gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetMinusOpenRecoveryReserves().getAmount(this, CostType.TC_EXPENSE, "overpayment").Amount
        var suretyClmCred = gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetMinusOpenRecoveryReserves().getAmount(this, CostType.TC_EXPENSE, "suretyclmcred").Amount
        var salvage = gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetMinusOpenRecoveryReserves().getAmount(this, CostType.TC_EXPENSE, "salvage").Amount
        var secondInjuryFund = gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetMinusOpenRecoveryReserves().getAmount(this, CostType.TC_EXPENSE, "secondinjuryfund").Amount
        var subrogation = gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetMinusOpenRecoveryReserves().getAmount(this, CostType.TC_EXPENSE, "subrogation").Amount
        var deductible = gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetMinusOpenRecoveryReserves().getAmount(this, CostType.TC_EXPENSE, "deductible").Amount
        // subtracting recoveries from totalExpense (they are negative BigDecimal numbers)
        if(overpayment!=null)
          totalExpense=totalExpense.add(overpayment)
        if(suretyClmCred!=null)
          totalExpense=totalExpense.add(suretyClmCred)
        if(salvage!=null)
          totalExpense=totalExpense.add(salvage)
        if(secondInjuryFund!=null)
          totalExpense=totalExpense.add(secondInjuryFund)
        if(subrogation!=null)
          totalExpense=totalExpense.add(subrogation)
        if(deductible!=null)
          totalExpense=totalExpense.add(deductible)
        return totalExpense
      }
      return "0.00"
    } // end getTotalExpenseReserve
    
    // function to get Total Paid Expense on a claim, for all exposures (from Financials - Summary screen, sum of blue Expense cells, minus all Recoveries)
    function getTotalPaidExpense():BigDecimal{
      var totalPaidExpense = gw.api.financials.FinancialsCalculationUtil.getTotalPayments().getAmount(this, CostType.TC_EXPENSE, "unspecified").Amount
      if(totalPaidExpense!=null && totalPaidExpense!=0.00){
        return totalPaidExpense
      } 
      return "0.00"
    } // end getTotalPaidExpense
    
    // function to get Total Loss Reserve for exposure (from Financials - Summary screen, in blue Loss cells)
    function getLossReserveForExposure(expType : String):BigDecimal{
    var array = new gw.api.financials.FinancialsExpression[] 
      { gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetRecoveriesExpression().
      minus(gw.api.financials.FinancialsCalculationUtil.getOpenRecoveryReservesExpression()) }

      var financialSummary:gw.api.financials.FinancialsSummaryRow[]=(new gw.api.financials.FinancialsSummaryModel(this, gw.api.financials.FinancialsSummaryLevel.EXPOSURE, 
      gw.api.financials.FinancialsSummaryLevel.COSTTYPE, array, true).getFinancialsSummaryRows()) as gw.api.financials.FinancialsSummaryRow[]
      
      var totalIncurred:BigDecimal
      for(trans in financialSummary){
        if(trans.Label!=null && trans.Level.Level==0){
          if(trans.Label.toString().containsIgnoreCase(expType)){
            totalIncurred = trans.getValue(gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetRecoveriesExpression().minus(gw.api.financials.FinancialsCalculationUtil.getOpenRecoveryReservesExpression()))
            break
          }
        }
      }
      return this.formatFinancialValue(totalIncurred, 0)
    } // end getLossReserveForExposure
    
    // function to get Total Paid for exposure (from Financials - Summary screen, in blue Loss cells)
    function getLossPaidForExposure(expType : String):BigDecimal{
    var array = new gw.api.financials.FinancialsExpression[] 
      { gw.api.financials.FinancialsCalculationUtil.getTotalPaymentsExpression() }

      var financialSummary:gw.api.financials.FinancialsSummaryRow[]=(new gw.api.financials.FinancialsSummaryModel(this, gw.api.financials.FinancialsSummaryLevel.EXPOSURE, 
      gw.api.financials.FinancialsSummaryLevel.COSTTYPE, array, true).getFinancialsSummaryRows()) as gw.api.financials.FinancialsSummaryRow[]
      
      var totalPaid:BigDecimal
      for(trans in financialSummary){
        if(trans.Label!=null && trans.Level.Level==0){
          if(trans.Label.toString().containsIgnoreCase(expType)){
            totalPaid = trans.getValue(gw.api.financials.FinancialsCalculationUtil.getTotalPaymentsExpression())
            break
          }
        }
      }
      return this.formatFinancialValue(totalPaid, 0)
    } // end getLossPaidForExposure
    
    // the TOTAL Incurred Including Recovery on a claim (from Financials - Summary screen)
    function getTotalIncurredIncludingRecovery():String{
     var totalIncurred : BigDecimal = 0
     if(getLossReserveForExposure("Indemnity")!=null)
       totalIncurred=totalIncurred.add(getLossReserveForExposure("Indemnity"))
     if(getLossReserveForExposure("Medical")!=null)
       totalIncurred=totalIncurred.add(getLossReserveForExposure("Medical"))
     if(getLossReserveForExposure("Vocational Rehab")!=null)
       totalIncurred=totalIncurred.add(getLossReserveForExposure("Vocational Rehab"))
     if(getTotalExpenseReserve()!=null)
       totalIncurred=totalIncurred.add(getTotalExpenseReserve())
     return this.formatFinancialValue(totalIncurred, 0) 
   } // end getTotalIncurredIncludingRecovery
   
   // the TOTAL Paid for WC claim (from Financials - Summary screen)
    function getTotalPaidWC():String{
     var totalPaid : BigDecimal = 0
     if(getLossPaidForExposure("Indemnity")!=null)
       totalPaid=totalPaid.add(getLossPaidForExposure("Indemnity"))
     if(getLossPaidForExposure("Medical")!=null)
       totalPaid=totalPaid.add(getLossPaidForExposure("Medical"))
     if(getLossPaidForExposure("Vocational Rehab")!=null)
       totalPaid=totalPaid.add(getLossPaidForExposure("Vocational Rehab"))
     if(getTotalPaidExpense()!=null)
       totalPaid=totalPaid.add(getTotalPaidExpense())
     return this.formatFinancialValue(totalPaid, 0) 
   } // end getTotalPaidWC
    
    // function to get latest Reserve rationale for the provided Exposure type
    function latestReserveRationale(expType : ExposureType):String{
      var exp : Exposure
      var latestReserveRat : String
      if(this.Exposures.HasElements){
        exp = this.Exposures.firstWhere(\ e -> e.ExposureType==expType)  
      }  
      var transList:List<TransactionDefaultView> = new ArrayList<TransactionDefaultView>()
      if(exp!=null){
        for(trans in exp.TransactionsQuery.iterator()){
          var tempTrans = trans as TransactionDefaultView;
          if(tempTrans.TransactionSubtype == "Reserve" and !tempTrans.Transaction.NotApproved){
            if(tempTrans.Transaction.Comments != null and tempTrans.Transaction.Comments != "")
              transList.add(tempTrans)
          } 
        }
        if(transList.HasElements){
          transList = transList.sortBy(\ t -> t.RptCreateDateExt)
          latestReserveRat = transList.last().Transaction.Comments
        }
      }
      return latestReserveRat
    } // end latestReserveRationale
    
    //djohnson
  //Old way  lossReserveDate = (key as TransactionView).CreateTime
    function getLossReserveDate() : DateTime {
      var lossReserveDate : DateTime

      for( key in this.TransactionsQuery.iterator()) {
	  if( ((key as TransactionDefaultView).TransactionSubtype ==  "Reserve" and (key as TransactionView).CostType ==  "claimcost"))
	    lossReserveDate = ((key as TransactionView).Transaction as Reserve).ReserveLine.CreateTime
      }
      return lossReserveDate
     } // end getLossReserveDate
  //******************************************************************************************
  // jlm 04/10/08: Initial version
  // Name Validation for ISO.
  // 1 = street or city can't have garbage characters
  // 2 = street or city must not contain substitutions
  // 3 = street or city can't be null
  //******************************************************************************************
  function performAddressValidation(addr:String):String
  {
    var inAddr = addr
    var msg = "0"

    if(inAddr == null)
    {
      msg = "3"
      return msg
    }
    if(inAddr.startsWith("xx"))
    {
      msg = "1"
    }
    if(inAddr.startsWith("-"))
    {
       msg = "1"
    }
    if(inAddr.startsWith("?"))
    {
       msg = "1"
    }
    if(inAddr.startsWith("."))
    {
       msg = "1"
    }
    if(inAddr == "n/a" || inAddr == "na" || inAddr == "same" || inAddr == "none")
    {
       msg = "2"
    }
    if(inAddr == "unk" || inAddr == "unknown" || inAddr == "ukn" || inAddr == "unk" || inAddr == "unkn" || inAddr == "uk")
    {
       msg = "2"
    }
    if(inAddr.length() < 1)
    {
       msg = "3"
    }
    return msg
  }
    function getPolicySymbol() : String
    {
      //Related to FlashNotice Property Defect 524
       return this.Policy.PolicyType.DisplayName
    }

  function getCatastropheWarning( ) : void {
    if(!exists(c in this.Catastrophe.Ex_CatOccurances where c.State == this.LossLocation.State) and this.LossLocation.State != null and this.Catastrophe != null) {
      var message = "Verify Loss as valid for this Catastrophe and Loss State."

      pcf.GeneralErrorWorksheet.goInWorkspace( message )
    }
  }

  function reportedDateLessThanDOL() : String {

   if((this.ReportedDate!=null and this.LossDate!=null) and(gw.api.util.DateUtil.compareIgnoreTime(this.ReportedDate,this.LossDate)<0)
     and (this.ClaimsMadePolicyExt == false)){
     return displaykey.NVV.Claim.ClaimSummary.Validation.ReportDate
     }

     return null
  }

  //Defect 2861 mmanalili
  //Everytime the user chooses a guardian as the same as the person contact and does a policy
  //refresh ClaimCenter crashes.
  //This function will prevent the user from selecting a guardian contact as the same person
  //as the person contact
  function getGuardianContactsFromRelatedPersonArray(contact : Contact ) : List {
    var guardianContactsFromRelatedPersonArray : List = new ArrayList();
    for( con in this.RelatedPersonArray)
      if(con !=contact)
	guardianContactsFromRelatedPersonArray.add(con)

    return guardianContactsFromRelatedPersonArray
  }

  function getContactsFromRelatedContacts(contact : Contact ) : List {
    var guardianContactsFromRelatedContacts : List = new ArrayList();
    for( con in this.RelatedContacts)
      if(con !=contact)
	guardianContactsFromRelatedContacts.add(con)

    return guardianContactsFromRelatedContacts
  }

    function getClaimantRepsFromRelatedContacts(contact : Contact ) : List {
    var contactsFromRelatedContacts : List = new ArrayList();
    for( con in this.RelatedContacts){
      if(con.DisplayName !=contact.DisplayName){
	    contactsFromRelatedContacts.add(con)
      }
    }
    return contactsFromRelatedContacts
  }

  function getClaimantsFromRelatedContacts(contact : Contact) : List{
    var contactsFromRelatedContacts : List = new java.util.ArrayList();
    for(con in this.RelatedContacts){
       if(!contact.AllContactContacts.where(\ c -> c.ClaimantFlagExt == true )*.RelatedContact.contains(con) and con != contact){

	 contactsFromRelatedContacts.add(con)
       }
    }
    return contactsFromRelatedContacts
  }
  /*
  Defect #6508 added new function to restrict Vendors and Foreing Vendors from List 
  by gyemula*/
  function getClaimantsFromRelatedContactsList(contact : Contact) : List{
    var contactsFromRelatedContacts : List = new java.util.ArrayList();
    for(con in this.RelatedContacts){
       if(contact != null and !contact.AllContactContacts.where(\ c -> c.ClaimantFlagExt == true )*.RelatedContact.contains(con) and con != contact 
       and (con.Subtype =="Company" or con.Subtype =="Person" or con.Subtype =="NonVendorPayeeCompanyExt" or con.Subtype =="NonVendorPayeePersonExt") ){

	 contactsFromRelatedContacts.add(con)
       }
    }
    return contactsFromRelatedContacts
  }

  function resetOtherDescriptionValues() : void {
    //Pertaining to defect 4242
    if(this.LossCause == "allother") {
      if(this.LossCauseOtherDescExt != null)
	this.LossCauseOtherDescExt = null
    }
  }

  function resetVendorFraudValues() : void {
    //Pertaining to defect 4242
    if(this.LossCause == "fidelity") {
      if(this.VendorFraudExt != null)
	this.VendorFraudExt = null
    }
  }

  function showIncidentClaimant() :Boolean {
      var flag = true;
      if(exists(clm in this.Exposures where clm.Claimant != null)){
	flag = false;
      } else{
	flag = true;
}
      return flag
   }
 function clearWindHurricaneDedTriExt() : void
  {
    if(this.Catastrophe.Type!="iso")
    {
      this.WindHurricaneDedTriExt=null
      this.WindHurricaneDedAmtExt=null

    }
  }
  
  function getClaimantDependentList() : Contact[]{
    var list = new java.util.ArrayList<Contact>()
    for(contact in this.Contacts){
      for(role in contact.Roles){
        if(role.Role=="claimantdep"){
          list.add(role.Contact)
        }
      }
    }
    return list as Contact[]
  }
  
  function getMedicalVendorList() : Contact[]{
    var list = new java.util.ArrayList<Contact>()
    for(con in this.RelatedContacts){
      if(con.Subtype=="Doctor" or con.Subtype=="MedicalCareOrg" or con.Subtype=="Ex_ForeignPerVndrDoc" or con.Subtype=="Ex_ForeignCoVenMedOrg"){
        list.add(con)
      }
    }
    return list as Contact[]
  }
  // generating list of police reports or contacts for Empower document XML payload
  function getListOfItemsFromObjectArray(arr:Object[], variable:String):String{
    var result:String=""
    var count = 0
    for (item in arr){
      switch(variable){
        case "PoliceReport":
          if(count==0){
            result=(item as Official).ReportNumber
            count++
          }
          else{
            result=result.concat(", "+ (item as Official).ReportNumber)
          }
          break;
        case "Contact":
          if(count==0){
            result=(item as Contact).DisplayName
            count++
          }
          else{
            result=result.concat(", "+ (item as Contact).DisplayName)
          }
          break;  
        case "ClaimContact":
          if(count==0){
            result=(item as ClaimContact).DisplayName
            count++
          }
          else{
            result=result.concat(", "+ (item as ClaimContact).DisplayName)
          }
          break;  
      }
    }
    if(result!="")
      return result
    return null
  }
  //**************************************************************************************
}