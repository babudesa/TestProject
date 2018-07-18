package gw.api.iso
uses xsd.iso.req.ClaimsParty
uses java.lang.IllegalArgumentException
uses xsd.iso.req.NameInfo
uses xsd.iso.req.ClaimsPartyRelationship2
uses xsd.iso.req.Communications
uses xsd.iso.req.GeneralPartyInfo
uses xsd.iso.req.TaxIdentity
uses java.util.HashMap
uses java.util.ArrayList
uses xsd.iso.req.StringCd

/**
 * Empty subclass of ISOAdjusterPartiesBase, provided so customers can
 * override methods and properties in the base implementation.
 */
@Export
class ISOClaimsParties extends ISOClaimsPartiesBase {
  
  var _serviceProvidersMap : HashMap<ClaimsParty, List<Contact>> = new HashMap<ClaimsParty, List<Contact>>()
  
  construct(isoRequest : ISOClaimSearchRequestBase) {
    super(isoRequest)
  }

  /**
   * Does the given address have all the fields required for it to be
   * reported to ISO on a contact with the given role?
   */
  override protected function isAddressReadyForISO(address : AddressBase, role : ISOClaimsPartyRole) : boolean {
    if ((address.AddressLine1.HasContent || !role.IsIndividual) && address.City.HasContent && address.Country != null) {
      if ((address.Country == Country.TC_US || address.Country == Country.TC_CA)) {
        return address.State != null
      } else {
        return true
      }
    } else {
      return false
    }
  }
  
  protected function addToRoles(owner : ClaimsParty, claimsParty : ClaimsParty, role : ISOClaimsPartyRole){
    if (role != getRole(claimsParty)) {
      var newClaimsPartyRoleCds : java.util.List<StringCd> = new java.util.ArrayList<StringCd>(claimsParty.ClaimsPartyInfo.ClaimsPartyRoleCds)
      newClaimsPartyRoleCds.add(createClaimsPartyRoleCd(role))
      claimsParty.ClaimsPartyInfo.ClaimsPartyRoleCds = newClaimsPartyRoleCds      
      if (!role.IsIndividual) {
        addRelationship(owner, claimsParty)
      }
    }    
  }

  //override so a unique claimsparty node can be added for each feature's claimant
  @Throws(IllegalArgumentException, "If owner is null and the given role is not an individual role")
  public override function addParty(owner : ClaimsParty, contact : Contact, role : ISOClaimsPartyRole) : ClaimsParty {
    if (owner == null && !role.IsIndividual) {
      throw new IllegalArgumentException("addParty called with non individual role '" + role + "' but a null owner ClaimsParty; an owner is required for non individual roles")
    }
    var claimsParty = _partiesByContact[contact]

    if(claimsParty == null){
      if (isContactReadyForISO(contact, role)) {
        claimsParty = addNewClaimsParty(owner, contact, role)
        _partiesByContact[contact] = claimsParty
      }
    } else {
      updateExistingPartyRole(owner, claimsParty, role)
    } 
    return claimsParty
  }
  
  @Throws(IllegalArgumentException, "If owner is null and the given role is not an individual role")
  public function addServiceProvider(owner : ClaimsParty, contact : Contact, role : ISOClaimsPartyRole) : ClaimsParty {
    if (owner == null && !role.IsIndividual) {
      throw new IllegalArgumentException("addParty called with non individual role '" + role + "' but a null owner ClaimsParty; an owner is required for non individual roles")
    }
    var claimsParty = _partiesByContact[contact]
    
    if(isContactReadyForISO(contact, role)){
      if(_serviceProvidersMap[owner] != null){
        if(!_serviceProvidersMap[owner].contains(contact)){
          claimsParty = addNewClaimsParty(owner, contact, role)
          //add contact to existing entry
          _serviceProvidersMap[owner].add(contact)           
        }
      }else{
        claimsParty = addNewClaimsParty(owner, contact, role)
        //create new entry
        _serviceProvidersMap.put(owner, new ArrayList<Contact>())
        //add contact to new entry
        _serviceProvidersMap[owner].add(contact)        
      }
    }
    
    return claimsParty
  }  
  
  /**
   * Creates a NameInfo aggregate (sub aggregate of GeneralPartyInfo) for the
   * given contact. If full is true includes contact tax ids.
   * Overridden so we can truncate Commercial Name at 60 characters instead of 55
   */
  protected override function createNameInfo(contact : Contact, full : boolean) : NameInfo {
    var nameInfo = new xsd.iso.req.NameInfo()
    if (contact typeis Person) {
      nameInfo.Choice.PersonName.Surname = _isoRequest.truncateString(contact.LastName, 30) 
      nameInfo.Choice.PersonName.GivenName = _isoRequest.truncateString(contact.FirstName, 20)
      var middleName = new xsd.iso.req.String()
      middleName.Value = _isoRequest.truncateString(contact.MiddleName, 20) 
      nameInfo.Choice.PersonName.OtherGivenNames.add(middleName)
    } else {
      var company = contact as Company
      nameInfo.Choice.CommlName.CommercialName = _isoRequest.truncateString(company.Name, 60)
    }
    if(full && contact.TaxID != null) {
      nameInfo.TaxIdentitys.add( createTaxIdentity(contact) )
    }
    return nameInfo
  }
  
