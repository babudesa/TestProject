package libraries.VocRehabilitationExt_Entity

uses java.math.BigDecimal

enhancement VocRehabilitationExtEnhancement : entity.RehabilitationExt {
  property get EvaluationTotal() : BigDecimal{
    return this.Evaluation.Rehabs.sum(\ d -> d.RehabTotal)
  }

  property get RehabTotal() : BigDecimal{  
    if (this.NumberWeeks == null and this.PayRate == null){
      return this.Total
    }
      return this.NumberWeeks * this.PayRate
  }
  
  property set RehabTotal (value : BigDecimal){
    if (value == null){
      this.Total = this.NumberWeeks * this.PayRate
    } else {
      this.Total=value
    }
  }
}