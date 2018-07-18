package gw.api.iso
uses xsd.iso.req.ClaimsParty
uses xsd.iso.req.AutoLossInfo
uses xsd.iso.req.SalvageInfo
uses xsd.iso.req.InvestigationInfo
uses xsd.iso.req.StringCd

/**
 * Empty subclass of ISOAutoLossSectionBase, provided so customers can
 * override methods and properties in the base implementation.
 */
@Export
class ISOAutoLossSection extends ISOAutoLossSectionBase {
  
  private var _autoLossInfo : AutoLossInfo
  private var _salvageBuyer : ClaimsParty
  
  /**
   * Exposure level constructor, used when creating a request for just the
   * given exposure. Implicitly creates an ISOClaimSearchRequest.
   */
  construct(inExposure : Exposure)  {
    super(inExposure)
  }
  
  /**
   * Determines if GAIC is the vehicle owner at time of reporting ("claim close")i.e. the Owner at accident is not retaining 
   * the salvaged vehicle and no other salvage buyer has been specified.
   */
   protected property get IsGAICOwnerAtClose() : boolean {
     var ownerAtClose = this.Exposure.VehicleIncident.OwnLienAtClaimCloseExt
     return ownerAtClose typeis Company    
            && ownerAtClose.Name == "Great American Insurance" 
            && ownerAtClose.PrimaryAddress.Country == Country.TC_US
            && ownerAtClose.PrimaryAddress.AddressType == AddressType.TC_MAILING
            && ownerAtClose.PrimaryAddress.AddressLine1 == "301 E Fourth Street"
            && ownerAtClose.PrimaryAddress.City == "Cincinnati"
            && ownerAtClose.PrimaryAddress.State == State.TC_OH
            && ownerAtClose.PrimaryAddress.PostalCode == "45202-4201"
   }

  /**
   * Override because it is possible to pick a third party claimaint even if the Loss Party
   * on the exposure is First Party
   */
  override property get IsFirstParty() : boolean {
    return super.IsFirstParty and Exposure.Claim.Policy.insured == Exposure.Claimant
  }
  
  /**
   * Override to return true if all required fields are not null, so populate() will add an InvestigationInfo
   * aggregate
   */
  protected override property get ShouldAddInvestigationInfo() : boolean {
    var shouldAdd : boolean = false
    //Exposure fields
    shouldAdd = Exposure.TotalLossIndExt != null &&
                Exposure.VehicleIncident != null
                
    //Vehicle fields
    shouldAdd = shouldAdd &&
                Exposure.VehicleIncident.Vehicle != null &&
                Exposure.VehicleIncident.Vehicle.Vin != null &&
                Exposure.VehicleIncident.Vehicle.Make != null &&
                Exposure.VehicleIncident.Vehicle.Model != null &&
                Exposure.VehicleIncident.Vehicle.Year != null
                
    //Vehicle Incident owner related fields        
    shouldAdd = shouldAdd &&
                Exposure.VehicleIncident.IsOwnerRetainingExt != null &&
           Exposure.VehicleIncident.OwnLienAtAccidentExt != null &&
           Exposure.VehicleIncident.OwnLienAtClaimCloseExt != null
      
    //salvage buyer, noy needed if GAI is retaining the salvage       
    shouldAdd = shouldAdd && Exposure.VehicleIncident.IsOwnerRetainingExt 
                               ? Exposure.salvagebuyer != null : true
                               
    return shouldAdd
  }  
  
  /**
   * Claim level constructor, for adding a new loss section to an existing
   * claim level request.
   */
  construct(inSearchRequest : ISOClaimSearchRequest, inExposure : Exposure) {
    super(inSearchRequest, inExposure)
  }
  
  public override function populate() : xsd.iso.req.ACORD {
    var acord = super.populate()
    return acord
  }

