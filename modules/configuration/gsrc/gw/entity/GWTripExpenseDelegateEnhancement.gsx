package gw.entity
uses java.util.Date
uses gw.api.financials.CurrencyAmount

@Export
enhancement GWTripExpenseDelegateEnhancement : entity.TripExpenseDelegate {

  /**
   * Sum of the PaidAmount, AgentFees and OtherFees fields, or zero if the Assessment field
   * does not have the given value.
   */
  function getBaseFinancialImpact(approvalStatus : AssessmentAction) : CurrencyAmount {
    return getSumIfMatchesAssessment(approvalStatus, {this.PaidAmount, this.AgentFees, this.OtherFees})
  }
  
  /**
   * Sums all the non null amounts in the given array, providing the Assessment field
   * has the given value. Otherwise returns zero.
   */
  function getSumIfMatchesAssessment(approvalStatus : AssessmentAction, amounts : CurrencyAmount[]) : CurrencyAmount {
    var zero = CurrencyAmount.getStrict(0.00, this.ClaimCurrency)
    var total = zero
    if (this.Assessment == approvalStatus) {
      for (amount in amounts) {
        if (amount != null) {
          total += amount
        }
      }
    }
    return total
  }

  /**
   * When the assessment field of a trip expense is updated we create history events and/or
   * activities as follows:
   * <ul>
   * <li>If the assessment field used to be "Deny" we create a "DataChange" history event
   * <li>If the assessment field is now "approve" we create a "DataChange" history event unless it used
   *     be "Deny"
   * <li>If the assessment field is "Review" we create a review activity, or add another note to the
   *     existing review activity if there is one
   * <li>If the assessment field is "Deny" we create a "DataChange" history event and a new note
   *     explaining the denial
   * <li>If the assessment field is cleared we create a "DataChange" history event unless it used to be
   *     "Deny"
   * </ul>
   */
  function onPreUpdate(claim : Claim, today : Date, typeToBeReviewed : String) {
    if (this.isFieldChanged("Assessment")) {
      var usedToBeDenied = createHistoryEventIfUsedToBeDenied(claim)
      switch (this.Assessment) {
        case "approve": 
          if (not usedToBeDenied) { 
            claim.createCustomHistoryEvent("DataChange", displaykey.Rules.Preupdate.Claim.TripExpenseApprovedHistoryEvent(this.Assessment.DisplayName, this.DisplayName))
          }
          break
        case "Review":
          var actSubject = displaykey.Rules.Preupdate.Claim.TripExpenseReviewActivitySubject(this.DisplayName)
          var actDescription = displaykey.Rules.Preupdate.Claim.TripExpenseReviewActivityDescription(typeToBeReviewed)
          var existingActivity = claim.Activities.firstWhere(\ a -> a.Subject ==  actSubject and a.ActivityPattern.Code == "employee_review" and a.Status == "open")
          if (existingActivity == null) {
            claim.createActivity(null, ActivityPattern.finder.getActivityPatternByCode("employee_review"), actSubject , actDescription, "normal", false, today, today.addBusinessDays(5))
          } else {
            var newNote = claim.addNote("investigation", displaykey.Rules.Preupdate.Claim.TripExpenseReviewAgainNote(this.DisplayName, typeToBeReviewed))
            newNote.Activity = existingActivity                  
          }
          break
        case "Deny":
          claim.createCustomHistoryEvent("DataChange", displaykey.Rules.Preupdate.Claim.TripExpenseDeniedHistoryEvent(this.Assessment.DisplayName, this.DisplayName))          
          claim.addNote("denial",  displaykey.Rules.Preupdate.Claim.TripExpenseDeniedNote(this.Assessment.DisplayName, this.DisplayName, this.ReasonForDenial))
          break
        // If cleared create a history event
        case null:
          if (not ((this as KeyableBean).New or usedToBeDenied)) {
            claim.createCustomHistoryEvent("DataChange", displaykey.Rules.Preupdate.Claim.TripExpenseClearedHistoryEvent(this.DisplayName, this.getOriginalValue("Assessment")))
          }
          break
      }        
    }
  }
  
  private function createHistoryEventIfUsedToBeDenied(claim : Claim) : boolean {
    var usedToBeDenied = this.getOriginalValue("Assessment") == AssessmentAction.TC_DENY
    if (usedToBeDenied) {
      var status = this.Assessment == null ? displaykey.Rules.Preupdate.Claim.TripExpenseAssessmentCleared : this.Assessment.DisplayName  
      claim.createCustomHistoryEvent("DataChange", displaykey.Rules.Preupdate.Claim.TripExpenseUsedToBeDeniedHistoryEvent(status, this.DisplayName, this.ReasonForDenial))      
      this.ReasonForDenial = null
    }
    return usedToBeDenied
  }

}