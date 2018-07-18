package gw.api.address
uses java.util.Set
uses java.util.Collections
uses java.lang.UnsupportedOperationException
uses gw.entity.IEntityPropertyInfo

/**
 * Base class for address owners that populate the primary address of a contact.
 * In this case we hide the drop down list of addresses (Addresses returns null)
 * and don't have any required fields except for Places which require a postal code.
 */
@Export
abstract class ContactAddressOwnerBase extends CustomAddressOwnerBase {

  construct(prop : IEntityPropertyInfo) {
    super(prop)
  }

  override property get Addresses() : Address[] {
    return null
  }

  override property get NonEditableAddresses() : Set<Address> {
    return Collections.emptySet<Address>()
  }
  
  /* Cannot override because superclass marked this property as final
  
  override property get RequiredFields() : Set<AddressOwnerFieldId> {
    return AddressFields.getContactRequiredFields(Owner)
  }
  */

  override property get HiddenFields() : Set<AddressOwnerFieldId> {
    var hideTheseFields : Set<AddressOwnerFieldId> = new java.util.HashSet<AddressOwnerFieldId>()
    hideTheseFields.addAll({CCAddressOwnerFieldId.LATITUDE,CCAddressOwnerFieldId.LONGTITUDE})
    hideTheseFields.addAll(AddressFields.getContactHiddenFields(Owner))
    return hideTheseFields
  }
  
  override property get Owner() : Contact {
    // Must be overridden in subclass
    throw new UnsupportedOperationException("Must override ContactAddressOwnerBase.Owner in subclass")
  }
}
