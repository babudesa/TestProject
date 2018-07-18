package gw.entity
uses gw.api.system.CCConfigParameters
uses gw.api.util.DateUtil
uses java.util.Date

@ReadOnly
enhancement GWReserveEnhancement : entity.Reserve {
  /**
   * Determines if the Reserve should be considered as part of the initial reserves made (true) or if it 
   * is a change to reserves.  Uses the Config Parameter "InitialReserveAllowedPeriod" to determine
   * this.  For claim-level reserves, the window of time for initial reserves begins on the claim's 
   * reported date, for exposure-level reserves it begins on the exposure's create date.  If reserve.Claim
   * and reserve.Exposure are both null, returns false.  Does not take the reserve's state into account.
   */
  function isInitialReserve() : boolean {
    if (this.Claim == null) {
      return false
    }
    
    var reserveApprovedDate = this.TransactionSet.ApprovalDate
    if (reserveApprovedDate == null) {
      reserveApprovedDate = this.CreateTime
      if (reserveApprovedDate == null) {
        // the reserve is new, so create time is still null
        reserveApprovedDate = Date.CurrentDate
      }
    }
    
    var beginDate : Date
    if (this.Exposure != null) {
      beginDate = {this.Exposure.CreateTime, Date.CurrentDate}.firstWhere(\ d -> d != null)
    } else {
      beginDate = {this.Claim.ReportedDate, this.Claim.CreateTime, Date.CurrentDate}.firstWhere(\ d -> d != null )
    }        

    return beginDate != null and DateUtil.businessDaysBetween(beginDate, reserveApprovedDate, this.Claim.LossLocation) <= CCConfigParameters.InitialReserveAllowedPeriod.Value
  }  
}
