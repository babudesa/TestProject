package gw.api.address
uses java.util.Set
uses java.util.Collections
uses java.util.HashSet


/**
 * CCAddressOwner object for the Contact entity.
 * See AddressOwner and CCAddressOwner for details of what an
 * AddressOwner object does.
 */
@Export
class ContactAddressOwner extends ContactAddressOwnerBase {
  
  private var _contact : Contact
    
  construct(contact : Contact) {
    super(getAddressProperty(entity.Contact, "PrimaryAddress"))
    _contact = contact
  }
  
  override property get Owner() : Contact {
    return _contact
  }

  property get UnavailableFields() : Set<AddressOwnerFieldId> {
    
      return Collections.emptySet<AddressOwnerFieldId>()   
    
  }
  override property get ShowAddressSummary() : boolean {
     return false
  }

}
