package libraries.Contact_Entity

//Previously checkIfVendorCanBePayable.xml, checkPayableVendorMailAddr.xml, checkPayableVendorBusinessAddr.xml and checkPayableVendorTaxAddr.xml
enhancement PayableVendorFunctions : entity.Contact {
  function checkIfVendorCanBePayable(): String{  

    if ((this.Subtype == "Attorney" or this.Subtype == "CompanyVendor" or this.Subtype == "Doctor" or 
      this.Subtype == "LawFirm" or this.Subtype == "MedicalCareOrg" or this.Subtype == "PersonVendor" or 
      this.Subtype == "Ex_GAIVendor") and (!this.checkPayableVendorMailAddr() or !this.checkPayableVendorTaxAddr())){
      return "To make a vendor payable you must have both a Mailing and Tax Address"
    
    }else if ((this.Subtype == "Ex_ForeignCoVendor" or this.Subtype == "Ex_ForeignPersonVndr" or 
      this.Subtype == "Ex_ForeignCoVenMedOrg" or this.Subtype == "Ex_ForeignCoVenLawFrm" or 
      this.Subtype == "Ex_ForeignPerVndrAttny" or this.Subtype == "Ex_ForeignPerVndrDoc") and 
      (!this.checkPayableVendorMailAddr() and !this.checkPayableVendorBusinessAddr())){
        return "To make a foreign vendor payable you must have a Mailing or a Business Address"
    
    }else if (this.TaxID == null  ){ 
      return "To make a vendor payable you must have a Tax Id"

    }else if (this.Ex_TaxStatusCode == null){
      return "To make a vendor payable you must have a Tax status"

    }else if (this.Ex_TaxStatusCode =="1"){
      return "To make a vendor payable you must have a Tax status not equal to " + this.Ex_TaxStatusCode.DisplayName
  
    }else{ 
      return null
    }

  }
  
  function checkPayableVendorMailAddr(): boolean{  
   
    if (exists(field in this.AllAddresses where field.AddressType =="mailing" and
      field.AddressLine1 !=null and 
      field.CityStateZip !=null)){ 
      return true
      }
      return false;
  }
  
  function checkPayableVendorBusinessAddr(): boolean{  
   
      if (exists(field in this.AllAddresses where field.AddressType == "business" and
        field.AddressLine1 !=null and 
        field.CityStateZip !=null)){ 
        return true
        }
        return false;
    }

  function checkPayableVendorTaxAddr(): boolean{  
   
    if (exists(field in this.AllAddresses where field.AddressType == "Tax" and
      field.AddressLine1 !=null and 
      field.CityStateZip !=null)){ 
      return true
      }
      return false;
  }
}
