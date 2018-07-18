package gw.api.address

uses java.util.Set

/**
 * Interface for a helper object passed to the standard Address input set. The
 * helper object provides a way to set/get a single address on the enclosing entity
 * (for example to set and get the primary address for a {@link entity.Contact}). It also contains
 * information about which fields should be visible, required etc.
 */
interface AddressOwner {  

  /**
   * Property for the address in the enclosing object. Marked as autocreate so
   * that if the address starts out null then a Gosu expression of the form
   * "owner.Address.State = someState" will automatically create a new address,
   * rather than throwing a null pointer exception
   */
  @Autocreate
  property get Address() : Address;
  property set Address(value : Address)

  /**
   * The set of fields that should be required in the UI
   */
  property get RequiredFields() : Set<AddressOwnerFieldId>

  /**
   * The set of fields that should be hidden, and not displayed in the UI
   */
  property get HiddenFields() : Set<AddressOwnerFieldId>
  
}

