package libraries.Contact_Entity

enhancement CMSContactFunctions : entity.Contact {
  
  function copyPersonNameForCMS(nameType : String):void{
    nameType = nameType.toLowerCase()
    // Defect 7872 - 11.10.15 - cmullin - added additional check for InjuredWorkerExt to account for WC claimants
    if(this.Subtype=="Person" or this.Subtype=="InjuredWorkerExt"){
      var person = (this as Person)
      if(nameType=="first"){
          person.LegalFNameExt = person.FirstName
      } else 
      if(nameType=="middle"){
          person.LegalMNameExt = person.MiddleName
      } else 
      if(nameType=="last"){
          person.LegalLNameExt = person.LastName
      }
    }
  }

  function getMissingCMSInfo() : String {
    var missingInfo = ""
    if(this typeis Person and this.Subtype != "PersonVendor" and this.BelowThresholdExt != true and this.RefuseProvideExt != true){
      var person = this
      if(person.Gender==null){
        missingInfo = missingInfo + "Gender, "
      }
      if(person.DateOfBirth==null){
        missingInfo = missingInfo + "Date of Birth, "
      }
      if((person.TaxID=="" || person.TaxID==null) && (person.HICNExt=="" || person.HICNExt==null)){
        missingInfo = missingInfo + "SSN or HICN, "
      }
      if(person.LegalFNameExt=="" || person.LegalFNameExt==null || person.LegalLNameExt=="" || person.LegalLNameExt==null){
        if((person.LegalFNameExt=="" || person.LegalFNameExt==null) && (person.LegalLNameExt=="" || person.LegalLNameExt==null)){
          missingInfo = missingInfo + "Medicare Reporting Name - First and Last"
        } else 
        if((person.LegalFNameExt=="" || person.LegalFNameExt==null) && (person.LegalLNameExt!="" || person.LegalLNameExt!=null)){
          missingInfo = missingInfo + "Medicare Reporting Name - First"
        } else 
        if((person.LegalFNameExt!="" || person.LegalFNameExt!=null) && (person.LegalLNameExt=="" || person.LegalLNameExt==null)){
          missingInfo = missingInfo + "Medicare Reporting Name - Last"
        }
      }
      missingInfo = missingInfo.trim()
      if(missingInfo.endsWith( "," )){
        missingInfo = missingInfo.substring( 0, missingInfo.lastIndexOf( "," ) )
      }
    }
  
    return missingInfo
  }


function getMissingORMInfo(exp:Exposure) : String {
  var missingInfo = ""
  if(this typeis Person and this.Subtype != "PersonVendor"and this.RefuseProvideExt != true and this.BelowThresholdExt != true){
    var person = this
    if(person.ContactISOMedicareExt.ORMIndExt == null)
      missingInfo = missingInfo + "ORM, "
    //Defect:8178 - cprakash - condition to check for ICD 9 codes for Non-WC- Medical Details feature type 
    //and  ICD 10 codes for WC medical details feature types  
    if(exp.ExposureType!="wc_medical_details")
    { 
      if(person.ContactISOMedicareExt.ContactICDExt.Count == 0 or (person.ContactISOMedicareExt.ContactICDExt.Count == 1 and
        person.ContactISOMedicareExt.ContactICDExt.where(\ c -> c.CauseOfInjury ).Count == 1)){
        missingInfo = missingInfo + "ICD Code, "
       }
    }
    else{
      if(exp.Claim.ensureClaimInjuryIncident()!=null && exp.Claim.ensureClaimInjuryIncident().InjuryDiagnoses.Count ==0){
        missingInfo = missingInfo + "ICD Code, "  
      } 
    }
      
    if(person.ContactISOMedicareExt.ProductLiabTypeExt == null)
       missingInfo = missingInfo + "Product Liability, "
        
    if(person.ContactISOMedicareExt.CMSIncidentDateExt == null)
       missingInfo = missingInfo + "CMS Date of Incident, "
      
    if(person.ContactISOMedicareExt.StateOfVenueExt == null)
       missingInfo = missingInfo + "State of Venue, "
      
    if(person.ContactISOMedicareExt.NFILLimitExt == null)
       missingInfo = missingInfo + "No Fault Insurance Limit (NFIL), " 
       
    missingInfo = missingInfo.trim()
    if(missingInfo.endsWith(",")){
     missingInfo = missingInfo.substring(0, missingInfo.lastIndexOf(","))
    }
    }
    return missingInfo
  }
  
  function getMissingTPOCInfo() : String{
   var missingInfo = ""
   if(this typeis Person and this.Subtype != "PersonVendor"){
    var person = this
    if(person.ContactISOMedicareExt.TPOCExt.Count == 0 and person.RefuseProvideExt != true and person.BelowThresholdExt != true){
      missingInfo = missingInfo + "TPOC Amount, TPOC Date, "
      
      if(person.ContactISOMedicareExt.ContactICDExt.Count == 0 or (person.ContactISOMedicareExt.ContactICDExt.Count == 1 and
          person.ContactISOMedicareExt.ContactICDExt.where(\ c -> c.CauseOfInjury ).Count == 1))
         missingInfo = missingInfo + "ICD9 Code, "
       
       if(person.ContactISOMedicareExt.ProductLiabTypeExt == null)
         missingInfo = missingInfo + "Product Liability, "
       
       if(person.ContactISOMedicareExt.CMSIncidentDateExt == null)
         missingInfo = missingInfo + "CMS Date of Incident, "
         
       if(person.ContactISOMedicareExt.StateOfVenueExt == null)
         missingInfo = missingInfo + "State of Venue, "
    }
      
      if(person.ContactISOMedicareExt.TPOCExt.Count > 0 and person.RefuseProvideExt != true and person.BelowThresholdExt != true){
       if(person.ContactISOMedicareExt.ContactICDExt.Count == 0 or (person.ContactISOMedicareExt.ContactICDExt.Count == 1 and
          person.ContactISOMedicareExt.ContactICDExt.where(\ c -> c.CauseOfInjury ).Count == 1))
         missingInfo = missingInfo + "ICD9 Code, "
       
       if(person.ContactISOMedicareExt.ProductLiabTypeExt == null)
         missingInfo = missingInfo + "Product Liability, "
       
       if(person.ContactISOMedicareExt.CMSIncidentDateExt == null)
         missingInfo = missingInfo + "CMS Date of Incident, "
         
       if(person.ContactISOMedicareExt.StateOfVenueExt == null)
         missingInfo = missingInfo + "State of Venue, "
         
       for(tpoc in person.ContactISOMedicareExt.TPOCExt){
        if(tpoc.CMSTPOCDate == null)
          missingInfo = missingInfo + "TPOC Date, "
          
        if(tpoc.CMSTPOCAmount == null)
          missingInfo = missingInfo + "TPOC Amount, " 
       }
         
        
      }
     missingInfo = missingInfo.trim()
     if(missingInfo.endsWith(",")){
      missingInfo = missingInfo.substring(0, missingInfo.lastIndexOf(",")) 
     }
   }
   return missingInfo
    
  }
}