  /**
   * OVERRIDE - Enable setting codelistref for each relationship's role
   * Adds a new ClaimsPartyRelationship aggregate linking party2 to party1
   */
  protected override function addRelationship(party1 : ClaimsParty, party2 : ClaimsParty) {
    var relationship = new ClaimsPartyRelationship2()
    relationship.ClaimsParty1Ref = party1
    relationship.ClaimsPartyRole1Cd = getRole(party1).Code
    relationship.ClaimsPartyRole1Cd_elem.codelistref = _isoRequest.findOrCreateCodeList(ISOCodeList.CLAIMS_PARTY_ROLE_CODE.Id)
    relationship.ClaimsParty2Ref = party2
    relationship.ClaimsPartyRole2Cd = getRole(party2).Code
    relationship.ClaimsPartyRole2Cd_elem.codelistref = _isoRequest.findOrCreateCodeList(ISOCodeList.CLAIMS_PARTY_ROLE_CODE.Id)
    _isoRequest.AddRequest.ClaimsPartyRelationships.add(relationship)
  }
  
  /**
   * OVERRIDE - Send our Contact level cell phone field instead of the Person level OOTB version
   * Create a Communications aggregate for the given contact (sub aggregate of
   * GeneralPartyInfo). If full is true includes home and cell phone number
   * (if available)
   */
  protected override function createCommunications(contact :  Contact, full : boolean) : Communications {
    var communications = new xsd.iso.req.Communications()
    var workPhone = _isoRequest.Translate.formatPhoneNumber(contact.WorkPhone)
    var claimContact : ClaimContact = _isoRequest.Claim.Contacts.where(\ c -> c.Contact == contact).first()
    if (workPhone != null) {
      communications.PhoneInfos.add(createPhoneInfo(ISOConstants.PHONE, ISOConstants.WORK_PHONE, workPhone))
    }else if(claimContact != null && claimContact.cscWorkPhoneExt != null){
      workPhone = _isoRequest.Translate.formatPhoneNumber(claimContact.cscWorkPhoneExt)
      if(workPhone != null)
        communications.PhoneInfos.add(createPhoneInfo(ISOConstants.PHONE, ISOConstants.WORK_PHONE, workPhone))
    }
    
    if (full) {
      var homePhone = _isoRequest.Translate.formatPhoneNumber(contact.HomePhone)
      if (homePhone != null) {
        communications.PhoneInfos.add(createPhoneInfo(ISOConstants.PHONE, ISOConstants.HOME_PHONE, homePhone)) 
      }else if(claimContact != null && claimContact.cscHomePhoneExt != null){
        homePhone = _isoRequest.Translate.formatPhoneNumber(claimContact.cscHomePhoneExt)
        if(homePhone != null)
          communications.PhoneInfos.add(createPhoneInfo(ISOConstants.PHONE, ISOConstants.HOME_PHONE, homePhone)) 
      }
      
      var cellPhone = _isoRequest.Translate.formatPhoneNumber(contact.CellPhoneExt)
      if (cellPhone != null) {
        communications.PhoneInfos.add(createPhoneInfo(ISOConstants.CELL_PHONE, ISOConstants.ALTERNATE_PHONE, cellPhone))   
      }else if(claimContact != null && claimContact.cscCellPhoneExt != null){
        cellPhone = _isoRequest.Translate.formatPhoneNumber(claimContact.cscCellPhoneExt)
        if(cellPhone != null)
          communications.PhoneInfos.add(createPhoneInfo(ISOConstants.CELL_PHONE, ISOConstants.ALTERNATE_PHONE, cellPhone))   
      }
    }
    return communications
  }
  
   /**
   * OVERRIDE - to look at our CellPhoneExt off of the Contact instead of OOTB CellPhone field
   * Creates a GeneralPartyInfo aggregate for the given contact. If full is
   * true, includes the tax id, home/cell phone and address of the contact.
   */
  protected override function createGeneralPartyInfo(contact : Contact, full : boolean) : GeneralPartyInfo {
    var generalPartyInfo = new xsd.iso.req.GeneralPartyInfo()  
    generalPartyInfo.NameInfos.add( createNameInfo(contact, full) )
    var address = contact.PrimaryAddress
    if (full && address != null) {
      generalPartyInfo.Addrs.add(_isoRequest.createAddr(address))
    }
    if (contact.WorkPhone != null ||
        contact.HomePhone != null ||
        (contact typeis Person && contact.CellPhoneExt != null) ||
        this._isoRequest.Claim.Contacts
          .hasMatch(\ c -> c.Contact == contact && c.cscWorkPhoneExt != null || c.cscHomePhoneExt != null || c.cscCellPhoneExt != null)) {
      generalPartyInfo.Communications = createCommunications(contact, full)      
    }
    return generalPartyInfo
  }
  
  /**
   * Creates a TaxIdentity aggregate (sub aggregate of NameInfo) for the
   * given contact. If full is true includes contact tax ids.
   * Overridden to include codelistref for taxIdType
   */
  protected override function createTaxIdentity(contact : Contact) : TaxIdentity {
    var taxId = contact.TaxID.replaceAll("-", "")
    var taxIdentity = new xsd.iso.req.TaxIdentity()
    taxIdentity.TaxIdTypeCd = (contact typeis Person) ? ISOConstants.TAX_IDENTITY_SSN : ISOConstants.TAX_IDENTITY_TIN
    taxIdentity.TaxId = taxId
    var taxIdTypeCodeList = this._isoRequest.findOrCreateCodeList("TaxIdTypeCd")
    taxIdentity.TaxIdTypeCd_elem.codelistref = taxIdTypeCodeList
    return taxIdentity
  }
    
}