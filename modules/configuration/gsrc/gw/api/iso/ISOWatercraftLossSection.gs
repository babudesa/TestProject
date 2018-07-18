package gw.api.iso
uses xsd.iso.req.Watercraft
uses xsd.iso.req.ClaimsPayment
uses xsd.iso.req.PropertyLossInfo_ClaimsSubjectInsuranceInfo
uses java.math.BigDecimal
uses xsd.iso.req.PropertyLossInfo
uses xsd.iso.req.ClaimsParty
uses gw.xml.xsd.IXMLNodeWithID
uses xsd.iso.req.Registration
uses xsd.iso.req.ItemDefinition

/**
 * Empty subclass of ISOWatercraftLossSectionBase, provided so customers can
 * override methods and properties.
 */
@Export
class ISOWatercraftLossSection extends ISOWatercraftLossSectionBase {
  
  /**
   * Exposure level constructor, used when creating a request for just the
   * given exposure. Implicitly creates an ISOClaimSearchRequest.
   */
  construct(inExposure : Exposure) {
    super(inExposure)
  }

  /**
   * Claim level constructor, for adding a new loss section to an existing
   * claim level request.
   */
  construct(inSearchRequest : ISOClaimSearchRequest, inExposure : Exposure) {
    super(inSearchRequest, inExposure)
  }

  /**
   * Creates a Watercraft aggregate (sub aggregate of PropertyLossInfo) based
   * on the exposure's VehicleIncident
   * Updated: sprzygocki 10/6/11 - updated ItemTypeCd to reflect if the boat had stolen parts
   * Updated: bestor 02/09/12 - if vehicle is null, get it from it's engine
   * Updated: bestor 02/22/12 - apparently, the pre-update rule that sets the vehicle incident's vehicle from
   *                            risk unit is not working, so get it from risk unit prior to getting it from it's engine
   *                            Defect# 5135 - ISO Error trying to close a claim. Vehicle is required for creating boat ISO message payload on an Agriguard GL claim.
   */  
  @Throws(ISOBadRequestException, "")
  override protected function createWatercraft() : Watercraft{
    var watercraft = new Watercraft()
    var vehicle = Exposure.VehicleIncident.Vehicle
    if (vehicle == null && (Exposure.Coverage typeis VehicleCoverage)) {
      vehicle = ((Exposure.Coverage as VehicleCoverage).RiskUnit as VehicleRU).Vehicle
      if (vehicle == null) {
        vehicle = (Exposure.Coverage as VehicleCoverage).EngineExt.Vehicle
      }
    }
    var itemTypeCd = ISOConstants.WATERCRAFT_ITEM_TYPE
    
    if (vehicle == null) {
      throw new ISOBadRequestException(displaykey.Java.Error.ISO.MissingProperty("vehicle", "boat", Exposure.Claim.ClaimNumber ))
    }
    var boatType = vehicle.BoatType == null ? BoatType.TC_OT : vehicle.BoatType
    if (boatType != null) {
      watercraft.WaterUnitTypeCd = SearchRequest.Translate.optionallyTranslateTypeCode(boatType)
      watercraft.WaterUnitTypeCd_elem.codelistref = SearchRequest.findOrCreateCodeList(ISOCodeList.WATER_UNIT_TYPE_CODE.Id)  
    }
    if(Exposure.LostPropertyType!=null and 
       (Exposure.LostPropertyType==TC_ENGINE || Exposure.LostPropertyType==TC_OUTDRIVE)){
      itemTypeCd = Exposure.LostPropertyType.Code
    }    
    watercraft.ItemDefinitions.add(createItemDefinition(vehicle, itemTypeCd))
    
    var registrationState = vehicle.State
    if (registrationState != null) {
      watercraft.Registration.StateProvCd = registrationState.Code
    }
    
    if(vehicle.VehicleLengthExt != null){
      watercraft.Length.NumUnits = formatVehicleLength(vehicle.VehicleLengthExt)
    }
    
    if(vehicle.BoatHullMaterialTypeExt != null){
      watercraft.HullMaterialTypeCd = SearchRequest.Translate.optionallyTranslateTypeCode(vehicle.BoatHullMaterialTypeExt)
      //if translation is unsuccessful, then set hull material to Other
      if(watercraft.HullMaterialTypeCd == null){
        watercraft.HullMaterialTypeCd = "OT" 
      }
      watercraft.HullMaterialTypeCd_elem.codelistref = SearchRequest.findOrCreateCodeList("HullMaterialTypeCd")
    }
    
    var horsePowerSum = 0
    
    if(vehicle.EnginesExt.HasElements){
      for(engine in vehicle.EnginesExt){
        if(engine.Manufacturer.HasContent && engine.SerialNo.HasContent && engine.Year != null && vehicle.SerialNumber.HasContent){
          var itemDef = createEngineItemDef(engine)
          if(vehicle.SerialNumber.HasContent){
            itemDef.SerialIdNumber = vehicle.SerialNumber
          }
          watercraft.ItemDefinitions.add(itemDef) 
        }
        
        if(engine.Horsepower != null){
          horsePowerSum += engine.Horsepower 
        }
      }
    }
    
    if(horsePowerSum > 0){
      watercraft.Horsepower.NumUnits = horsePowerSum as String
    }
    
    return watercraft
  }
  
  private function formatVehicleLength(length : int) : String{
    if(length <= 99){
      return length as String
    }else{
      return "99" 
    }
  }
  
