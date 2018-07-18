package libraries.LifetimeBenefitsExt_Entity
uses java.math.BigDecimal

enhancement LifetimeBenefitsExtEnhancement : entity.LifetimeBenefitsExt {
  Property get LifetimeBenefitsTotal(): BigDecimal{
    if (this.NumberOfWeeks == null and this.Rate == null){
      return this.LifetimeBenefitTotal
    }
    return this.NumberOfWeeks * this.Rate
  }
  Property set LifetimeBenefitsTotal (value:BigDecimal){
    if (value == null){
      this.LifetimeBenefitTotal = this.NumberOfWeeks * this.Rate
    } else {
      this.LifetimeBenefitTotal = value
    }
  }
}
