package gw.util
uses gw.processes.BatchProcessBase
uses java.util.Date
uses gw.api.system.CCConfigParameters
uses gw.api.system.PLLoggerCategories
uses gw.api.util.Logger //Added for logging in Debug - SR

@Export
class ClaimHealthCalculatorBatch extends BatchProcessBase {

  static final var MAX_CLAIM_RESULTS = CCConfigParameters.MaxClaimResultsPerClaimHealthCalcBatch.Value
  static final var MAX_LOSS_DATE_YEARS = CCConfigParameters.ClaimHealthCalcMaxLossDateInYears.Value
  
  construct() {
    super(BatchProcessType.TC_CLAIMHEALTHCALC)
  }

  override function doWork() : void {
    var count = 0
    var matchedClaims = findClaims()
    final var numFound = matchedClaims.getCount()

    if(matchedClaims.getCount() != 0) {
      for (claim in matchedClaims) {
        gw.transaction.Transaction.runWithNewBundle( \ bundle -> {
          var c = bundle.add(claim)
          c.scheduleHealthUpdate()
        })
        count = count + 1
        if (count >= MAX_CLAIM_RESULTS) {
          PLLoggerCategories.SERVER_BATCHPROCESS.info(displaykey.Web.InternalTools.BatchProcess.ClaimHealthCalculator.ExceedsNumClaimResults(MAX_CLAIM_RESULTS, MAX_CLAIM_RESULTS, numFound))
          //changed to logging in Debug - SR
          Logger.logDebug(displaykey.Web.InternalTools.BatchProcess.ClaimHealthCalculator.ExceedsNumClaimResults(MAX_CLAIM_RESULTS, MAX_CLAIM_RESULTS, numFound))
          break
        }
      }
    }    
  }
  
  override function checkInitialConditions() : boolean {
    return true 
  }
  
  private function findClaims() : ClaimQuery {
    var finder = find (c in Claim
        where c.State != ClaimState.TC_DRAFT 
        and c.State != ClaimState.TC_ARCHIVED
        and c.LossDate <= Date.CurrentDate
        and c.LossDate >= Date.CurrentDate.addYears(MAX_LOSS_DATE_YEARS * -1)
        and c.ClaimMetricRecalculationTime == null)
    finder.addDescendingSortColumn("Claim.LossDate")
    return finder
  }  
}
