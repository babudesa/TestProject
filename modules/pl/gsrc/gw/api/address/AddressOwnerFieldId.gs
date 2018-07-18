package gw.api.address

uses java.util.Set

/**
 * Used to provide typesafety for extendable fields and
 * contains the defined Field ID constants
 */
@Export
class AddressOwnerFieldId {

  var _name : String
  protected construct(name : String) {
    _name = name
  }

  property get Named() : String {
    return _name
  }

  /**
   * Constants for available fields
   */
  public static final var ADDRESSLINE1 : AddressOwnerFieldId = new AddressOwnerFieldId("ADDRESSLINE1")
  public static final var ADDRESSLINE2 : AddressOwnerFieldId = new AddressOwnerFieldId("ADDRESSLINE2")
  public static final var ADDRESSLINE3 : AddressOwnerFieldId = new AddressOwnerFieldId("ADDRESSLINE3")
  public static final var CITY : AddressOwnerFieldId = new AddressOwnerFieldId("CITY")
  
  public static final var COUNTY : AddressOwnerFieldId = new AddressOwnerFieldId("COUNTY")
  public static final var STATE : AddressOwnerFieldId = new AddressOwnerFieldId("STATE")
  public static final var POSTALCODE : AddressOwnerFieldId = new AddressOwnerFieldId("POSTALCODE")
  public static final var COUNTRY : AddressOwnerFieldId = new AddressOwnerFieldId("COUNTRY")
  public static final var ADDRESSTYPE : AddressOwnerFieldId = new AddressOwnerFieldId("ADDRESSTYPE")
  public static final var DESCRIPTION : AddressOwnerFieldId = new AddressOwnerFieldId("DESCRIPTION")
  public static final var VALIDUNTIL : AddressOwnerFieldId = new AddressOwnerFieldId("VALIDUNTIL")


  /** Empty set of fields */
  public final static var NO_FIELDS
          : Set<AddressOwnerFieldId>
          = {}.freeze()
}
