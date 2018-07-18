package gw.fnolmapper.acord
uses xsd.acord.AutoLossInfo_Type
uses xsd.acord.LiabilityLossInfo_Type
uses xsd.acord.PropertyLossInfo_Type
uses xsd.acord.ClaimsInjuredInfo_Type
uses xsd.acord.WorkCompLossInfo_Type

/**
 * Interface for defining mapping methods for Incidents.
 */
@ReadOnly
interface IIncidentMapper {
  /**
   * Gets a VehicleIncident from an ACORD AutoLossInfo_Type.
   */
  function getIncident(claim:Claim, autoLossInfo:AutoLossInfo_Type) : VehicleIncident
  
  /**
   * Gets an Incident for a general liability loss from the ACORD
   * LiabilityLossInfo_Type.
   */
  function getIncident(claim:Claim, glLossInfo:LiabilityLossInfo_Type) : Incident
  
  /**
   * Gets a FixedPropertyIncident for a property loss from the ACORD 
   * PropertyLossInfo_Type.
   */
  function getIncident(claim:Claim, propLossInfo:PropertyLossInfo_Type) : PropertyIncident
 
  /**
   * Gets an InjuryIncident for a third party bodily injury from the ACORD
   * ClaimsInjuredInfo_Type.
   */
  function getIncident(claim:Claim, injuryInfo:ClaimsInjuredInfo_Type) : InjuryIncident
  
  /**
   * Gets an InjuryIncident for a worker's comp loss from the ACORD
   * WorkCompLossInfo_Type.
   */
  function getIncident(claim:Claim, wcLossInfo:WorkCompLossInfo_Type) : InjuryIncident
}
