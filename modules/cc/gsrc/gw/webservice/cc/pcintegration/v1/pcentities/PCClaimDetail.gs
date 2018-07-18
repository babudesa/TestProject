package gw.webservice.cc.pcintegration.v1.pcentities
uses java.math.BigDecimal

@Export
class PCClaimDetail
{
  static var remainingReservesCalculator = gw.api.financials.FinancialsCalculationUtil.getFinancialsCalculation(
                                      gw.api.financials.FinancialsCalculationUtil.getRemainingReservesExpression())
  static var totalPaidCalculator = gw.api.financials.FinancialsCalculationUtil.getFinancialsCalculation(
                                      gw.api.financials.FinancialsCalculationUtil.getTotalPaymentsExpression())
  static var totalRecoveriesCalculator = gw.api.financials.FinancialsCalculationUtil.getFinancialsCalculation(
                                      gw.api.financials.FinancialsCalculationUtil.getTotalRecoveriesExpression())                                    
  
  var _pcClaim : PCClaim as pcClaim 
  
  var _claimPublicId : String as ClaimPublicID 
  var _claimInfoPublicId : String as ClaimInfoPublicID
  var _description : String as Description
  var _litigation : Boolean as Litigation
  var _injury : Boolean as Injury
  var _remainingReserves : BigDecimal as RemainingReserves
  var _totalPaid : BigDecimal as TotalPaid
  var _recoveries : BigDecimal as Recoveries
  var _claimSecurityType : String as ClaimSecurityType

  // typelists 
  var _lossCause : String as LossCause
   
  construct()
  {
  }

  construct( ccClaim : Claim )
  {
    _pcClaim = new PCClaim(ccClaim)
    _claimPublicId = ccClaim.PublicID
    _lossCause = ccClaim.LossCause.DisplayName
    _description = ccClaim.Description
    _claimSecurityType = ccClaim.PermissionRequired.Code
    _litigation = (ccClaim.Matters.length > 0)
    _injury = (ccClaim.InjuryIncidentsOnly.length > 0) or (ccClaim.ClaimInjuryIncident != null)
    _remainingReserves = remainingReservesCalculator.getAmount(ccClaim).Amount
    _totalPaid = totalPaidCalculator.getAmount(ccClaim).Amount
    _recoveries = totalRecoveriesCalculator.getAmount(ccClaim).Amount
  }

  construct(ccClaimInfo : ClaimInfo) {
    _pcClaim = new PCClaim(ccClaimInfo)  
    _claimInfoPublicId = ccClaimInfo.PublicID
  }
}
