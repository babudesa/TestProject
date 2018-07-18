package gw.api.address
uses java.util.*

class BulkInvoicePayToAddressOwner extends BulkInvoiceRelatedAddressOwner{

  private static final var associatedProperty : String = "PayToAddressExt"

  private var _nonEditableAddresses = gw.util.concurrent.LazyVar.make(\ -> findNonEditableAddresses())
  
  construct(associatedBulkInvoice : BulkInvoice) {
    super(getAddressProperty(entity.BulkInvoice, associatedProperty), associatedBulkInvoice)
  }

  override property get Addresses() : Address[] {
    return (Owner as BulkInvoice).Payee.AllAddresses
  }


  override property get NonEditableAddresses() : Set<Address> {
    return _nonEditableAddresses.get()
    //return Collections.emptySet<Address>()
  }

  override function getOrCreateNewAddress() : Address{
    var result = super.getOrCreateNewAddress()
    return result
  }

  private function findNonEditableAddresses() : Set<Address> {
    
    var result : Set<Address>
    if((Owner as BulkInvoice).Payee.AllAddresses != null){
      result = (Owner as BulkInvoice).Payee.AllAddresses.toSet()
   
      for(addy in result){
        if(addy.DisplayName.length == 0){
          result.remove(addy)
        }
      }     
   }
   
   return result != null ? result : Collections.emptySet<Address>()
  }
}
