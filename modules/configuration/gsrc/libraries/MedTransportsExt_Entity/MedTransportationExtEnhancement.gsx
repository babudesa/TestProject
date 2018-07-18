package libraries.MedTransportsExt_Entity
uses java.math.BigDecimal

enhancement MedTransportationExtEnhancement : entity.MedTransportationExt {
  Property get TransportationTotal(): BigDecimal{
    if (this.NumberMiles == null and this.PerMileCost == null){
      return this.MilageTotal
    }else{
      return this.NumberMiles * this.PerMileCost
    }
  }
  Property set TransportationTotal (value:BigDecimal){
    if (value == null){
      this.MilageTotal = (this.NumberMiles * this.PerMileCost)
    } else {
      this.MilageTotal=value
    }
  }
}