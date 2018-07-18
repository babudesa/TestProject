package gw.api.address
uses java.util.*

class BulkInvoiceMailToAddressOwner extends BulkInvoiceRelatedAddressOwner {

  private static final var associatedProperty : String = "MailToAddressExt"

  private var _nonEditableAddresses = gw.util.concurrent.LazyVar.make(\ -> findNonEditableAddresses())
  private var isSameAsPayTo : boolean = false
  
  construct(associatedBulkInvoice : BulkInvoice, isMailToSameAsPayTo : boolean) {
    super(getAddressProperty(entity.BulkInvoice, associatedProperty), associatedBulkInvoice)
    
    if(isMailToSameAsPayTo != null){
      isSameAsPayTo = isMailToSameAsPayTo
    }
  }
  
  property get GetIsMailToSameAsPayTo() : boolean {
    return isSameAsPayTo 
  }

  override property get Addresses() : Address[] {
    //Mail to addresses are the same as Pay to addresses for Bulk Invoice
    return (Owner as BulkInvoice).ex_MailTo.AllAddresses
  }

  override property get NonEditableAddresses() : Set<Address> {
    return _nonEditableAddresses.get()
  }
  
  override function getOrCreateNewAddress() : Address{
    var result = super.getOrCreateNewAddress()
    return result
  }
  
  private function findNonEditableAddresses() : Set<Address> {
        
    var result : Set<Address>
    if((Owner as BulkInvoice).ex_MailTo.AllAddresses != null){
      result = (Owner as BulkInvoice).ex_MailTo.AllAddresses.toSet()
    }

   return result != null ? result : Collections.emptySet<Address>()
  }
}
