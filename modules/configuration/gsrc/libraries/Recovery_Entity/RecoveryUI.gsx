package libraries.Recovery_Entity
uses java.util.ArrayList

enhancement RecoveryUI : entity.Recovery {

  /**
  * Fitlers the reserve lines for the RecoveryDetialDV pcf.  We have to insure that
  * GAI as TPA cost types are not mixed with non GAI as TPA cost type reserve lines
  */
  @Param("reserveLines", "list of all payable reserve lines")
  @Returns("List of fileterd reserve lines")
  public function filterReserveLines(reserveLines : List <ReserveLine> ) : List <ReserveLine> {

    var validCostTypes : List <CostType>  = this.getValidCostTypeValues()
    var filteredReserveLines : List <ReserveLine>  = new ArrayList <ReserveLine> ()

    //filter reserve lines based on valid cost types for the claim
    filteredReserveLines = reserveLines.where( \ r->exists(costType in validCostTypes where r.CostType == costType))

    //add the "New.." reserve line back into the filtered list
    if (!exists(rl in filteredReserveLines where rl == reserveLines.last())) {
      filteredReserveLines.add(reserveLines.last())
    }

    return filteredReserveLines
  }

  /**
  * Gets all valid Cost Types for this recovery
  */
  @Returns("List of the valid cost types for this recovery")
  public function getValidCostTypeValues() : List <CostType> {

    var validCostTypes : List <CostType>  = new ArrayList <CostType> ()
    var claim = this.Claim

    //includes new GAI as TPA cost types for E&S currenlty only allowed in local & dev & int environments
    if ((claim.LossType == LossType.TC_SPECIALTYES and claim.Policy.PolicyType != PolicyType.TC_PRC and claim.Policy.PolicyType != PolicyType.TC_PRX)) {

      //if this recovery is not bulked then show all types
      if (!this.IsBulkedExt || (this.IsBulkedExt && (this.FirstBulkExt || this.FirstBulkExt == null) || this.ex_CashReceiptNumber == null)) {
        validCostTypes.addAll(typekey.CostType.getTypeKeys(false))
      //if this is a bulk recovery check to see if the recovery is a GAI as TPA revovery
      } else if (this.IsBulkedExt) {
        if (this.IsGAITPABulkRecovery) {
          validCostTypes.addAll(typekey.CostType.TF_GAI_TPA_TYPES.TypeKeys)
        } else {
          validCostTypes.addAll(typekey.CostType.TF_STANDARD_TYPES.TypeKeys)
        }
      }

    } else {
      validCostTypes = typekey.CostType.TF_STANDARD_TYPES.TypeKeys
    }

    return validCostTypes
  }

  /**
  * Checks the cost type of this recovery and determines if it is a
  * GAI as TPA recovery
  */
  public property get IsGAITPABulkRecovery() : boolean {

    var isGAITPA : boolean
    var recovery = util.financials.RecoveryUtil.getRecovery(this.ex_CashReceiptNumber)
    
    if (recovery.CostType == CostType.TC_GAIASTPAEXPENSE || recovery.CostType == CostType.TC_GAIASTPALOSS) {
      isGAITPA = true
    } else {
      isGAITPA = false
    }
    return isGAITPA
  }

} //End RecoveryUI
