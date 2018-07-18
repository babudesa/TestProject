package libraries.DeathBenefitsExt_Entity
uses java.math.BigDecimal

enhancement DeathBenefitsExtEnhancement : entity.DeathBenefitsExt {
  Property get DeathBenefitsTotal(): BigDecimal{
    if (this.NumberOfPayPeriods == null and this.Rate == null){
      return this.DeathBenefitTotal
    }
    return this.NumberOfPayPeriods * this.Rate
  }
  Property set DeathBenefitsTotal (value:BigDecimal){
    if (value == null){
      this.DeathBenefitTotal = this.NumberOfPayPeriods * this.Rate
    } else {
      this.DeathBenefitTotal = value
    }
  }
}
