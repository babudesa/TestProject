package libraries

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
   * Create exposures based on:
   * <ul>
   * <li>Medical or incident report flags set - create Medical Details exposure
   * <li>Time loss or death report flags set - create Time Loss exposure
   * <li>Employer liability flag set - create Employers Liability exposure
   * </ul>
   */
  function createRelevantWorkCompExposures() {             
    //open WC Medical Exp if this is not an Incident Only report OR if Medical Report is specifically specified
    if (this.MedicalReport or !this.IncidentReport){
      createAndSetUpExposure("WM", "wm_wcid")
    }
    
    //open WC Time Loss Exp if Indemnity/TimeLossReport field is checked 
    if (this.TimeLossReport or this.DeathReport){
      createAndSetUpExposure("WI", "wi_lw")
    }
    
    //open WC Employer's Liability Exp
    if (this.EmployerLiability) {
      createAndSetUpExposure("WL", "wl_el")
    }

    ensureNoGapsInExposureNumbers()
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
  private function createAndSetUpExposure(coverageType : CoverageType, coverageSubtype : CoverageSubtype) {
    if (not this.hasExposureOfType(this.getNewExposureType(coverageSubtype))) {
      var exposure = this.newExposure(coverageType, coverageSubtype, true)
      if (this.State == "open") {
        exposure.saveAndSetup() 
      }
    }
  }

  private function ensureNoGapsInExposureNumbers() {
    var order = 1
    foreach (e in this.OrderedExposures) {
      e.ClaimOrder = order
      order++
    }
  }

}
