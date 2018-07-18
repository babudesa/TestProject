package gw.api.databuilder
uses java.util.Date

enhancement VehicleIncidentBuilderEnhancement : VehicleIncidentBuilder {

  public function withSpeed(speed : int) : VehicleIncidentBuilder {
    this.set(VehicleIncident.Type.TypeInfo.getProperty("speed"), speed)
    return this
  }  
  
  public function withCollisionPoint(collisionPoint : CollisionPoint) : VehicleIncidentBuilder {
    this.set(VehicleIncident.Type.TypeInfo.getProperty("CollisionPoint"), collisionPoint)
    return this
  }
  
  public function withDateSalvageAssigned(dateSalvageAssigned : Date) : VehicleIncidentBuilder {
    this.set(VehicleIncident.Type.TypeInfo.getProperty("DateSalvageAssigned"), dateSalvageAssigned)
    return this
  }
  
  public function withDriverRelation(driverRelation : PersonRelationType) : VehicleIncidentBuilder {
    this.set(VehicleIncident.Type.TypeInfo.getProperty("DriverRelation"), driverRelation)
    return this
  }
  
  public function withOwnersPermission(ownersPermission : Boolean) : VehicleIncidentBuilder {
    this.set(VehicleIncident.Type.TypeInfo.getProperty("OwnersPermission"), ownersPermission)
    return this
  }

  public function withRecoveryDate(recoveryDate : Date) : VehicleIncidentBuilder {
    this.set(VehicleIncident.Type.TypeInfo.getProperty("RecovDate"),recoveryDate)
    return this
  }

  public function withTotalLoss(totalLoss : Boolean) : VehicleIncidentBuilder {
    this.set(VehicleIncident.Type.TypeInfo.getProperty("TotalLoss"), totalLoss)
    return this
  }

  public function withVehicleDirection(vehicleDirection : VehicleDirection) : VehicleIncidentBuilder {
    this.set(VehicleIncident.Type.TypeInfo.getProperty("VehicleDirection"), vehicleDirection)
    return this
  }
  
  public function withVehicleUseReason(vehicleUseReason : ReasonForUse) : VehicleIncidentBuilder {
    this.set(VehicleIncident.Type.TypeInfo.getProperty("VehicleUseReason"), vehicleUseReason)
    return this
  }

  public function withRecovCondType(recovCondType : RecovCondType) : VehicleIncidentBuilder { 
    this.set(VehicleIncident.Type.TypeInfo.getProperty("RecovCondType"), recovCondType)
    return this
  }
}
