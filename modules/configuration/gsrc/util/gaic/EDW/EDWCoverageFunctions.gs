package util.gaic.EDW;
uses templates.messaging.edw.CoverageTemplateEDW

class EDWCoverageFunctions {
  
  private construct() {
  }
  
  static function getInstance() : EDWCoverageFunctions {
    return new EDWCoverageFunctions();
  }
  
  function sendCoverageChanges(messageContext : MessageContext, claim : Claim, objStatus : String, cvrg_risktype : String) {
    for (thecoverage in claim.Policy.Coverages) { 
      createPolicyCoveragePayload(messageContext, thecoverage, objStatus, cvrg_risktype);
    }
  }

  protected function createPolicyCoveragePayload(messageContext : MessageContext, thecoverage : PolicyCoverage, objStatus : String, cvrgRiskType : String) {
    var templateData = CoverageTemplateEDW.renderToString(thecoverage.Policy, thecoverage, objStatus, displaykey.EDW.Templates.CVRG, cvrgRiskType);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  }
  
  protected function policyCoverageChanges(policy : Policy, policyCoverage : PolicyCoverage) : boolean {
    var fields = new String[] { "OpsRiskEBIExt", "OpsRiskEBIInstExt" };
    if (policy.Verified
    && util.gaic.CommonFunctions.fieldFromListChanged(policyCoverage, fields)) {
      return true;
    }
    if (!policy.Verified and (isCoverageFieldChanged( policyCoverage ) or isCoverageDeductiblesChanged( policyCoverage ))) {
      return true;
    }
    
    return false;
  }

  protected function coverageFieldChanged(policy : Policy) : boolean {
    // policy property changes including property coverage changes
    for (p in policy.Properties) {
      for (coverage in p.Coverages) {
        if (!coverage.New && coverage typeis PropertyCoverage) {
          if (propertyCoverageChanges( coverage )) {
            return true;
          }
        }
      }
    }
    
    //vehicle coverage changes
    for (v in policy.Vehicles) {
      for (coverage in v.Coverages) {
        if (!coverage.New && coverage typeis VehicleCoverage) {
          if (vehicleCoverageChanges( coverage )) {
            return true;
          }
        }
      }
    }
    
    // policy coverage changes
    for (coverage in policy.Coverages) {
      if (!coverage.New) {
        if (policyCoverageChanges( policy, coverage )) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  protected function propertyCoverageChanges(propertyCoverage : PropertyCoverage) : boolean {
    var fields = new String[] { "RiskEBIExt","RiskEBIInstExt" };
    if (verifiedCoverageChanges(propertyCoverage)) {
      return true;
    }
    if (util.gaic.CommonFunctions.fieldFromListChanged(propertyCoverage, fields)) {
      return true;
    }
    // coverage sublimit changes
    if (!propertyCoverage.Policy.Verified) {
      if (isCoverageFieldChanged( propertyCoverage )) {
        return true;
      }
      if (isCoverageSubLimitChanged( propertyCoverage )) {
        return true;
      }
    }
    return false;
  }

  protected function vehicleCoverageChanges(vehicleCoverage : VehicleCoverage) : boolean {
    var fields = new String[] { "ClaimAggLimit", "NonmedAggLimit","PersonAggLimit","ReplaceAggLimit" };
    if (verifiedCoverageChanges(vehicleCoverage)) {
      return true;
    }
    // coverage sublimit changes
    if (!vehicleCoverage.Policy.Verified) {
      if (isCoverageFieldChanged( vehicleCoverage )) {
        return true;
      }
      if (util.gaic.CommonFunctions.fieldFromListChanged(vehicleCoverage, fields)) {
        return true;
      }
    }
    return false;
  }
  
  public function isCoverageSubLimitChanged(coverage : Coverage) : boolean {
    var fields = new String[] { "CoverageLimitTypeExt", "CoverageBasisExt", "CoverageLimitAppExt","LimitAmountExt" };
    if (!coverage.Policy.Verified) {
      if (coverage.getRemovedArrayElements( "CoverageBasisLimitsExt" ) != null
      && coverage.getRemovedArrayElements( "CoverageBasisLimitsExt" ).length > 0) {
        return true;
      }
      for (limitItem in coverage.CoverageBasisLimitsExt) {
        if (util.gaic.CommonFunctions.fieldFromListChanged(limitItem, fields)) {
          return true;
        }
      }
    }
    return false;
  }

  private function isCoverageFieldChanged(coverage : Coverage) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(coverage, new String[] { "Type","State", "Deductible","CovLimitExt","AggregateLimitExt","CoverageBasisExt",
    "EffectiveDate","ExpirationDate","CoverageRetroDateExt","BasicExtdPeriodAmtExt","BasicExtdPeriodUnitExt","SupplExtdPeriodAmtExt","SupplExtdPeriodUntExt",
    "SupplExtdRprtgPeriodExt","ReinAggLmtIndicatorExt", "ClaimsMadeIndicatorExt", "ExcessIndExt", "CoverageLayerTypeExt", "CovAttachmentPointExt", "CoverageFollowFormExt", 
    "QuotaShareIndExt", "CoveragePartPctExt"})) {
      return true;
    }
    return false;
  }

  private function verifiedCoverageChanges(coverage : Coverage) : boolean {
    var fields = new String[] { "CoverageEBIExt", "CoverageEBIInstExt","ClassCodeEBIExt","ClassCodeEBIInstExt" };
    if (coverage.Policy.Verified and util.gaic.CommonFunctions.fieldFromListChanged(coverage, fields)) {
      return true;
    }
    return false;
  }
    
  public function isCoverageDeductiblesChanged(coverage : Coverage) : boolean {
    var fields = new String[] { "Deductible", "DeductibleText", "DeductLimitAppExt" };
    if (!coverage.Policy.Verified) {
      if (coverage.getRemovedArrayElements( "DeductiblesExt" ) != null
      && coverage.getRemovedArrayElements( "DeductiblesExt" ).length > 0) {
        return true;
      }
      for (deductItem in coverage.DeductiblesExt) {
        if (util.gaic.CommonFunctions.fieldFromListChanged(deductItem, fields)) {
          return true;
        }
      }
    }
    return false;
  }
}
