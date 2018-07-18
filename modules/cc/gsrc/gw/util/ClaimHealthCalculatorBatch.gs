package gw.util
uses java.util.Date
uses gw.api.database.IQueryBeanResult
uses gw.api.system.CCConfigParameters
uses gw.api.database.Query

/**
 * Batch process which adds metrics and indicators to claims that do not have them. 
 * This class allows configuration of the query which will be used to find claims to be updated
 * by the batch process and the work to be done on the claims found to add the metrics and indicators.
 */

@Export
class ClaimHealthCalculatorBatch extends ClaimHealthCalculatorBatchBase {

  static final var DEFAULT_CHUNK_SIZE = 1000

  construct() {
    this(DEFAULT_CHUNK_SIZE)
  }

  /** This constructor is used for testing and allows a configurable chunk size; the default chunk size is used in production */
  construct(chunkSize : int) {
    super(chunkSize)
  }

  /**
   * Return the query used to find claims which need to be processed by the batch 
   * process. Out of the the box this query looks for claims that fall in the loss date 
   * threshold, are not in Draft or Archived state and have never had metrics or indicators
   * calculated for them. 
   */
  override function findClaims() : IQueryBeanResult<Claim> {
    final var lossDateThreshold = Date.CurrentDate.addYears(CCConfigParameters.ClaimHealthCalcMaxLossDateInYears.Value * -1)
    var query = Query.make(Claim)
    query.compareNotIn("State", {ClaimState.TC_DRAFT, ClaimState.TC_ARCHIVED})
    query.compare("LossDate", LessThanOrEquals, Date.CurrentDate)
    query.compare("LossDate", GreaterThanOrEquals, lossDateThreshold)
    query.compare("ClaimMetricRecalculationTime", Equals, null)
    var queryResult = query.select()
    queryResult.orderByDescending(\ c -> c.LossDate)
    return queryResult
  }  

  /**
   * Perform the operation to add metrics/indicators to the passed in claim.
   */
  override function processClaim(claim : Claim) {
    claim.scheduleHealthUpdate()
  }

}