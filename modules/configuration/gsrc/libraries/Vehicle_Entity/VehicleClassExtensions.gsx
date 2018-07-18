package libraries.Vehicle_Entity

enhancement VehicleClassExtensions : entity.Vehicle {
  public function getVehicleID():String {
    var IDstr : String
    If (this.Vin!=Null) {
      IDstr = this.Vin
    } else {
      if(this.SerialNumber!=Null) {
        IDstr = this.SerialNumber
      } else {
        IDstr = ""
      }
    }
    return IDstr
  }
  
  public function setStyle(style:String){
    this.Style=style
  }

  public function setBoatType(type:String){
    this.BoatType=type
  }
}
