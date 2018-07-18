package gw.util
uses java.math.BigDecimal
uses gw.api.util.Logger
uses gw.api.system.CCConfigParameters
uses gw.api.util.CurrencyUtil
uses java.text.NumberFormat

@Export
class BackupWithholdingCalculator
{
  construct()
  {
    _standardWithholding = CCConfigParameters.StandardWithholdingRate.Value
    var code = CCConfigParameters.BackupWithholdingTypeCode.Value
    _deductionType = DeductionType.get( code )
  }
  
  private var _standardWithholding : double
  private var _deductionType : DeductionType

  private var _reportableTypes = {
    ReportabilityType.TC_REPORTABLE
  }

  public function computeDeductions(check : Check) : Deduction[] {
    if (check == null || check.ReportableAmount == null) {
      return new Deduction[0]
    }
    
    var withholdingRate = getWithholdingRate(check)
    if (withholdingRate != null) {
      var withholding = new Deduction(check.Bundle)
      // withholdingRate is a percentage (0 - 100), so must move the decimal
      // point to get dollars
      withholding.Check = check
      var deductionTransAmount = withholdingRate.movePointLeft(2).multiply(check.ReportableAmount)
      deductionTransAmount = CurrencyUtil.roundToCurrencyScale(deductionTransAmount, check.Currency, CurrencyUtil.getRoundingMode())
      withholding.TransactionAmount = deductionTransAmount
      var claimCurrency = check.Claim.Currency
      withholding.ClaimAmount = CurrencyUtil.convertAmount(deductionTransAmount, check.Currency, claimCurrency, check.TransToClaimExchangeRateEntityRate, true)
      if( CurrencyUtil.getReportingCurrency() == check.Currency ) {
        withholding.ReportingAmount = deductionTransAmount
      } else {
        withholding.ReportingAmount = CurrencyUtil.convertAmount(withholding.ClaimAmount, claimCurrency, CurrencyUtil.getReportingCurrency(), check.ClaimToReportingExchangeRateEntityRate, true)
      }
      withholding.DeductionType =_deductionType
      Logger.logInfo(displaykey.Java.Financials.BackupWithholding.ComputeDeductions( withholding.getAmount()))
      return new Deduction[]{withholding}
    }
    return new Deduction[0]
  }

  private function getWithholdingRate(check : Check) : BigDecimal {
    // If one of the payees is a vendor, and the payment is reportable
    if (isReportable(check.Reportability)) {
      var vendor = check.Vendor
      if (vendor == null) {
        Logger.logWarning( displaykey.Java.Financials.BackupWithholding.GetWithholdingRate.NullVendor(check.ID))
        return null
      }

      // if vendor's withholding rate is non-null, then withholding applies, with the vendor's rate
      // if withholding rate is null, then if tax status is unknown, unconfirmed, then apply the default rate
      // otherwise, no withholding
      var rate = vendor.WithholdingRate
      if (rate == null) {
        if (!(TaxStatus.TC_CONFIRMED == vendor.TaxStatus)) {
          Logger.logDebug(displaykey.Java.Financials.BackupWithholding.GetWithholdingRate.UnknownTaxStatus(vendor.DisplayName, _standardWithholding))
          return new BigDecimal(_standardWithholding)
        } else {
          return null
        }
      } else {
        if (rate.IsZero) {
          return null
        } else {
          Logger.logDebug(displaykey.Java.Financials.BackupWithholding.GetWithholdingRate.Rate(vendor.DisplayName, NumberFormat.getIntegerInstance().format(rate)))
          return rate
        }
      }
    }
    return null
  }

  private function isReportable(type : ReportabilityType) : boolean {
    for (var reportableType in _reportableTypes) {
      if (reportableType == type) {
        return true
      }
    }
    return false
  }
}