  /**
   * Utility method for creating an ItemDefinition aggregate from a vehicle,
   * using the given itemType
   */
  protected override function createItemDefinition(vehicle : Vehicle, itemType : String) : ItemDefinition {
    var itemDefinition = super.createItemDefinition(vehicle, itemType)
    
    //State is the only required field for registration, so check for it first
    if(vehicle.State != null){
      itemDefinition.Registration = createRegistration(vehicle)
    }
    
    return itemDefinition
  }
  
  protected function createRegistration(vehicle : Vehicle) : Registration{
    var registration : Registration = new Registration() 
      if (vehicle.RegistrationNoExt.HasContent) {
        registration.RegistrationNumber = vehicle.RegistrationNoExt
      } 
      if (vehicle.State != null) {
        registration.StateProvCd = vehicle.State.Code
      }
    return registration
  }
  
  protected function createEngineItemDef(engine : EngineExt) : ItemDefinition{
    var itemDefinition = new ItemDefinition()
    itemDefinition.ItemTypeCd = "Engine"
    itemDefinition.ItemTypeCd_elem.codelistref = SearchRequest.findOrCreateCodeList("SubjectInsuranceCd")
    itemDefinition.Manufacturer = truncateString(engine.Manufacturer, 20)

    if(engine.SerialNo.HasContent){
      itemDefinition.EngineSerialNumber = truncateString(engine.SerialNo, 20)
    }
    
    if(engine.Year != null){
      itemDefinition.ModelYear = engine.Year as String
    }
    
    return itemDefinition    
  }
  
  /**
   * Override the standard createLossSection method to create a PropertyLossInfo
   * aggregate. The ClaimsParty represents the claimant and is linked to the
   * new PropertyLossInfo aggregate
   */
  protected override function createLossSection(claimantParty : ClaimsParty) : IXMLNodeWithID {
    return addPropertyLossInfo(claimantParty)
  }
  
  /**
   * Creates a PropertyLossInfo aggregate with a Watercraft sub aggregate based
   * on the exposure's VehicleIncident. Links the PropertyLossInfo to the given
   * claimant.
   */
  protected override function addPropertyLossInfo(claimantParty : ClaimsParty) : PropertyLossInfo {
    var lossInfo = new PropertyLossInfo()
    SearchRequest.AddRequest.PropertyLossInfo = lossInfo
    lossInfo.id = SearchRequest.getNextId()
    lossInfo.ClaimsPartyRefs = {claimantParty}
    lossInfo.Watercrafts.add(createWatercraft())
    if (lossInfo == null) {
      SearchRequest.AddRequest.PropertyLossInfo.id = SearchRequest.getNextId()
      SearchRequest.AddRequest.PropertyLossInfo.ClaimsPartyRefs = {claimantParty}
      lossInfo = SearchRequest.AddRequest.PropertyLossInfo
    }
    lossInfo.ClaimsSubjectInsuranceInfos.add(createClaimsSubjectInsuranceInfo())
    return lossInfo
  } 
  
  /**
   * Creates a new ClaimsSubjectInsuranceInfo aggregate (sub aggregate of
   * PropertyLossInfo) based on the exposure.
   */
  protected function createClaimsSubjectInsuranceInfo() : PropertyLossInfo_ClaimsSubjectInsuranceInfo {
    var claimsSubjectInsuranceInfo = new PropertyLossInfo_ClaimsSubjectInsuranceInfo()
    var subjectInsuranceCd = SearchRequest.Translate.translateTypeCode(Exposure.ExposureType)
    claimsSubjectInsuranceInfo.SubjectInsuranceCd =subjectInsuranceCd
    if (subjectInsuranceCd == ISOConstants.SUBJECT_INSURANCE_BUILDING ||
        subjectInsuranceCd == ISOConstants.SUBJECT_INSURANCE_CONTENTS ||
        subjectInsuranceCd == ISOConstants.SUBJECT_INSURANCE_USEOCCUPANCY ||
        subjectInsuranceCd == ISOConstants.SUBJECT_INSURANCE_STOCK ||
        subjectInsuranceCd == ISOConstants.SUBJECT_INSURANCE_OTHER ) {
      var exposureLimit = Exposure.Coverage.ExposureLimit.Amount
      if (exposureLimit != null && exposureLimit.compareTo(BigDecimal.ZERO) != 0) {
        claimsSubjectInsuranceInfo.InsuranceAmt.Amt = exposureLimit as java.lang.String 
      }
    } 
    var lossEstimate = Exposure.Incident.LossEstimate
    if (lossEstimate != null && lossEstimate != BigDecimal.ZERO) {
      claimsSubjectInsuranceInfo.ProbableIncurredAmt.Amt = lossEstimate as java.lang.String
    }
    return claimsSubjectInsuranceInfo 
  }
  
  /**
   * Override of standard loss section behavior: for property loss info the
   * ClaimsPayment aggregate will be under ClaimsSubjectInsuranceInfo
   */
  protected override function createAndAddClaimsPayment(claimantParty : ClaimsParty) : ClaimsPayment {
    var claimsPayment : ClaimsPayment = null
    if (SearchRequest.AddRequest.PropertyLossInfo.ClaimsSubjectInsuranceInfos.Count > 0) {
      claimsPayment = createClaimsPayment(claimantParty) 
      SearchRequest.AddRequest.PropertyLossInfo.ClaimsSubjectInsuranceInfos.last().ClaimsPayments.add(claimsPayment)
    }
    return claimsPayment
  }
  
  /**
   * Overridden to do nothing, as we do not need this aggregate for property
   * loss sections
   */
  protected override function createProbableIncurredAmt() {
  }
}
