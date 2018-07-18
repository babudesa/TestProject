package gaic.import.bill.single
uses typekey.CheckCategoryExt
uses gaic.import.bill.single.SingleBillImporter
uses entity.BillImportRecordExt
uses java.lang.String
uses java.lang.Override

class HcsSingleBillImporter extends SingleBillImporter {
  
  private static final var HCS_MCO_ROLE = "HealthcareMCORole"
  private static final var HCS_DOC_ROLE = "HealthcareDocRole"
  
  construct(bill : BillImportRecordExt) {
    super(bill)
  }

  override property get VendorMCONamespace() : String {
    return HCS_MCO_ROLE
  }

  override property get VendorDocNamespace() : String {
    return HCS_DOC_ROLE
  }
  
  override property get CheckCategory() : CheckCategoryExt {
    return CheckCategoryExt.TC_HCS 
  }  
  //Defect 9378 : select the Fees Address Type for the Mail To address on the bulk invoices 
  Override function getMailToAddress() : Address{  
     var addresses = _payeeContact.Contact.AllAddresses
    
     if(addresses.hasMatch(\ a -> a.AddressType == AddressType.TC_FEES)){
      return addresses.where(\ a -> a.AddressType == AddressType.TC_FEES).first()
    }else if(addresses.hasMatch(\ a -> a.AddressType == AddressType.TC_BILLING)){
      return addresses.where(\ a -> a.AddressType == AddressType.TC_BILLING).first()
    }else if(addresses.hasMatch(\ a -> a.AddressType == AddressType.TC_TAX)){
      return addresses.where(\ a -> a.AddressType == AddressType.TC_TAX).first()
    }else{
      return addresses.where(\ a -> a.AddressType == AddressType.TC_MAILING).maxBy(\ a -> a.UpdateTime)
    }
  }
}
