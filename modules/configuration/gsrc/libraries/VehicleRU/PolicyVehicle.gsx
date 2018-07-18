package libraries.VehicleRU

enhancement PolicyVehicle : entity.VehicleRU {
  function setRiskCoverageDates() {
    if(!this.Policy.Verified && this.Vehicle.VehicleEffDateExt == null){
      this.Vehicle.VehicleEffDateExt = this.Policy.EffectiveDate
    }
    if(!this.Policy.Verified && this.Vehicle.VehicleExpDateExt == null){
      this.Vehicle.VehicleExpDateExt = this.Policy.ExpirationDate
    }
  }
  function expDateError() : boolean{
    if(util.custom_Ext.DateTime.isDateBefore(this.Vehicle.VehicleExpDateExt, this.Vehicle.VehicleEffDateExt) or util.custom_Ext.DateTime.isDateAfter(this.Vehicle.VehicleExpDateExt, this.Policy.ExpirationDate)){
      return true;
    }else{
      return false;
    }
  }

  function effDateError() : boolean{
    if(util.custom_Ext.DateTime.isDateBefore(this.Vehicle.VehicleEffDateExt, this.Policy.EffectiveDate) or util.custom_Ext.DateTime.isDateAfter(this.Vehicle.VehicleEffDateExt, this.Policy.ExpirationDate)){
      return true;
    }else{
      return false;
    } 
  }  
}
