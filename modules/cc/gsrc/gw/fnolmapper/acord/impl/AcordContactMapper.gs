package gw.fnolmapper.acord.impl
uses typekey.State
uses entity.Address
uses typekey.ContactRole
uses entity.Company
uses java.lang.String
uses typekey.GenderType
uses entity.ClaimContactRole
uses gw.fnolmapper.acord.IContactMapper
uses xsd.acord.GeneralPartyInfo_Type
uses java.util.List
uses entity.Policy
uses typekey.PrimaryPhoneType
uses entity.Person
uses gw.fnolmapper.acord.AcordConfig
uses entity.Contact
uses gw.fnolmapper.acord.impl.AcordAddressMapper

uses com.guidewire.logging.LoggerCategory
uses  xsd.acord.GeneralPartyInfo_Type
uses xsd.acord.NameInfo_Type
uses java.util.ArrayList
uses xsd.acord.InsuredOrPrincipal_Type
uses xsd.acord.InsuredOrPrincipalInfo_Type
uses xsd.acord.PersonInfo_Type
uses xsd.acord.BusinessInfo_Type
uses xsd.acord.ClaimsParty_Type

/**
 * Maps the appropriate XML elements to ClaimContact/Contact entities
 */
@Export
class AcordContactMapper implements IContactMapper
{
  static var logger = LoggerCategory.API
  
  var config:AcordConfig
  
  construct(configuration:AcordConfig) {
    this.config = configuration
  }
  
  //Main method to get the Insured or Principal ClaimContact
  override function getContact(principal:InsuredOrPrincipal_Type, policy:Policy) : ClaimContact {
    var partyInfo = principal.GeneralPartyInfo
    //if does not validate, dump contact
    if(!validate(partyInfo))
      return null
    var contact = getContact(partyInfo, principal.InsuredOrPrincipalInfo)
    var claimContact = getClaimContact(contact, partyInfo)
    for(roleElem in principal.InsuredOrPrincipalInfo.InsuredOrPrincipalRoleCds) {
      var cr = getRole(roleElem.Text)
      if(cr.Role==ContactRole.TC_INSURED)
        cr.Policy = policy
      claimContact.addToRoles(cr)
    }
    return claimContact
  }
  
  //Main method to get the Claim Party ClaimContact
  override function getContact(claimParty:ClaimsParty_Type) : ClaimContact {
    var partyInfo = claimParty.GeneralPartyInfo
    //if does not validate, dump contact
    if(!validate(partyInfo))
      return null
    var ct = getContact(claimParty.GeneralPartyInfo, claimParty)
    var claimContact = getClaimContact(ct, partyInfo)
    for(roleElem in claimParty.ClaimsPartyInfo.ClaimsPartyRoleCds) {
      claimContact.addToRoles(getRole(roleElem.Text))
    }
    return claimContact
  }
  
  //returns new ClaimContact from Contact with additional info populated
  private function getClaimContact(contact:Contact, partyInfo:GeneralPartyInfo_Type) : ClaimContact {
     var claimContact = new ClaimContact()
     claimContact.Contact = contact
     if(partyInfo.EffectiveDt_elem!=null)
       claimContact.ContactValidFrom = partyInfo.EffectiveDt_elem.toDate()
     return claimContact
  }
  
  //returns the claim role for the contact
  private function getRole(roleName:String) : ClaimContactRole {
    var claimRole = new ClaimContactRole()
    claimRole.Role = config.getContactRoleMap().get(roleName)
    return claimRole
  }
  
  //get a claim party contact
  private function getContact(partyInfo:GeneralPartyInfo_Type, claimPartyInfo:ClaimsParty_Type) : Contact {
    var contact:Person
    if(partyInfo.NameInfos.HasElements)
      contact = getPerson(partyInfo.NameInfos[0], claimPartyInfo.PersonInfo)
    else
      contact = getPerson(null, claimPartyInfo.PersonInfo)
    if(claimPartyInfo.ClaimsDriverInfo!=null) {
      if(claimPartyInfo.ClaimsDriverInfo.DriversLicenses.HasElements) {
        var dl = claimPartyInfo.ClaimsDriverInfo.DriversLicenses.first()
        contact.LicenseNumber = dl.DriversLicenseNumber
        contact.LicenseState = State.get(dl.StateProvCd)
      }
    }
    populateContactInfo(contact, partyInfo)
    return contact
  }
  
