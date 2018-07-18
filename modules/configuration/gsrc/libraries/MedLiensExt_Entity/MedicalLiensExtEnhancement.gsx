package libraries.MedLiensExt_Entity
uses java.math.BigDecimal

enhancement MedicalLiensExtEnhancement : entity.MedicalLiensExt {
  Property get MedLiensTotal(): BigDecimal{
    if (this.DollarAmount == null and this.Percentage == null){
      return this.LiensTotal
    }
    return this.DollarAmount * this.Percentage /100
  }
  Property set MedLiensTotal (value:BigDecimal){
    if (value == null){
      this.LiensTotal = this.DollarAmount * this.Percentage /100
    } else {
      this.LiensTotal=value
    }
  }
}