package libraries.MedicalEvalExt_Entity
uses java.math.BigDecimal

enhancement MedicalEvalExtEnhancement : entity.MedicalEvalExt {
  property get HospitalsTotal() :BigDecimal{
    var total : BigDecimal = 0
    var ra = new java.util.ArrayList<BigDecimal>()
      ra.add(this.SurgeonCost)
      ra.add(this.HospitalCost)
      ra.add(this.ERCost)
      ra.add(this.DiagnosticsCost)
      ra.add(this.AnesthesiaCost)
      ra.add(this.DetoxFacilityCost)
      ra.add(this.LaboratoryCost)
    for(each in ra){
      if(each!=null){
        total = total + each
      }
    }
    return total
  }
  
  property get MedicalExamsTotal() :BigDecimal{
    var total : BigDecimal = 0
    var ra = new java.util.ArrayList<BigDecimal>()
      ra.add(this.PanelQMECost)
      ra.add(this.AMEQMEIMECost)
      ra.add(this.MedicalReportsCost)
      ra.add(this.FunctionalCapacityCost)
    for(each in ra){
      if(each!=null){
        total = total + each
      }
    }
    return total
  }
  
  property get ManagedCareTotal():BigDecimal{
    var total : BigDecimal = 0
    var ra = new java.util.ArrayList<BigDecimal>()
      ra.add(this.HomeHealthcareCost)
      ra.add(this.NurseCaseMgmtCost)
      ra.add(this.PainMgmtCost)
      ra.add(this.PrescriptionsDrugsCost)
      ra.add(this.DMECost)
      ra.add(this.MiscellaneousCost)
    for(each in ra){
      if(each!=null){
        total = total + each
      }
    }
    return total
  }

  property get ProvidersTotal() :BigDecimal{
    var total : BigDecimal = 0
      for (amt in this.MedProviders){
        if(amt.ProvidersTotal!=null){
          total = total + amt.ProvidersTotal
        }
      }
    return total
  }

  property get TransportationTotal() :BigDecimal{
    var total : BigDecimal = 0
    var transTotal : BigDecimal = 0
    for (amt in this.MedTransportation){
      if(amt.TransportationTotal!=null){
        transTotal = transTotal + amt.TransportationTotal
      }
    }
    if(this.Translation==null){
      total = transTotal
    }else{
      total = transTotal + this.Translation
    }
    return total
  }

  property get LienTotal() :BigDecimal{
    var total : BigDecimal = 0
    for (amt in this.MedLiens){
      if(amt.MedLiensTotal!=null){
        total = total + amt.MedLiensTotal
      }
    }
    return total
  }
  
  property get MedEvalTotal() :BigDecimal{
    var total : BigDecimal = 0
    var ra = new java.util.ArrayList<BigDecimal>()
      ra.add(this.ProvidersTotal)
      ra.add(this.HospitalsTotal)
      ra.add(this.MedicalExamsTotal)
      ra.add(this.ManagedCareTotal)
      ra.add(this.TransportationTotal)
      ra.add(this.LienTotal)
    for(each in ra){
      if(each!=null){
        total = total + each
      }
    }
    return total
  }
}
