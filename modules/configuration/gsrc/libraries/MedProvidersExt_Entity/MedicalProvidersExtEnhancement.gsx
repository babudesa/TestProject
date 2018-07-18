package libraries.MedProvidersExt_Entity
uses java.math.BigDecimal

enhancement MedicalProvidersExtEnhancement : entity.MedicalProvidersExt {
  Property get ProvidersTotal(): BigDecimal{  
      if (this.NumberVisits == null and this.RatePerVisit == null){
        return this.ProviderTotal
      }
      return this.NumberVisits * this.RatePerVisit
  }
  Property set ProvidersTotal (value:BigDecimal){
      if (value == null){
      this.ProviderTotal = this.NumberVisits * this.RatePerVisit
      } else {
        this.ProviderTotal=value
      }
  }
}
