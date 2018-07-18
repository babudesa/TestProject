package gaic.import.bill.validation
uses entity.Contact
uses java.util.ArrayList


/**
 * ContactValidator matches the contact data in ClaimCenter against
 * the data coming from an external application
 * 1. If taxid is present it is matched
 * 2. If tax id does not match then match by the name (person: first name, last name, company: name)
 */
class NonVendorMatcher {

  construct() {

  }
  
  
  /**
  * Attempts to find a matching contact in the given list
  * given the contact taxid, full name, first name, and last name
  */
  public function matchesContactInList(contactsToSearch : ArrayList<ClaimContact>, taxId : String, fullName : String, firstName : String, lastName : String) : Boolean {
    if(contactsToSearch != null and contactsToSearch.size() > 0){
      for(contact in contactsToSearch){
        if(contactMatches(contact, taxId, fullName, firstName, lastName)){
          return true
        }
      }
    }
    return false
  }
  
   
  /**
  * Uses the appropriate logic to determine if
  * the contact matches with the provided data
  */
  public function contactMatches(contact : ClaimContact, taxId : String, fullName : String, firstName : String, lastName : String) : Boolean {
    var matches: boolean = false
    if(contact.Contact typeis Person){
      matches = personMatches(contact.Contact, taxId, firstName, lastName)
    }else if(contact.Contact typeis InjuredWorkerExt){
      matches = personMatches(contact.Contact, taxId, firstName, lastName)
    }else if(contact.Contact typeis Company){
      matches = companyMatches(contact, taxId, fullName)
    }
    return matches
  }


  /**
  * Person matches if the last name, and the first name matches
  */
  public function personMatches(person : Person, taxId : String, firstName : String, lastName : String) : Boolean {
    var matches: boolean = false
    if(person != null ){
      if(taxIdMatches(person.TaxID, taxId)){
        matches = true
      }else if(matchesPersonName(person, firstName, lastName)){
        matches = true
      }
    }
    return matches
  }


  /**
  * Find out if this person is a match based on the criteria used when sending the ISO report
  * LegalLastName is matched
  * If one of these is missing on the ClaimCenter side
  * then the corresponding LastName on the Basics tab are matched instead
  * as this is how ClaimCenter assembles the name to be sent to ISO
  */
  private function matchesPersonName(person : Person, firstName : String, lastName : String) : Boolean {  
    return matchesLastName(person, lastName) and matchesFirstName(person, firstName)
  }


  /**
  * Matches last name against given last name
  */
  private function matchesLastName(person : Person, lastName : String) : Boolean {  
    var matches : boolean = false
    if(person.LegalLNameExt != null and person.LegalLNameExt.equalsIgnoreCase(lastName)){
      matches = true
    }else if(person.LastName != null and person.LastName.equalsIgnoreCase(lastName)){
      matches = true
    }
    return matches
  }
 
 
  /**
  * Matches first name against given first name
  */
  private function matchesFirstName(person : Person, firstName : String) : Boolean {  
    var matches : boolean = false
    if(person.LegalFNameExt != null and person.LegalFNameExt.equalsIgnoreCase(firstName)){
      matches = true
    }else if(person.FirstName != null and person.FirstName.equalsIgnoreCase(firstName)){
      matches = true
    }
    return matches
  }
  
  
  /**
  *  A contact might not have a tax id, or  may be identified by ssn
  * in such case, the ssn is being sent in the filed for the tax id
  */
  private function taxIdMatches(firstTaxId: String, taxId : String) : Boolean {
    return firstTaxId != null and firstTaxId.equals(taxId)
  }


  /**
  * Company matches 
  */
  public function companyMatches(contact : ClaimContact, taxId: String, companyName : String) : Boolean {
    var matches : boolean = false
    if(contact != null){
      if(taxIdMatches(contact.Contact.TaxID, taxId)){
        matches = true
      }else if(matchesCompanyName(contact.Contact as Company, companyName)){
        matches = true
      }
    }
    return matches   
  }


  /**
  * Matches company contact name against given company name
  */
  private function matchesCompanyName(contact : Company, companyName : String) : Boolean {  
    return contact.Name != null and contact.Name.equalsIgnoreCase(companyName)
  }
  

}
