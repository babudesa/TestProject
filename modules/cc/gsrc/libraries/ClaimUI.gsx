package libraries

@Export
enhancement ClaimUI : entity.Claim
{
  function setInitialValues() {
    if (this.LossType == "AUTO") {
      this.LOBCode = "auto"
    } else if (this.LossType == "TRAV" ) {
      this.LOBCode = "travel" 
    } else if (this.LossType == "GL") {
      this.LOBCode = "gl"
    } else if (this.LossType == "PR") {
      this.LOBCode = "pr"
    } else if (this.LossType == "WC") {
      this.ClaimWorkComp = new ClaimWorkComp(this);
      this.LOBCode = "wc" as LOBCode
      var claimInjuryIncident = this.ensureClaimInjuryIncident();
      claimInjuryIncident.GeneralInjuryType = "specific" as InjuryType;
      claimInjuryIncident.DetailedInjuryType = "59" as DetailedInjuryType;
      if (claimInjuryIncident.BodyParts.length == 0) {
        var newBodyPart = claimInjuryIncident.newBodyPart();
        newBodyPart.PrimaryBodyPart = "multiple" as BodyPartType;
        newBodyPart.DetailedBodyPart = "65" as DetailedBodyPartType;
        claimInjuryIncident.addToBodyParts( newBodyPart );
      }
      this.EmploymentData = new EmploymentData(this)
    }
    if(this.ReportedDate == null) {
      this.ReportedDate = gw.api.util.DateUtil.currentDate()
    }
    this.SIUStatus = "No_Referral"
    this.IncidentReport = false
  }

  function areInitialValuesSet() : boolean {
    return this.LOBCode != null
  }

  function cancelTrips(checkedTripRU : entity.TripRU[]) {
    for (eachTripRU in checkedTripRU){
      var newTripIncident = new TripIncident()
      newTripIncident.TripRU = eachTripRU
      this.addToIncidents( newTripIncident )
    }
  }
  function undoTripCancellation(checkedTripRU : entity.TripRU[]) {
    for (eachTripRU in checkedTripRU){
      for(eachTripIncident in this.TripIncidentsOnly)
      {
        if(eachTripIncident.TripRU == eachTripRU)
        {
          this.removeFromIncidents( eachTripIncident )
        }
      }
    }
  }
}