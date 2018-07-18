package libraries.Contact_Entity

enhancement VendorCountriesFilter : entity.Contact {
  public function filterVendorCountries(countryCode :String) : boolean{  
  
    var filterResult :boolean = true;
  
    /*Commented out due to new requirement from the business - Only foriegn vendors cannot have US as their country,
    all US vendors can have other countries as their address. - Defect 1348 - kmboyd - 1/8/08
  
    if(this.Subtype == "Attorney" or this.Subtype == "CompanyVendor" or this.Subtype == "Doctor" or 
    this.Subtype == "LawFirm" or this.Subtype == "MedicalCareOrg" or this.Subtype == "PersonVendor" or 
    this.Subtype == "Ex_GAIVendor"){
    
      if(countryCode == "US"){
        filterResult = true;
      }else{
        filterResult = false;
      }
    }*/
  
    if(this.Subtype == "Ex_ForeignCoVendor" or this.Subtype == "Ex_ForeignPersonVndr" or 
    this.Subtype == "Ex_ForeignCoVenMedOrg" or this.Subtype == "Ex_ForeignCoVenLawFrm" or 
    this.Subtype == "Ex_ForeignPerVndrAttny" or this.Subtype == "Ex_ForeignPerVndrDoc"or this.Subtype=="FrgnAutoRepairShopExt"){
  
      if(countryCode == "US"){
        filterResult = false;
      }else{
        filterResult = true;
      }  
    }
   
    return filterResult;
  }
}
