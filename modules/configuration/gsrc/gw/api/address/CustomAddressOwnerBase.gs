package gw.api.address
uses gw.entity.IEntityPropertyInfo
uses java.util.*

/*
  Created primarliy to override RequiredFields in CCAddressOwnerBase, which is read-only, and to ensure that sub-classes
  cannot override this property.
*/
abstract class CustomAddressOwnerBase extends CCAddressOwnerBase{

  construct(prop : IEntityPropertyInfo) {
    super(prop)
  }

  override property get RequiredFields() : Set<AddressOwnerFieldId> {
    switch(InputSetMode){
      case "US":
        return CCAddressOwnerFieldId.US_REQUIREDFIELDS
      case "CA":
        return CCAddressOwnerFieldId.CA_REQUIREDFIELDS
      default:
        return CCAddressOwnerFieldId.DEFAULT_REQUIREDFIELDS
    }
  }
}
