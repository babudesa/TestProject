package gw.entity
uses gw.api.util.DisplayableException

@Export
enhancement GWTransactionLineItemEnhancement : TransactionLineItem
{
  /**
   * Returns true if this transaction line item is associated with a deductible, false otherwise.
   * A line item is considered a deductible line item if all of the following hold:
   * 1. Its line category is "Deductible".
   * 2. It is part of a payment transaction (as opposed to some other type of transaction).
   * 3. Its payment's deductible's transaction line item is identical to this.
   */
  public function isDeductibleLineItem() : boolean {
    return (this.LineCategory == "Deductible") && (this.Transaction typeis Payment) && ((this.Transaction as Payment).SharedDeductible.TransactionLineItem == this)
  }
  
  /**
   * Unlinks the deductible entity associated with this line item.
   * Sets this line item's line category to "Other".
   * Throws a UserDisplayableException if this line item is not a deductible line item.
   */
  public function unlinkDeductible() {
    if (!isDeductibleLineItem()) {
      throw new DisplayableException(displaykey.Deductible.Error.CannotRemoveDeductibleFromNonDeductibleTLI)
    }
    this.Deductible.unlink()
    this.LineCategory = "FormerDeductible"
  }

  /**
   * Returns a list of valid line categories for this line item.
   * The full list of line categories is first filtered by its categories.
   * If the line item currently has a line category of "Deductible" or "FormerDeductible", no further filtering is done.
   * Otherwise, "Deductible" and "FormerDeductible" are removed from the list.
   */
  property get ValidLineCategories() : java.util.List<LineCategory> {
    var fullList = (LineCategory as ITypeList).getTypeKeysByCategories({this.Transaction.Exposure.PrimaryCoverage, this.Transaction.CostType, this.Transaction.CostCategory})
    if(this.Transaction.Claim.LossType == LossType.TC_COMMBONDS){
      var bondsList = new List<LineCategory>()
      if(this.Transaction.CostType == CostType.TC_EXPENSE){
       bondsList.add(LineCategory.TC_ACCOUNTANTS) 
       bondsList.add(LineCategory.TC_ADR_MEDIATION)
       bondsList.add(LineCategory.TC_APPEAL_BONDS)
       bondsList.add(LineCategory.TC_APPELLATECOUNSEL)
       bondsList.add(LineCategory.TC_ATTORNEY_MONITORING)
       bondsList.add(LineCategory.TC_ATTORNEY_RECOVERY)
       bondsList.add(LineCategory.TC_ATTORNEY_REP_GAI_BDFTH)
       bondsList.add(LineCategory.TC_ATTORNEY_REP_GAI_NOTCV)
       bondsList.add(LineCategory.TC_ATTREPGAISURETYDEFENSE)
       bondsList.add(LineCategory.TC_ATTORNEY_REP_GAI_TRANS)
       bondsList.add(LineCategory.TC_COLLECTIONAGENCYFEE)
       bondsList.add(LineCategory.TC_CONSTRUCTIONCONSULTANTS)
       bondsList.add(LineCategory.TC_COPY_SERVICE)
       bondsList.add(LineCategory.TC_COURT_FEE)
       bondsList.add(LineCategory.TC_COURT_REPORTER)
       bondsList.add(LineCategory.TC_EXPERT)
       bondsList.add(LineCategory.TC_GAI_TRAVEL)
       bondsList.add(LineCategory.TC_INDEPENDENT_ADJUSTER)
       bondsList.add(LineCategory.TC_INTEREST_POST_JUDGE)
       bondsList.add(LineCategory.TC_INTEREST_PRE_JUDGE)
       bondsList.add(LineCategory.TC_INVESTIGATOR)
       bondsList.add(LineCategory.TC_LEGAL_COST_CONTAIN)
       bondsList.add(LineCategory.TC_NOT_CLASSIFIED)
       bondsList.add(LineCategory.TC_SIU_INFO_SERVICES)
       bondsList.add(LineCategory.TC_SIU_TRAVEL)
       bondsList.add(LineCategory.TC_TRANSCRIPTION_SERVICE)
      }
      if(this.Transaction.CostType == CostType.TC_CLAIMCOST){
       bondsList.add(LineCategory.TC_APPEAL_BONDS) 
       bondsList.add(LineCategory.TC_ATTORNEY_PLAINTIFF)
       bondsList.add(LineCategory.TC_COLLECTIONAGENCYFEE)
       bondsList.add(LineCategory.TC_IPHSPTLZN)
       bondsList.add(LineCategory.TC_INTEREST_POST_JUDGE)
       bondsList.add(LineCategory.TC_INTEREST_PRE_JUDGE)
       bondsList.add(LineCategory.TC_NOT_CLASSIFIED)
       bondsList.add(LineCategory.TC_OPHSPTLZN)
      }
      
      return bondsList
    }
    if(this.Transaction.Claim.LossType == LossType.TC_OMAVALON){
      var avalonList = new List<LineCategory>()
      if(this.Transaction.CostType == CostType.TC_EXPENSE){
        avalonList.add(LineCategory.TC_ADR_MEDIATION)
        avalonList.add(LineCategory.TC_APPELLATECOUNSEL)
        avalonList.add(LineCategory.TC_ATTORNEY_MONITORING)
        avalonList.add(LineCategory.TC_ATTORNEY_RECOVERY)
        avalonList.add(LineCategory.TC_ATTORNEY_REP_GAI_BDFTH)
        avalonList.add(LineCategory.TC_ATTORNEY_REP_GAI_NOTCV)
        avalonList.add(LineCategory.TC_ATTREPGAISURETYDEFENSE)
        avalonList.add(LineCategory.TC_ATTORNEY_REP_GAI_TRANS)
        avalonList.add(LineCategory.TC_COLLECTIONAGENCYFEE)
        avalonList.add(LineCategory.TC_COPY_SERVICE)
        avalonList.add(LineCategory.TC_COURT_FEE)
        avalonList.add(LineCategory.TC_COURT_REPORTER)
        avalonList.add(LineCategory.TC_EXPERT)
        avalonList.add(LineCategory.TC_GAI_TRAVEL)
        avalonList.add(LineCategory.TC_INDEPENDENT_ADJUSTER)
        avalonList.add(LineCategory.TC_NOT_CLASSIFIED)
        avalonList.add(LineCategory.TC_SIU_INFO_SERVICES)
        avalonList.add(LineCategory.TC_TRANSCRIPTION_SERVICE)
      }
      if(this.Transaction.CostType == CostType.TC_CLAIMCOST){
        avalonList.add(LineCategory.TC_ATTORNEY_PLAINTIFF)
        avalonList.add(LineCategory.TC_COLLECTIONAGENCYFEE)
        avalonList.add(LineCategory.TC_IPHSPTLZN)
        avalonList.add(LineCategory.TC_NOT_CLASSIFIED)
        avalonList.add(LineCategory.TC_OPHSPTLZN)
      }
      return avalonList
    }
    if(util.WCHelper.isWCorELLossType(this.Transaction.Claim)){
      var wcList = new List<LineCategory>()
      for(line in LineCategory.TF_WORKERSCOMPEXPENSECODES.TypeKeys){
        if (line.hasCategory(this.Transaction.CostType)){
          wcList.add(line)
        }
      }
      return wcList
    }
    if(this.Transaction.CostType == CostType.TC_CLAIMCOST and (this.Transaction.Claim.Policy.PolicyType == PolicyType.TC_PRC || this.Transaction.Claim.Policy.PolicyType == PolicyType.TC_PRX)){
      var prodRecallList = new List<LineCategory>()
      for(line in LineCategory.TF_PRODUCTRECALLLOSSCODES.TypeKeys){
        prodRecallList.add(line)
      }
      return prodRecallList
    }
    if(this.Transaction.Claim.LossType == LossType.TC_MERGACQU){
      var mergAcquList = new List<LineCategory>()
      if(this.Transaction.CostType == CostType.TC_EXPENSE){
        for(line in LineCategory.TF_MAEXPENSECODES.TypeKeys){
          mergAcquList.add(line)
        }
      }
      if(this.Transaction.CostType == CostType.TC_CLAIMCOST){
        for(line in LineCategory.TF_MALOSSCODES.TypeKeys){
          mergAcquList.add(line)
        }
      }
      return mergAcquList
    }
    //Filters for Aviation Loss and Expense
    if(this.Transaction.Claim.LossType == LossType.TC_AVIATION){
      var avList = new List<LineCategory>()
      if(this.Transaction.CostType == CostType.TC_EXPENSE){
        for(line in LineCategory.TF_AVEXPENSECODES.TypeKeys){
          avList.add(line)
        }
      }
      if(this.Transaction.CostType == CostType.TC_CLAIMCOST){
        for(line in LineCategory.TF_AVLOSSCODES.TypeKeys){
          avList.add(line)
        }
      }
      return avList
    }
    //Filters for SHSAuto Loss and Expense
    if(this.Transaction.Claim.LossType == LossType.TC_SHSAUTO){
      var shList = new List<LineCategory>()
      if(this.Transaction.CostType == CostType.TC_EXPENSE){
        for(line in LineCategory.TF_SHSAUTOEXPENSECODES.TypeKeys){
          shList.add(line)
        }
      }
      if(this.Transaction.CostType == CostType.TC_CLAIMCOST){
        for(line in LineCategory.TF_SHSAUTOLOSSCODES.TypeKeys){
          shList.add(line)
        }
      }
      return shList
    }
    //Filters for AltMarketsAuto Loss and Expense
    if(this.Transaction.Claim.LossType == LossType.TC_ALTMARKETSAUTO){
      var amList = new List<LineCategory>()
      if(this.Transaction.CostType == CostType.TC_EXPENSE){
        for(line in LineCategory.TF_ALTMARKETSAUTOEXPENSECODES.TypeKeys){
          amList.add(line)
        }
        return amList
      }
      if(this.Transaction.CostType == CostType.TC_CLAIMCOST){
        for(line in LineCategory.TF_ALTMARKETSAUTOLOSSCODES.TypeKeys){
          amList.add(line)
        }
      }
      return amList.sortBy(\ l -> l.DisplayName)
    }
    //Filters for TruckingAuto Loss and Expense
    if(this.Transaction.Claim.LossType == LossType.TC_TRUCKINGAUTO){
      var tkList = new List<LineCategory>()
      if(this.Transaction.CostType == CostType.TC_EXPENSE){
        for(line in LineCategory.TF_TRUCKINGAUTOEXPENSECODES.TypeKeys){
          tkList.add(line)
        }
      }
      if(this.Transaction.CostType == CostType.TC_CLAIMCOST){
        for(line in LineCategory.TF_TRUCKINGAUTOLOSSCODES.TypeKeys){
          tkList.add(line)
        }
      }
      return tkList
    }
    return fullList.where( \ t ->
      (this.LineCategory=="Deductible")
      or (this.LineCategory=="FormerDeductible")
      or (t!=LineCategory.TC_DEDUCTIBLE and t!=LineCategory.TC_FORMERDEDUCTIBLE)
    ).cast( LineCategory )
  }
}

/**
   * Returns a list of valid line categories for this line item.
   * for Reportability for check
    */
/*public function lineCategoryForReportabilty() : boolean {
   if(this.LineCategory =="indemnity" or this.LineCategory=="medicarereimbursement" or this.LineCategory=="medicaresetaside" ) {
      return true
   }else
      return false
   }
}*/
