package libraries.Transaction_Entity
uses gw.api.database.Query

enhancement Transaction : entity.Transaction {
  function setCostCategory() {
    this.CostCategory = "unspecified"
  }

  //Defect 13 - Filter cost category for Recovery drop down - kmboyd
  //Env dev - Feb 2014 - added Surety Claim Credit as recovery option - cmcdonald
  // 7/14/14 - Removed the filter for surety claim credit to appear only for bonds and environmental
  function filterRecoveryCostCategory(costCat : String) : boolean{
    if(costCat == "salvage" or costCat == "deductible" or
       costCat == "overpayment" or costCat == "subrogation" or
       costCat == CostCategory.TC_SURETYCLMCRED or costCat == CostCategory.TC_SECONDINJURYFUND){
         return true;
    }else{
      return false;
    }
  }
    //Function filters out the new cost categories added for Defect 13 - These are actually Recovery Categories
  //kmboyd
  // 6/2/14 - kniese - added Surety Claim Credit to the filter for Bonds
  function removeCostCat(res : ReserveLine) : boolean{
     if(res.CostCategory != "deductible" and res.CostCategory != "salvage"
       and res.CostCategory != "subrogation" and res.CostCategory != "overpayment"
       and res.CostCategory != CostCategory.TC_SURETYCLMCRED and res.CostCategory != CostCategory.TC_SECONDINJURYFUND){
      return true;
    }else{
      return false;
    }
  }

  function filterRecoveryLine(res : ReserveLine) : boolean{
    if(res.CostCategory != "unspecified"){
      return true;
    }else{
      return false;
    }
  }

  function blockFinancials() : boolean{
    
    for(act in this.Claim.Activities){
      if(act.Exposure == this.Exposure){ 
        if(act.ActivityPattern == util.custom_Ext.finders.findActivityPattern("approve_payment") and act.Status != "complete" and !act.New){
          for(actTrans in act.TransactionSet.Transactions){
            if((actTrans as Payment).PaymentType == "final" and actTrans.CostType == this.CostType){
              return true;
            }
          }
        }
      }
    }
  
    return false;
  }
  
  
  /**
   * Blocks lit advisor financials if there is any final payment pending
   */
  function blockLitAdvisorFinancials() : boolean {
                                   
     for(act in this.Claim.Activities){
      if(act.Exposure == this.Exposure){ 
        if(act.ActivityPattern == util.custom_Ext.finders.findActivityPattern("approve_payment") and act.Status != ActivityStatus.TC_COMPLETE and !act.New){
          for(actTrans in act.TransactionSet.Transactions){
            if((actTrans as Payment).PaymentType == PaymentType.TC_FINAL){
              return true;
            }
          }
        }
      }
    }
    return false
  }
  
  
  
  function setErode(pay : PaymentType) {
     if (pay == "supplement") {
       (this as Payment).setAsNonEroding()
     } else {
       (this as Payment).setAsEroding()
     }
  }

  function getReserveLineLabel(suggestedLabel:String, resLine:ReserveLine):String {
    if(!suggestedLabel.equals( displaykey.Financials.ReserveLine.NoExposure )) {
      return suggestedLabel;
    } else {
      return displaykey.LV.Financials.ReserveLine.NoExposure
    }
  }

  function filterReserveLine(suggestedLabel:String, resLine:ReserveLine):Boolean {
    if(suggestedLabel.equals( displaykey.Financials.ReserveLine.NoExposure)) {
      if(resLine.Exposure != null) {  
        return true;
      } else {    
        return false;
      }
    } else {
      return true
    }
  }

 
  
  public function getFactorReserveExt():String{
    var returnValue:String = null;
    if (this.Subtype == "Reserve"){
      if((this as Reserve).FactorReserveExt){
        returnValue = "Yes";
      }else{
        returnValue = "No";
      }
    }
    return returnValue;
  }

  function setFactorReserve() {
    if (this typeis Reserve) {
      if(this.Subtype == "Reserve" and this.CostType == "expense" and this.FactorReserveExt){
        this.FactorReserveExt = false;
      }

      var aqry = Query.make(Reserve)
      var reserves = aqry.compare("Claim", Equals, this.Claim).select()
      for (r in reserves) {
        if(this != r && r.ReserveLine == this.ReserveLine
        && r.CostType == "claimcost" && this.CostType == "claimcost" 
        && r.getFactorReserveExt() == "Yes" && this.FactorReserveExt) {
          this.FactorReserveExt = false;
        }
      }
    }
  }
  function setFactorReserveLoss():boolean{
   if(this typeis Reserve){
    if(this.CostType == "expense"){
       return false
     }
    for(trans in this.Claim.Transactions) {   
     if(this != trans and trans.Exposure == this.Exposure and trans.CostType == "claimcost" and this.CostType == "claimcost"){
       return false
     }
    }
   }
  return true;
   }
   
   function filterBondsExpenseCodes(code : String) : boolean {
    if(this.Claim.LossType == typekey.LossType.TC_COMMBONDS) { 
     if(code == LineCategory.TC_ACCOUNTANTS or
       code == LineCategory.TC_ADR_MEDIATION or
       code == LineCategory.TC_APPEAL_BONDS or
       code == LineCategory.TC_APPELLATECOUNSEL or
       code == LineCategory.TC_ATTORNEY_MONITORING or
       code == LineCategory.TC_ATTORNEY_RECOVERY or
       code == LineCategory.TC_ATTORNEY_REP_GAI_BDFTH or 
       code == LineCategory.TC_ATTORNEY_REP_GAI_NOTCV or
       code == LineCategory.TC_ATTORNEY_REP_GAI_TRANS or  
       code == LineCategory.TC_ATTREPGAISURETYDEFENSE or
       code == LineCategory.TC_COLLECTIONAGENCYFEE or
       code == LineCategory.TC_CONSTRUCTIONCONSULTANTS or
       code == LineCategory.TC_COPY_SERVICE or
       code == LineCategory.TC_COURT_FEE or
       code == LineCategory.TC_COURT_REPORTER or
       code == LineCategory.TC_EXPERT or
       code == LineCategory.TC_GAI_TRAVEL or
       code == LineCategory.TC_INDEPENDENT_ADJUSTER or
       code == LineCategory.TC_INTEREST_POST_JUDGE or
       code == LineCategory.TC_INTEREST_PRE_JUDGE or 
       code == LineCategory.TC_INVESTIGATOR or
       code == LineCategory.TC_LEGAL_COST_CONTAIN or
       code == LineCategory.TC_NOT_CLASSIFIED or
       code == LineCategory.TC_SIU_INFO_SERVICES or
       code == LineCategory.TC_SIU_TRAVEL or
       code == LineCategory.TC_TRANSCRIPTION_SERVICE){
         return true
       } 
       return false   
    }
    return true
   }

}