  //get a given Principal/Insured contact
  private function getContact(partyInfo:GeneralPartyInfo_Type, principalInfo:InsuredOrPrincipalInfo_Type) : Contact 
  {
      var nameInfo = partyInfo.NameInfos.HasElements ? partyInfo.NameInfos[0] : null
      
      var contact:Contact
      //get the appropriate contact type
      if(nameInfo==null or nameInfo.Choice.PersonName!=null) {
        contact = getPerson(nameInfo, principalInfo.Choice.Sequence.PersonInfo)
      } else if(nameInfo.Choice.CommlName!=null) {
        contact = getCompany(nameInfo, principalInfo.Choice.Sequence2.BusinessInfo)
      } else {
         return getUnknownContact()
      }
      populateContactInfo(contact, partyInfo)
      return contact
  }
  
  //populate the addresses and communications
  private function populateContactInfo(contact:Contact, partyInfo:GeneralPartyInfo_Type) {
      //get the contact addresses
      getAddresses(partyInfo).eachWithIndex(\ address, i -> {
        if(i==0)
          contact.PrimaryAddress = address
        else
          contact.addAddress(address)
      })
      //get contact communications info
      populateCommunications(contact, partyInfo.Communications)
  }
  
  //gets phone numbers
  private function populateCommunications(contact:Contact, comm:xsd.acord.Communications_Type) {
    if(comm==null) return
    comm.PhoneInfos.eachWithIndex(\ phoneInfo, i -> {
      if(i==0) {
        if(phoneInfo.PhoneTypeCd_elem.Text.equalsIgnoreCase("Cell"))
          contact.PrimaryPhone = PrimaryPhoneType.TC_MOBILE
        else if(matchesCommunicationUse({"Business"}, phoneInfo.CommunicationUseCds))
          contact.PrimaryPhone = PrimaryPhoneType.TC_WORK
        else
          contact.PrimaryPhone = PrimaryPhoneType.TC_HOME        
      }
      //populate phone #s
      if(matchesCommunicationUse({"Home"}, phoneInfo.CommunicationUseCds))
          contact.HomePhone = phoneInfo.PhoneNumber
      else if(matchesCommunicationUse({"Business"}, phoneInfo.CommunicationUseCds))
          contact.WorkPhone = phoneInfo.PhoneNumber
      //populate emails
      comm.EmailInfos.eachWithIndex(\ emailInfo, j -> {
          if(j==0)
            contact.EmailAddress1 = emailInfo.EmailAddr
          else
            contact.EmailAddress2 = emailInfo.EmailAddr
      })
    })
  }
  
  //tests that a given code exists in the communications uses
  private function matchesCommunicationUse(codes:String[], phoneUses:List<xsd.acord.CommunicationUse>) : boolean {
    for(phoneUse in phoneUses) {
      for(code in codes) {
        if(phoneUse.Text.equalsIgnoreCase(code))
          return true
      }
    }
    return false
  }
  
  //validates the NameInfo list
  private function validate(partyInfo:GeneralPartyInfo_Type) : boolean {
    if(partyInfo.NameInfos.Count==0) {
      logger.warn("Missing contact name information <NameInfo>: using 'Unknown'")
      return true
    } else if(partyInfo.NameInfos.Count>1) {
      logger.warn("More than one contact name information <NameInfo>: only processing the first")
    }
    return true
  }
  
  //gets the list of all addresses under GeneralPartyInfo
  private function getAddresses(partyInfo : GeneralPartyInfo_Type) : List<Address> {
    var mapper = new AcordAddressMapper(config)
    var addresses = new ArrayList<Address>()
    partyInfo.Addrs.each(\ addr -> {
      addresses.add(mapper.getAddress(addr))
    })
    return addresses
  }
    
  //creates an unknown Person contact
  private function getUnknownContact() : Person {
    var unknownPerson = new Person()
    unknownPerson.LastName = "Unknown"
    return unknownPerson
  }
  
  //gets the Person contact
  private function getPerson(nameInfo:NameInfo_Type, personInfo:PersonInfo_Type) : Person {
      var person:Person
      if(nameInfo==null) {
        person = getUnknownContact()
      } else {
        person = new Person()
        var personNameInfo = nameInfo.Choice.PersonName
        person.FirstName = personNameInfo.GivenName
        person.LastName = personNameInfo.Surname!=null ? personNameInfo.Surname : "Unknown"
      }
      if(personInfo!=null) {
        person.DateOfBirth = personInfo.BirthDt_elem.toDate()
        person.Gender = GenderType.get(personInfo.GenderCd_elem.Text)
        person.MaritalStatus = config.getMaritalStatusTypeMap().get(personInfo.MaritalStatusCd_elem.Text)
        person.Occupation = personInfo.OccupationDesc
      }
      return person
  }
  
  //get the Company contact
  private function getCompany(nameInfo:NameInfo_Type, businessInfo:BusinessInfo_Type) : Company {
      var company = new Company()
      company.Name = nameInfo.Choice.CommlName.CommercialName
      if(businessInfo!=null) {
        company.NCCIIDOfficialID = businessInfo.NCCIIDNumber
      }
      return company
  }
}
