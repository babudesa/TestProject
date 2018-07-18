package gw.entity
uses gw.api.financials.FinancialsCalculationUtil
uses java.math.BigDecimal
uses java.util.Date
uses gw.api.util.CurrencyUtil
uses gw.policy.notification.LargeLossPolicySystemNotification

enhancement GWClaimReinsuranceEnhancement : entity.Claim {
  function createReinsuranceReviewActivity() {
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode( "claim_reinsurance_review" )
    this.createActivityFromPattern( null, activityPattern)
  }
  
  function createReinsuranceReviewActivityForWCPaymentsExceeding12Months() {
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode( "claim_reinsurance_review" )
    this.createActivity( null, activityPattern, null, displaykey.Rules.PreUpdate.Transaction.Reinsurance.Review.PaymentsExceeds12Months, null, null, null, null ).assign( this.AssignedGroup, this.AssignedUser )
  }
  
  function markClaimForReinsurance() {
    this.ReinsuranceReportable = true
    this.ReinsuranceFlaggedStatus = ReinsuranceFlaggedStatus.TC_SYSTEMFLAGGED
  }

  function isReinsuranceFieldSet() : Boolean {
    return (this.ReinsuranceReportable != true) && (this.ReinsuranceFlaggedStatus != ReinsuranceFlaggedStatus.TC_USERUNFLAGGED)    
  }
  
  function setReinsuranceIfTotalIncurredOverThreshold() {
    var hasMatchingCoverage : boolean = false
    var policyThresholds = find (threshold in ReinsuranceThreshold 
                                           where threshold.PolicyType == this.Policy.PolicyType
      	                                 and ((threshold.StartDate == null and threshold.EndDate == null)
      	                                   or (threshold.StartDate <= this.LossDate and threshold.EndDate >= this.LossDate)
      	                                   or (threshold.StartDate == null and threshold.EndDate >= this.LossDate)
      	                                   or (threshold.EndDate == null and threshold.StartDate <= this.LossDate))
    )

    for (threshold in policyThresholds) {
      var currentTotal : BigDecimal = 0
      var actualThreshold = threshold.ThresholdValue * (threshold.ReportingThreshold / 100.00)

      if (threshold.TreatyType == ReinsuranceTreatyType.TC_WC) {
        currentTotal = FinancialsCalculationUtil.getTotalIncurredNet().getAmount( this );
      } else { 
        if (threshold.LossCauses.hasMatch( \ r -> r.LossCause == this.LossCause ) || threshold.LossCauses.length == 0) {
          for (exposure in this.Exposures) {
            if (threshold.CoverageTypes.hasMatch( \ c -> c.Coverage == exposure.PrimaryCoverage)) {
              hasMatchingCoverage = true
              var grossTotalIncurred = FinancialsCalculationUtil.getTotalIncurredGross().getAmount( exposure )
              if (grossTotalIncurred != null) { 
                currentTotal = currentTotal + grossTotalIncurred 
              }
            }
          }
        }
        
        if ( hasMatchingCoverage ) {
          var grossTotalIncurred = FinancialsCalculationUtil.getTotalIncurredGross().getClaimLevelAmount( this ) 
          if (grossTotalIncurred != null) { 
            currentTotal = currentTotal + grossTotalIncurred 
          }
        }
      }

      // support for multicurrency, convert the total to the currency in which the reinsurance threshold was created
      if(this.Policy.Currency != CurrencyUtil.getDefaultCurrency()) {
        currentTotal = CurrencyUtil.convertAmount(currentTotal, this.Policy.Currency, CurrencyUtil.getDefaultCurrency(), null )
      }
      
      if(currentTotal >= actualThreshold && this.isReinsuranceFieldSet()) {
        this.markClaimForReinsurance()
        this.createReinsuranceReviewActivity()
        this.ReinsuranceReason = displaykey.Rules.PreUpdate.Transaction.Reinsurance.Note.GTIExceededThreshold( CurrencyUtil.renderAsCurrency( actualThreshold, CurrencyUtil.getDefaultCurrency()) )
        this.addNote( NoteTopicType.TC_REINSURANCE, displaykey.Rules.PreUpdate.Claim.Reinsurance.Note.ClaimMarkedForReinsurance, displaykey.Rules.PreUpdate.Transaction.Reinsurance.Note.GTIExceededThreshold( CurrencyUtil.renderAsCurrency( actualThreshold, CurrencyUtil.getDefaultCurrency()) ) )
      }
    }
  }

  function setReinsuranceIfContinuousWCInjuryPaymentsExceed12Months() {
    var lastSendDate : Date
    var firstSendDate : Date
    var hasBIClaimCost : boolean

    for (check in this.getChecksIterator( false )) {
      // only claim cost bodily injury payments are counted
      for (payment in (check as Check).Payments) {
        if (payment.Exposure.ExposureType == ExposureType.TC_WCINJURYDAMAGE AND
            payment.CostType == CostType.TC_CLAIMCOST) {
          hasBIClaimCost = true
        }
      }
  
      if (hasBIClaimCost) {
        var sendDate = (check as Check).ScheduledSendDate
        if (lastSendDate == null && firstSendDate == null) {
          firstSendDate = sendDate
          lastSendDate = sendDate
        } else {
          if (sendDate.before( firstSendDate )) {
            firstSendDate = sendDate
          }
    
          if (sendDate.after(lastSendDate)) {
            lastSendDate = sendDate
          }
        } 
      }
    }

    if (firstSendDate != null && lastSendDate != null) {
      if (lastSendDate.trimToMidnight().after(firstSendDate.addYears(1))) {
        this.createReinsuranceReviewActivityForWCPaymentsExceeding12Months()
      }
    }
  }

  // -------------------------------------------------- large loss notification methods

  function exceedsLargeLossThreshold() : boolean {
    var totalIncurred = FinancialsCalculationUtil.getTotalIncurredGross().getAmount(this)
    var thresholdValue = LargeLossThreshold.getThreshold(this.Policy.PolicyType, LargeLossNotificationType.TC_PS).ThresholdValue
    if (totalIncurred != null and thresholdValue != null) {
      totalIncurred = totalIncurred.convert( CurrencyUtil.getDefaultCurrency(),  CurrencyUtil.getRoundingMode() )
      return (totalIncurred >= thresholdValue)
    }
    return false
  }
  
  function addLargeLossEvent() {
    this.addEvent(LargeLossPolicySystemNotification.EVENT_NAME)
  }
}
