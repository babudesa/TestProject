package libraries.Contact_Entity

enhancement CountryValidationForVendors : entity.Contact {
  //Defect #424 - 09/14/07 - zthomas
  //This function checks for the combinations of Foreign vendor with a US address 
  //and a US vendor with a Foreign address then returns the appropriate validation expression. 
  public function validateCountryForVendors(countryCode : String) : String{
  
    var validationMsg : String = null;
    
    if(countryCode != null){
      if((this.Subtype == "Ex_ForeignCoVendor" or this.Subtype == "Ex_ForeignPersonVndr" or 
      this.Subtype == "Ex_ForeignCoVenMedOrg" or this.Subtype == "Ex_ForeignCoVenLawFrm" or 
      this.Subtype == "Ex_ForeignPerVndrAttny" or this.Subtype == "Ex_ForeignPerVndrDoc" or this.Subtype=="FrgnAutoRepairShopExt") and
      countryCode.equals("US")) {
    
        validationMsg = "Foreign Vendor with a US Address."; 
    
      }
  
    	/*Defect 1348 This requirement is no longer necessary - US Vendors can be Foreign. - kmboyd - 1/13/09
      if((this.Subtype == "CompanyVendor" or this.Subtype == "PersonVendor" or 
      this.Subtype == "MedicalCareOrg" or this.Subtype == "LawFirm" or 
      this.Subtype == "Attorney" or this.Subtype == "Doctor" or this.Subtype == "Ex_GAIVendor") and
      !countryCode.equals("US")) {
    
        validationMsg = "US Vendor with a Foreign Address."; 
    
      }
      */
    }
    return validationMsg;
  }
}
