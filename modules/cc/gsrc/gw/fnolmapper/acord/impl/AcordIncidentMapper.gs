package gw.fnolmapper.acord.impl

uses typekey.Currency
uses entity.VehicleIncident
uses entity.BodyPartDetails
uses gw.fnolmapper.acord.IIncidentMapper
uses typekey.State
uses java.lang.String
uses entity.Incident
uses gw.fnolmapper.acord.ContactManager
uses gw.fnolmapper.acord.AcordUtil
uses entity.InjuryIncident
uses gw.fnolmapper.acord.AcordConfig
uses entity.Vehicle
uses entity.FixedPropertyIncident

uses xsd.acord.AutoLossInfo_Type
uses xsd.acord.LiabilityLossInfo_Type
uses xsd.acord.PropertyLossInfo_Type
uses xsd.acord.WorkCompLossInfo_Type
uses xsd.acord.ClaimsInjuredInfo_Type

uses xsd.acord.ClaimsParty_Type

/**
 * Maps an ACORD XML element(s) to Incidents on a Claim.
 */
@Export
class AcordIncidentMapper implements IIncidentMapper
{
  var config:AcordConfig
  var contactManager:ContactManager
  
  construct(configuration:AcordConfig, contactMgr:ContactManager) {
    this.config = configuration
    this.contactManager = contactMgr
  }
  
  //gets an auto loss incident
  override function getIncident(claim:Claim, autoLossInfo:AutoLossInfo_Type) : VehicleIncident {
     var incident = claim.newIncident(VehicleIncident) as VehicleIncident
     incident.Description = autoLossInfo.DamageDesc
     if(autoLossInfo.ImpactPointCd!=null or involvesCollision(autoLossInfo))
       incident.Collision = true
     if(autoLossInfo.ProbableIncurredAmt.Amt!=null) {
       incident.LossEstimate = AcordUtil.getCurrencyAmount(autoLossInfo.ProbableIncurredAmt.Amt, 
         autoLossInfo.ProbableIncurredAmt.CurCd)
     }
     if(autoLossInfo.VehInfo!=null) {
       var vehicle = new Vehicle()
       vehicle.Make = autoLossInfo.VehInfo.Manufacturer
       vehicle.Model = autoLossInfo.VehInfo.Model
       vehicle.Year = autoLossInfo.VehInfo.ModelYear
       vehicle.Vin = autoLossInfo.VehInfo.VehIdentificationNumber
       vehicle.State = State.get(autoLossInfo.VehInfo.RegistrationStateProvCd)
       vehicle.LicensePlate = autoLossInfo.VehInfo.LicensePlateNumber
       incident.Vehicle = vehicle
     }
     //associate driver contact with incident
     for(claimPartyRef in autoLossInfo.ClaimsPartyRefs) {
       var claimParty:ClaimsParty_Type = claimPartyRef as ClaimsParty_Type
       var contact = contactManager.getById(claimParty.id)
       if(contact!=null and claimParty.hasRole( AcordUtil.ROLE_DRIVER)) {
         var rel = claimParty.ClaimsPartyInfo.RelationshipToInsuredCd_elem.Text
         incident.DriverRelation = config.getPersonRelationTypeMap().get(rel)
         incident.driver = contact.Person
       }
     }
     return incident
  }
  
  //gets a liability loss incident
  override function getIncident(claim:Claim, glLossInfo:LiabilityLossInfo_Type) : Incident {
    var incident = claim.newIncident(Incident)
    incident.Description = glLossInfo.ItemDesc
    if(glLossInfo.ProbableIncurredAmt.Amt!=null) {
      incident.LossEstimate = AcordUtil.getCurrencyAmount(glLossInfo.ProbableIncurredAmt.Amt, 
        glLossInfo.ProbableIncurredAmt.CurCd)
    }
    return incident
  }
  
  //gets a property loss incident
  override function getIncident(claim:Claim, propLossInfo:PropertyLossInfo_Type) : PropertyIncident {
    var incident = claim.newIncident(FixedPropertyIncident) as FixedPropertyIncident
    incident.Description = propLossInfo.DamageDesc
    if(propLossInfo.ProbableIncurredAmt.Amt!=null) {
      incident.LossEstimate = AcordUtil.getCurrencyAmount(propLossInfo.ProbableIncurredAmt.Amt, propLossInfo.ProbableIncurredAmt.CurCd)
    }
    for(claimPartyRef in propLossInfo.ClaimsPartyRefs) {
      var claimParty:ClaimsParty_Type = claimPartyRef as ClaimsParty_Type
      if(claimParty.hasRole(AcordUtil.ROLE_PROPERTY_OWNER))
         incident.Property.Address =
            contactManager.getById(claimParty.id).Contact.PrimaryAddress
    }
    return incident
  }

  //used for claimant injury incidences
  override function getIncident(claim:Claim, injuryInfo:ClaimsInjuredInfo_Type) : InjuryIncident {
    var incident = claim.newIncident(InjuryIncident) as InjuryIncident
    incident.Description = injuryInfo.EventsDesc
    for(injury in injuryInfo.ClaimsInjurys) {
      var bodyPart = new BodyPartDetails()
        bodyPart.PrimaryBodyPart = config.getBodyPartTypeMap().get(injury.BodyPartDesc)
        incident.addToBodyParts(bodyPart)
     }
     return incident
  }
  
  //gets a worker's comp loss incident
  override function getIncident(claim:Claim, wcLossInfo:WorkCompLossInfo_Type) : InjuryIncident {
    var incident = claim.newIncident(InjuryIncident) as InjuryIncident
    if(wcLossInfo.WCClaimTypeCd_elem.Text.equalsIgnoreCase("LostTime"))
      incident.LostWages = true
    return incident
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  /// Private methods                                                                                  ///
  ////////////////////////////////////////////////////////////////////////////////////////////////////////  
  
  
  //checks for "driver other" role
  private function involvesCollision(autoLossInfo:AutoLossInfo_Type) : boolean {
    for(claimsPartyRef in autoLossInfo.ClaimsPartyRefs) {
      if((claimsPartyRef as ClaimsParty_Type).hasRole(AcordUtil.ROLE_DRIVER_OTHER) or 
        (claimsPartyRef as ClaimsParty_Type).hasRole(AcordUtil.ROLE_DRIVER))
        return true;
    }
    return false;
  }
}
