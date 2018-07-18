package gw.webservice.cc.pcintegration.v1.pcentities

uses java.util.Date
uses java.math.BigDecimal

@Export
class PCClaim {
  
  static var netTotalIncurredCalculator = gw.api.financials.FinancialsCalculationUtil.getFinancialsCalculation(
                                      gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNetRecoveriesExpression())
  
  var _claimNumber : String as ClaimNumber
  var _lossDate : Date as LossDate
  var _policyNumber : String as PolicyNumber
  var _policyTypeName : String as PolicyTypeName
  var _totalIncurred : BigDecimal as TotalIncurred

  // typelists
  var _status : String as Status

  construct()
  {
  }

  construct( ccClaim : Claim )
  {
    _claimNumber = ccClaim.ClaimNumber
    _policyNumber = ccClaim.Policy.PolicyNumber
    _lossDate = ccClaim.LossDate
    _status = ccClaim.State.Description
    _policyTypeName = ccClaim.Policy.PolicyType.DisplayName
    _totalIncurred = netTotalIncurredCalculator.getAmount(ccClaim).Amount
  }
  
  construct(ccClaimInfo : ClaimInfo) {
    _claimNumber = ccClaimInfo.ClaimNumber
    _policyNumber = ccClaimInfo.PolicyNumber
    _lossDate = ccClaimInfo.LossDate
    if (ccClaimInfo.ArchiveState != null) {
      _status = ArchiveState.TC_ARCHIVED.DisplayName
    }
  }
}