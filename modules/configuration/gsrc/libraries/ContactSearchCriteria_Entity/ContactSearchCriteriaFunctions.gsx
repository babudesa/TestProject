package libraries.ContactSearchCriteria_Entity
uses pcf.AddressBookSearchDV

enhancement ContactSearchCriteriaFunctions : entity.ContactSearchCriteria {
  // 06/05/2008 - zthomas - Defect 905, Function to default the address book search country to US.
  public function setDefaultContactSearchCountry(){
    if(this.ContactSubtype != "Ex_ForeignCoVendor" and this.ContactSubtype != "Ex_ForeignCoVenLawFrm" and 
    this.ContactSubtype != "Ex_ForeignCoVenMedOrg" and this.ContactSubtype != "Ex_ForeignPersonVndr" and 
    this.ContactSubtype != "Ex_ForeignPerVndrAttny" and this.ContactSubtype != "Ex_ForeignPerVndrDoc"){
      this.CountryExt = "US";
    }else{
      this.CountryExt = null;
    }
  }

  // 06/05/2008 - zthomas - Defect 905, Function to Filter countries for US and Foreign vendors.
  public function filterContactSearchCountries(countryCode : String) : Boolean{
    var filterResult :boolean = true;
  
    if(this.ContactSubtype == "Attorney" or this.ContactSubtype == "CompanyVendor" or this.ContactSubtype == "Doctor" or 
    this.ContactSubtype == "LawFirm" or this.ContactSubtype == "MedicalCareOrg" or this.ContactSubtype == "PersonVendor" or 
    this.ContactSubtype == "Ex_GAIVendor"){
    
      if(countryCode == "US"){
        filterResult = true;
      }else{
        filterResult = false;
      }
    }
  
    if(this.ContactSubtype == "Ex_ForeignCoVendor" or this.ContactSubtype == "Ex_ForeignPersonVndr" or 
    this.ContactSubtype == "Ex_ForeignCoVenMedOrg" or this.ContactSubtype == "Ex_ForeignCoVenLawFrm" or 
    this.ContactSubtype == "Ex_ForeignPerVndrAttny" or this.ContactSubtype == "Ex_ForeignPerVndrDoc"){
  
      if(countryCode == "US"){
        filterResult = false;
      }else{
        filterResult = true;
      }  
    }
   
    return filterResult;
  }
  
  public function getABSearchContactTypes(requiredContactType: Type, SIRScreen :Boolean, allowPlace : Boolean) : List
  {  
    var avaliableSubtypes : List = this.getAvailableSubtypes( requiredContactType ).toList()
    var contactTypes : List = new java.util.ArrayList();
    
    if((requiredContactType as String) == "entity.Contact"){
      contactTypes.add("Contact")
    }
  //Defect 5110: Removing Company and Vendor types from Address Book Search Type
 /* if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_PERSON) and !SIRScreen){
      contactTypes.add("Person")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_COMPANY) and !SIRScreen){
      contactTypes.add("Company")
    } */
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_ATTORNEY)){
      contactTypes.add("Attorney")
    } 
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_AUTOREPAIRSHOP)){
      contactTypes.add("AutoRepairShop") 
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_COMPANYVENDOR)){
      contactTypes.add("CompanyVendor")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_DOCTOR)){
      contactTypes.add("Doctor")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_LAWFIRM)){
      contactTypes.add("LawFirm")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_MEDICALCAREORG)){
      contactTypes.add("MedicalCareOrg")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_PERSONVENDOR)){
      contactTypes.add("PersonVendor") 
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_NONVENDORPAYEECOMPANYEXT) and !SIRScreen){
      contactTypes.add("NonVendorPayeeCompanyExt")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_NONVENDORPAYEEPERSONEXT) and !SIRScreen){
      contactTypes.add("NonVendorPayeePersonExt")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_EX_GAIVENDOR) and !SIRScreen){
      contactTypes.add("Ex_GAIVendor")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_EX_FOREIGNPERVNDRATTNY)){
      contactTypes.add("Ex_ForeignPerVndrAttny")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_FRGNAUTOREPAIRSHOPEXT)){
      contactTypes.add("FrgnAutoRepairShopExt") 
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_EX_FOREIGNCOVENDOR)){
      contactTypes.add("Ex_ForeignCoVendor")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_EX_FOREIGNPERVNDRDOC)){
      contactTypes.add("Ex_ForeignPerVndrDoc")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_EX_FOREIGNCOVENLAWFRM)){
      contactTypes.add("Ex_ForeignCoVenLawFrm")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_EX_FOREIGNCOVENMEDORG)){
      contactTypes.add("Ex_ForeignCoVenMedOrg")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_EX_FOREIGNPERSONVNDR)){
      contactTypes.add("Ex_ForeignPersonVndr")
    }
    if(exists(contactType in avaliableSubtypes where contactType == typekey.Contact.TC_PLACE and allowPlace)){
      contactTypes.add("Place")
    }
    return contactTypes;

  }
  
  public function isAllowedInABSearch(contactType : typekey.Contact) : boolean{  
    if((contactType == typekey.Contact.TC_ADJUDICATOR) 
      || (contactType == typekey.Contact.TC_USERCONTACT) 
      || (contactType == typekey.Contact.TC_EX_AGENCY) 
      || (contactType == typekey.Contact.TC_LEGALVENUE) 
      || (contactType == typekey.Contact.TC_AUTOTOWINGAGCY) 
      || (contactType == typekey.Contact.TC_PLACE)
      || (contactType == typekey.Contact.TC_LEGACYVENDORCOMPANYEXT)) {
      return false; 
    }
    return true;
  }
  
  public function getContactTypeName(typeCode : typekey.Contact, requiredContactType: Type) : String {  
    var typeName : String = new String()
  
    for(type in this.getAvailableSubtypes( requiredContactType )){ 
  
      if(type.Code == typeCode){ 
          typeName = type.DisplayName
      }

    }
     if(typeName.equalsIgnoreCase("Contact")) typeName = "All Contacts"
      
    return typeName
  }
  
   function isForeign() : boolean {
    if ((this.ContactSubtype==  "Ex_ForeignCoVendor") || (this.ContactSubtype == "Ex_ForeignPersonVndr") || (this.ContactSubtype == "Ex_ForeignCoVenMedOrg") || (this.ContactSubtype == "Ex_ForeignCoVenLawFrm") || (this.ContactSubtype == "Ex_ForeignPerVndrAttny") || (this.ContactSubtype == "Ex_ForeignPerVndrDoc")) {
      return true; 
    }
    return false;
  }
}
