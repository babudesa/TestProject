package libraries.DisabilityBenefitsExt_Entity
uses java.math.BigDecimal

enhancement DisabilityBenefitsExtEnhancement : entity.DisabilityBenefitsExt {
  Property get DisabilityBenefitTotal() : BigDecimal {  
      if (this.NumberOfWeeks == null and this.Rate == null){
        return this.DisabilityTotal
      }else if(this.DisabilityType == "permpartial" && this.PercentDisabled != null){
        return this.NumberOfWeeks * this.PercentDisabled * this.Rate / 100
      }
      return this.NumberOfWeeks * this.Rate
  }
  
  Property set DisabilityBenefitTotal(value : BigDecimal){
      if (value == null){
        if(this.DisabilityType == "permpartial" && this.PercentDisabled != null){
          this.DisabilityTotal = this.NumberOfWeeks * this.PercentDisabled * this.Rate / 100
        }else{
          this.DisabilityTotal = this.NumberOfWeeks * this.Rate
        }
      }else{
        this.DisabilityTotal = value
      }
    }
  }
