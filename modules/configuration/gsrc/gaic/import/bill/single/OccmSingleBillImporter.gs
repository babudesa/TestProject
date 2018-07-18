package gaic.import.bill.single
uses entity.BillImportRecordExt
uses java.lang.String
uses typekey.CheckCategoryExt
uses gaic.import.bill.single.SingleBillImporter

class OccmSingleBillImporter extends SingleBillImporter{
  
  private static final var OCCM_MCO_ROLE = "OneCallMCORole"
  private static final var OCCM_DOC_ROLE = "OneCallDocRole"
  
  construct(bill : BillImportRecordExt) {
    super(bill)
  }

  override property get VendorMCONamespace() : String {
    return OCCM_MCO_ROLE
  }

  override property get VendorDocNamespace() : String {
    return OCCM_DOC_ROLE
  }
  
  override property get CheckCategory() : CheckCategoryExt {
    return CheckCategoryExt.TC_OCCM 
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
