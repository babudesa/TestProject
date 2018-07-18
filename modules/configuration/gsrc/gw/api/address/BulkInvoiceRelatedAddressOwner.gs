package gw.api.address
uses gw.entity.IEntityPropertyInfo
uses java.util.*

abstract class BulkInvoiceRelatedAddressOwner extends CCAddressOwnerBase {
  
  private var _bulkInvoice : BulkInvoice
  
  construct(prop : IEntityPropertyInfo, associatedBulkInvoice : BulkInvoice) {
    super(prop)
    _bulkInvoice = associatedBulkInvoice
  }
  
  override property get Owner() : KeyableBean {
    return _bulkInvoice
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
  
  override property get HiddenFields() : Set<AddressOwnerFieldId> {
    var fieldsToHide : Set<AddressOwnerFieldId> = new HashSet<AddressOwnerFieldId>()
    
    fieldsToHide.add(CCAddressOwnerFieldId.COUNTY)
    fieldsToHide.add(CCAddressOwnerFieldId.LATITUDE)
    fieldsToHide.add(CCAddressOwnerFieldId.LONGTITUDE)
    
    if(this.Address == null or this.Address.DisplayName.length > 0){
      fieldsToHide.add(CCAddressOwnerFieldId.ADDRESSTYPE)  
    }
    
    return fieldsToHide
  }
  
  override property get SelectedCountry() : Country {
    return (this.CoreAddress.Country != null) ? this.CoreAddress.Country : null
  }
  
  property get UnavailableFields() : Set<AddressOwnerFieldId> {
       
    if(Address == null or isAddressInAddresses()){
      return {CCAddressOwnerFieldId.COUNTRY, CCAddressOwnerFieldId.ADDRESSTYPE,
         CCAddressOwnerFieldId.ADDRESSLINE1, CCAddressOwnerFieldId.ADDRESSLINE2,
         CCAddressOwnerFieldId.CITY, CCAddressOwnerFieldId.STATE, CCAddressOwnerFieldId.POSTALCODE}
    }
      return Collections.emptySet<AddressOwnerFieldId>()
  }
  
  function isAddressInAddresses() : boolean {
    for(addy in this.Addresses){
      if(addy == this.Address and !addy.New){
        return true
      }
    }
    return false
  }

}
