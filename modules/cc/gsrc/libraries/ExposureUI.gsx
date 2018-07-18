package libraries
uses java.lang.Exception

@Export
enhancement ExposureUI : entity.Exposure
{
  function setInitialValues() {
    this.JurisdictionState = this.Claim.LossLocation.State
    if (this.ExposureType == "PIPDamages") {
      // Initialize these sub-objects; necessary because they contain arrays
      this.PriorEmpData = new EmploymentData(this);
      this.NewEmpData = new EmploymentData(this);  
    }
    this.ValidationLevel =  "newloss"; 
  }

  function initializeIncident() : Incident {
    var incident : Incident = null;
    if (this.ExposureType == ExposureType.TC_BAGGAGE
        || this.ExposureType == ExposureType.TC_BODILYINJURYDAMAGE
        || this.ExposureType == ExposureType.TC_CONTENT
        || this.ExposureType == ExposureType.TC_DWELLING
        || this.ExposureType == ExposureType.TC_LIVINGEXPENSES
        || this.ExposureType == ExposureType.TC_MEDPAY
        || this.ExposureType == ExposureType.TC_OTHERSTRUCTURE
        || this.ExposureType == ExposureType.TC_PROPERTYDAMAGE
        || this.ExposureType == ExposureType.TC_TOWONLY
        || this.ExposureType == ExposureType.TC_VEHICLEDAMAGE
        || this.ExposureType == ExposureType.TC_PIPDAMAGES
        || this.ExposureType == ExposureType.TC_TRIPCANCELLATIONDELAY ) {
      // Explicit incident; try to get from coverage, otherwise guess
      var coverage = this.Coverage;
      if (coverage != null) {
        incident = coverage.findOrCreateIncident(this.ExposureType);
      }
      if (incident == null) {
        incident = this.findBestIncidentForNewExposure();
      }
    } else if (this.ExposureType == ExposureType.TC_EMPLOYERLIABILITY
               || this.ExposureType == ExposureType.TC_GENERALDAMAGE
               || this.ExposureType == ExposureType.TC_LOSSOFUSEDAMAGE
               || this.ExposureType == ExposureType.TC_LOSTWAGES
               || this.ExposureType == ExposureType.TC_PERSONALPROPERTYDAMAGE
               || this.ExposureType == ExposureType.TC_WCINJURYDAMAGE) {
      // Implicit incident; always create new
      incident = this.newIncident();
    } else {
      throw new Exception( "No Incident initialization set up for Exposure of type " + this.ExposureType )
    }
    this.Incident = incident;
    return incident;
  }

  function findBestIncidentForNewExposure() : Incident {
    var possible = this.PossibleIncidents;
    var best : Incident = null;
    for (incident in possible) {
      if (incident.isSuitableForExposure(this) and (best == null or incident.isBetterForNewExposure(best))) {
        best = incident;
      }
    }
    return best;
  }

  function getVehicleIncidentsWithMatchingLossParty(lossParty : LossPartyType) : VehicleIncident[] {
    var incidents = this.Claim.VehicleIncidentsOnly;    
    var result = new java.util.ArrayList<VehicleIncident>();
    for (incident in incidents) {
      if (lossParty == null || incident.VehicleLossParty == null || incident.VehicleLossParty == lossParty) {
        result.add(incident);
      }
    }
    return result.toTypedArray();
  }


}