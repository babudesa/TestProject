package libraries.IndemnityEvalExt_Entity
uses java.math.BigDecimal

enhancement IndemnityEvalExtEnhancement : entity.IndemnityEvalExt {
  property get DisabilityBenefitTotal() : BigDecimal{
    var total : BigDecimal = 0
      for (amt in this.DisabilityBenefits){
        if(amt.DisabilityBenefitTotal!=null){
          total = total + amt.DisabilityBenefitTotal
        }
      }
    return total
  }
  
  property get OtherBenefitTotal() : BigDecimal{
    var total : BigDecimal = 0
    if(this.DisfigureScarring!=null && this.WageLoss!=null){
      total = this.DisfigureScarring + this.WageLoss
    }else if(this.DisfigureScarring==null && this.WageLoss!=null){
      total = this.WageLoss
    }else if(this.DisfigureScarring!=null && this.WageLoss==null){
      total = this.DisfigureScarring
    }
    return total
  }
  
  property get LifetimeBenefitTotal() : BigDecimal{
    var total : BigDecimal = 0
      for (amt in this.LifetimeBenefits){
        if(amt.LifetimeBenefitsTotal!=null){
          total = total + amt.LifetimeBenefitsTotal
        }
      }
    return total
  }
  
  property get DeathBenefitTotal() : BigDecimal{
    var total : BigDecimal = 0
    var benefitTotal : BigDecimal = 0
    for (amt in this.DeathBenefits){
      if(amt.DeathBenefitsTotal!=null){
        benefitTotal = benefitTotal + amt.DeathBenefitsTotal
      }
    }
    if(this.BurialExpense==null){
      total = benefitTotal + this.DeathBenefitsPaid
    }else{
      total = benefitTotal + this.DeathBenefitsPaid + this.BurialExpense
    }
    return total
  }
 
  property get IndemnityEvalTotal() : BigDecimal{
    var total : BigDecimal = 0
    var ra = new java.util.ArrayList<BigDecimal>()
      ra.add(this.DisabilityBenefitTotal)
      ra.add(this.OtherBenefitTotal)
      ra.add(this.LifetimeBenefitTotal)
      ra.add(this.DeathBenefitTotal)
    for(each in ra){
      if(each!=null){
        total = total + each
      }
    }
    return total
  }
}