package gw.fnolmapper.acord
uses xsd.acord.AutoLossInfo_Type
uses xsd.acord.LiabilityLossInfo_Type
uses xsd.acord.PropertyLossInfo_Type
uses xsd.acord.WorkCompLossInfo_Type
uses xsd.acord.ClaimsInjuredInfo_Type

/**
 * Interface for mapping Exposure entities.
 */
@ReadOnly
interface IExposureMapper {
  /**
   * Creates an entity.Exposure for an Auto loss from the ACORD AutoLossInfo_Type and the
   * corresponding VehicleIncident.
   */
  function getExposure(claim:Claim, autoLossInfo:AutoLossInfo_Type, incident:VehicleIncident) : Exposure
  
  /**
   * Creates an entity.Exposure for a general liability loss from the ACORD LiabilityLossInfo_Type and
   * the corresponding Incident.
   */
  function getExposure(claim:Claim, glLossInfo:LiabilityLossInfo_Type, incident:Incident) : Exposure
  
  /**
   * Creates an entity.Exposure for a property loss from the ACORD PropertyLossInfo_Type and the corresponding
   * FixedPropertyIncident.
   */
  function getExposure(claim:Claim, propLossInfo:PropertyLossInfo_Type, incident:PropertyIncident) : Exposure
  
  /**
   * Creates an entity.Exposure for a worker's comp loss from the ACORD WorkCompLossInfo_Type and the 
   * corresponding Incident.
   */
  function getExposure(claim:Claim, wcLossInfo:WorkCompLossInfo_Type, incident:Incident) : Exposure
  
  /**
   * Creates an entity.Exposure for a third party's bodily injury from the ACORD ClaimsInjuredInfo_Type
   * and the corresponding InjuryIncident.
   */
  function getExposure(claim:Claim, injuryInfo:ClaimsInjuredInfo_Type, incident:InjuryIncident) : Exposure
}
