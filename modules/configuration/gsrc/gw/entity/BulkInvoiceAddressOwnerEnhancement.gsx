package gw.entity
uses gw.api.address.CCAddressOwner
uses gw.api.address.BulkInvoicePayToAddressOwner
uses gw.api.address.BulkInvoiceMailToAddressOwner

enhancement BulkInvoiceAddressOwnerEnhancement : entity.BulkInvoice {
  
  property get PayToAddressOwner() : CCAddressOwner { 
    return new BulkInvoicePayToAddressOwner(this)
  }
  
  /* 
  property get MailToAddressOwner() : CCAddressOwner { 
    return new BulkInvoiceMailToAddressOwner(this, )
  }
  */
  
  property get MailToSameAsPayTo() : boolean {
  if(this.MailToAddressExt != null and this.PayToAddressExt != null){
    if(this.MailToAddressExt.equals(this.PayToAddressExt)){
      return true 
    }
  }
    return false
  }
}