  protected override function createAutoLossInfo(claimantParty : ClaimsParty, vehicleIncident : VehicleIncident) : AutoLossInfo {
    var vehicle = vehicleIncident.Vehicle
    _autoLossInfo = new xsd.iso.req.AutoLossInfo()
    _autoLossInfo.id = SearchRequest.getNextId()
    _autoLossInfo.ClaimsPartyRefs = {claimantParty}
    _autoLossInfo.VehInfo.Manufacturer = truncateString(vehicle.Make, 35)
    _autoLossInfo.VehInfo.Model = truncateString(vehicle.Model, 35)    
    _autoLossInfo.VehInfo.ModelYear = vehicle.Year as java.lang.String
    
    //VehicleStyle (Body Type)
    if(Exposure.VehicleIncident.Vehicle.VehicleStyleExt.Code != null){
      var vehStyleCodeList = SearchRequest.findOrCreateCodeList("VehicleStyleCd")
      if(vehStyleCodeList != null){
        _autoLossInfo.VehInfo.VehBodyTypeCd_elem.codelistref = vehStyleCodeList
        _autoLossInfo.VehInfo.VehBodyTypeCd = Exposure.VehicleIncident.Vehicle.VehicleStyleExt.Code
      }
    }
    //Vehicle Type
    if(Exposure.VehicleIncident.Vehicle.VehicleTypeExt.Code != null){
      var vehTypeCodeList = SearchRequest.findOrCreateCodeList("VehicleTypeCd")
      if(vehTypeCodeList != null){
        _autoLossInfo.VehInfo.VehTypeCd_elem.codelistref = vehTypeCodeList
        _autoLossInfo.VehInfo.VehBodyTypeCd = Exposure.VehicleIncident.Vehicle.VehicleTypeExt.Code    
      }
    }
    //Odometer reading
    if(Exposure.VehicleIncident.OdomRead != null){
      _autoLossInfo.VehInfo.PersVehInfo.OdometerReading.NumUnits = Exposure.VehicleIncident.OdomRead as java.lang.String
    }
    //Registration
    var registration = createRegistration(vehicle)
    if (registration != null) {
      _autoLossInfo.VehInfo.Registrations.add(registration)
    }
    //VIN
    _autoLossInfo.VehInfo.VehIdentificationNumber = truncateString(vehicle.Vin, 20)
    //Manufacturer code
    _autoLossInfo.ManufacturerCd = this.createManufacturerCode(vehicle)
    //CollsionPoint OOTB
    var collPoint = vehicleIncident.CollisionPoint
    if (collPoint != null) {
      _autoLossInfo.ImpactPointCd = SearchRequest.Translate.translateTypeCode(collPoint)
    }
    
    return _autoLossInfo
  }  
  

  
  /**
    tnewcomb 10/05/2011 - OVERRIDE
  */
  protected override function createManufacturerCode(vehicle : Vehicle) : String {
    var makeCode = ""
    if(vehicle.Make != null and vehicle.Make.length > 0){
      for(key in NCICVehicleMakeExt.getTypeKeys(false)){
        if(key.DisplayName.toUpperCase() == vehicle.Make.toUpperCase()){
          makeCode = key.Code 
        }
      }
      return makeCode != "" ? makeCode : truncateString(vehicle.Make, 4)
    }else{
      return super.createManufacturerCode(vehicle)
    }
  }

  /**
    tnewcomb 10/06/2011 - OVERRIDE
  */
  protected override function createAndAddInvestigationInfo() : InvestigationInfo {
      var recoveryInfo = createRecoveryInfo()
      var salvageInfo = createSalvageInfo()
      var totalLoss = Exposure.TotalLossIndExt
      if (recoveryInfo != null or salvageInfo != null or totalLoss) {
        var investigationInfo = new InvestigationInfo()
        if (recoveryInfo != null) {
          investigationInfo.RecoveryInfos.add(recoveryInfo)
        } 
        if (salvageInfo != null) {
          investigationInfo.SalvageInfos.add(salvageInfo)
        }
        if (totalLoss) {
          var dispositionCode = new StringCd()
          dispositionCode.codelistref = SearchRequest.findOrCreateCodeList("VehDispositionCd")
          dispositionCode.Value = "T"
          investigationInfo.VehDispositionCds.add(dispositionCode)
        }
        SearchRequest.AddRequest.InvestigationInfos.add(investigationInfo)
        return investigationInfo
      }
    return null
  }  
  
  /**
    tnewcomb 10/06/2011 - OVERRIDE
  */
  protected override function createSalvageInfo() : SalvageInfo {
    //Do not add SalvageInfo if GAIC is the Owner
    if(!this.IsGAICOwnerAtClose){
      var ownerRetainingSalvage = Exposure.VehicleIncident.IsOwnerRetainingExt
      if (ownerRetainingSalvage != null and Exposure.Claim.LossDate != null) {
        var salvageInfo = new SalvageInfo()
        salvageInfo.SalvageDt = SearchRequest.Translate.formatClaimDate(Exposure.Claim.LossDate)
        salvageInfo.OwnerRetainingSalvageInd = 
          Exposure.VehicleIncident.IsOwnerRetainingExt ? ISOConstants.TRUE : ISOConstants.FALSE
        if (!this.Exposure.VehicleIncident.IsOwnerRetainingExt && this._salvageBuyer != null) {
          salvageInfo.BuyerRef = this._salvageBuyer
          salvageInfo.ItemRef = this._autoLossInfo
        }
        return salvageInfo
      }
    }
    return null
  }
  
  //override here so we can look at the exposure for salvage buyer related fields
  protected override function createOptionalClaimsParties(claimantParty : ClaimsParty) {
    for (var entry in ContactRoleMap.entrySet()) {
      var isoRole = entry.Value
      var contactRole = entry.Key
      var contacts = getContactsWithRole(contactRole)
      for (contact in contacts) {
        if(isoRole == ISOClaimsPartyRole.SalvageBuyer && 
          this.Exposure.VehicleIncident != null && !this.Exposure.VehicleIncident.IsOwnerRetainingExt){
            this._salvageBuyer = SearchRequest.ClaimsParties.addNewClaimsParty(claimantParty, contact, isoRole) 
        }else{
          SearchRequest.ClaimsParties.addParty(claimantParty, contact, isoRole)
        }
      }
    }
  }
   
}
