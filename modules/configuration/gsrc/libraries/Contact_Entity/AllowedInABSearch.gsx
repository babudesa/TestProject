package libraries.Contact_Entity

enhancement AllowedInABSearch : entity.Contact {
  public function isAllowedInBulkedSearch(contactType :String) : boolean{  
    if((contactType == "Adjudicator") || (contactType == "UserContact") || (contactType == "ex_Agency") 
      || (contactType == "LegalVenue") || (contactType == "AutoTowingAgcy") 
      || (contactType == "Place") || contactType == "Person" || contactType == "Company") {
      return false; 
    }
    return true;
  }
}
