package libraries
uses java.util.ArrayList

/**
 * Creates exposures for worker's comp claims, if the state of the claim requires
 * them and they are not already present. Provides two different methods for
 * doing this, a legacy method based on severity and a newer approach based on
 * relevant fields on the claim. Customers may choose to use either method
 * (customized as necessary) but should not use both
 */
@Export
enhancement FNOL : entity.Claim {

  /**
   * Create Workers' Comp exposures based on:
   * <ul>
   * <li>Medical Report flag set or Incident Report is false - create Medical exposure
   * <li>Time Loss Report or Death Report flags set - create Indemnity exposure
   * <li>Employers' Liability Loss Type selected - create Employers' Liability exposure
   * <li>(Vocational Rehab exposures can only be created from the Actions Menu)
   * </ul>
   */
  // 8.18.15 - cmullin - updated the function to dynamically set the Coverage and 
  // CoverageSubType for each new exposure based on the Select Coverage value. Features
  // will only be created if the user has chosen a Coverage for the claim.
  
  function createRelevantWorkCompExposures() {     
    var cov : Coverage = this.CoverageSelectedExt
    if (util.WCHelper.isELLossType(this) && this.IncidentReport==false){
      createAndSetUpExposure(cov.Type, cov.Type+"_em")
    }else{
      if (this.MedicalReport or this.IncidentReport==false){
        createAndSetUpExposure(cov.Type, cov.Type+"_md") 
      }  
      if(this.TimeLossReport || this.DeathReport){
        createAndSetUpExposure(cov.Type, cov.Type+"_in")
      }
    }
    ensureNoGapsInExposureNumbers()
  }
  
  // 11.10.15 - cmullin - changed this function to 'public' so that it can be called on NewExposureDV.wc_indemnity_timeloss and 
  // NewExposureDV.wc_vocational_rehab in the case where these two Exposure Types are created through the Actions Menu and 
  // not through the createRelevantWorkCompExposures() function above.
  
  public function setExposureDefaults(exp : Exposure){
    exp.TypeOfLossMostExt = exp.Claim.TypeOfLossMostExt
    exp.Claimant = exp.Claim.claimant
    exp.MinorChildExt = exp.Claim.InjuredWorker.MinorWorkerExt
    // 10.13.15 - cmullin - using exp.setCoverage instead of "exp.Coverage = exp.Claim.CoverageSelectedExt".
    // This existing function properly sets the Exposure coverage to prevent errors on Select and Refresh Policy.
    exp.setCoverage( exp.Claim.CoverageSelectedExt )
    exp.AttorneyRepExt = exp.Claim.AttorneyRepExt
    exp.ReservedFileExt = exp.Claim.ReservedFileExt
    exp.RptCreateDateExt = gw.api.util.DateUtil.currentDate()
    // 11.10.15 - Defect 7991 - Loss Party on all WC & EL features will automatically be set to "third party". This was also added to setFeatureLossParty() on 
    // ExposureUI.gsx but it must be in both places to catch auto-created features (here) and features created through the Actions Menu (ExposureUI).
    exp.LossParty = LossPartyType.TC_THIRD_PARTY
    // 11.6.15 - cmullin - Defect 7927 - after the first WC feature(s) is/are auto-created as part of the new claim process (or when a claim is opened
    // as part of the I/O reopen process), Claim.AttyorneyRepExt and Claim.ReservedFileExt should be cleared so they are not used to set values on future 
    // auto-created features, per WC requirements. The logic below tests to confirm that the values are cleared only after they are initially used to populate 
    // 1. the initial Medical feature, 2. the initial Medical and Indemnity features or 3. the initial Employers' Liability feature.  
    if(exp.Claim.TimeLossReport==false or exp.Claim.Exposures.length==2 or exp.ExposureType=="wc_employers_liability" and
      (exp.Claim.AttorneyRepExt !=null and exp.Claim.ReservedFileExt != null)){
        exp.Claim.AttorneyRepExt = null
        exp.Claim.ReservedFileExt = null
    }
    // 3.8.16 - dcarson2 - defect 8354 - if attorney is selected during new claim, make owner of that role the feature(s)
    if (util.WCHelper.isWCorELLossType(this)){
        if (exp.Claim.AttorneyExt != null){
          exp.opposingcounsel = exp.Claim.AttorneyExt
        }
        if(exp.Claim.JurisdictionState != null and exp.JurisdictionState ==  null){
          exp.JurisdictionState = exp.Claim.JurisdictionState
        }

    }
  }
  
  /**
   * Legacy method, create exposures based on claim severity
   */
  function createWcDefaultExposures() {
    if (this.ClaimInjuryIncident.Severity == "wc-ell") {
      createAndSetUpExposure("WL", "wl_el")
    } else {
      createAndSetUpExposure("WM", "wm_wcid")
      if (this.ClaimInjuryIncident.Severity != null
              and this.ClaimInjuryIncident.Severity != "contract-medical"
              and this.ClaimInjuryIncident.Severity != "medical_only") {
        createAndSetUpExposure("WI","wi_lw")
      }
    }
    ensureNoGapsInExposureNumbers()
  }

  /**
   * Create exposure with given coverage type and coverage subtype, unless it
   * is already present. If the claim is already open then set up the exposure
   * immediately (if the claim is draft then it will be set up at the end of
   * the new claim wizard)
   */
  
  /*5.11.15 - cmullin - moved the call to setExposureDefaults from createRelevantWorkCompExposures function to this
    function so that the defaults will only be set when the exposure is initially created whether the claim 
    is open or is being reopened (if Incident Only changes from Yes to No). 
  */ 
  private function createAndSetUpExposure(coverageType : CoverageType, coverageSubtype : CoverageSubtype) {
    if (!this.hasExposureOfType(this.getNewExposureType(coverageSubtype))) {
      var exposure = this.newExposure(coverageType, coverageSubtype, true)
      if (this.State == "open") {
        exposure.saveAndSetup() 
      }
      setExposureDefaults(exposure)
      if(exposure.State == "draft"){
        exposure.State = "open"
      }
    }
  }

  private function ensureNoGapsInExposureNumbers() {
    var theseNeedUpdated = new ArrayList<Exposure>();
    
    var currentMax = 0;
    foreach (e in this.OrderedExposures) {
      if (e.New && e.LoadCommandID == null) {
        theseNeedUpdated.add(e);
      } else {
        currentMax = java.lang.Math.max(currentMax, e.ClaimOrder);
      }
    }
    
    foreach (e in theseNeedUpdated) {
      currentMax = currentMax + 1;
      e.ClaimOrder = currentMax;
    }
  }
}
