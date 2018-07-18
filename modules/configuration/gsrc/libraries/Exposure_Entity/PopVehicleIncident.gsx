package libraries.Exposure_Entity

enhancement PopVehicleIncident : entity.Exposure {
  //******************************************************************************************
  // 11/05/08: Zach Thomas
  // Defect 1459
  // Function set generic vehicle on VehicleIncident.
  // Currently used in Mutual Aid Physical Damage Features.
  // 3-3-10 sprzygocki - updated to make sure that the vehicle incident is set correctly
  // 11/12/10 smchone - defect 3717 fixed problem of &apos;losing&apos; data when coming back to the feature
  //     screen before saving the new commercial auto claim
  //01/14/11 smchone - defect 3717 added checks for vehicle type and style to cover
  //    property damage since VIN, make and year are not required.
  //04/12/11 sprzygocki - updated to use Risk Units
  //******************************************************************************************
  function populateVehicleIncident(){
    if(this.New and (this.ExposureType=="ab_AutoPropDam" || this.ExposureType=="ab_PhysicalDamage" || this.ExposureType =="pe_AutoPropDamage" ||
       this.ExposureType =="pe_PhysicalDamage" || this.ExposureType =="pe_PropDamage"   )){
      if(this.VehicleIncident.Vehicle.Vin == null and this.VehicleIncident.Vehicle.Year == null
       and this.VehicleIncident.Vehicle.Make == null and this.VehicleIncident.Vehicle.Model == null
       and this.VehicleIncident.Vehicle.VehicleTypeExt == null and this.VehicleIncident.Vehicle.VehicleStyleExt == null) {
      this.VehicleIncident = new VehicleIncident()
      this.VehicleIncident.Claim = this.Claim
      this.VehicleIncident.Vehicle = new Vehicle()
      if(this.LossParty=="insured" and this.Coverage.Subtype=="VehicleCoverage"){
        var vehiclecvg = (this.Coverage as VehicleCoverage)
        var vehicle = (vehiclecvg.RiskUnit as VehicleRU).Vehicle
        this.VehicleIncident.Vehicle.Vin = vehicle.Vin
        this.VehicleIncident.Vehicle.Make = vehicle.Make
        this.VehicleIncident.Vehicle.Model = vehicle.Model
        this.VehicleIncident.Vehicle.Year = vehicle.Year
      }
    }
    }
    /*if(this.New and this.VehicleIncident != null){
      if(this.VehicleIncident.Vehicle == null){
        this.VehicleIncident.Vehicle = new Vehicle();
      }
    }*/
  }
}
