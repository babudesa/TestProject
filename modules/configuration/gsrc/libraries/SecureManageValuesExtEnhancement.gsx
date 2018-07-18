package libraries

enhancement SecureManageValuesExtEnhancement : entity.SecureManageValuesExt {
  
  property get IsSecure():boolean {
    return this.ProducingUnitExt.SecurityZone.Name != "Default Security Zone"
  }
    
}
