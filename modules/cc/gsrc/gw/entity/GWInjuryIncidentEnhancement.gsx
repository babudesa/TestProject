package gw.entity

enhancement GWInjuryIncidentEnhancement : entity.InjuryIncident
{
  property get ComplexInjury() : boolean 
  {
    
    if (this.Subtype =="InjuryIncident"  and 
    this.Severity == "fatal" or this.Severity == "major-injury" or this.Severity =="severe-injury")
    {
    return true
    } 
    else return false
  }
  
  function setPrimaryDiagnosisToFalse(){
    for (aDiagnosis in this.InjuryDiagnoses.where( \ i -> i.IsPrimary == true ))
    {
      aDiagnosis.IsPrimary = false
    }
  }
}
