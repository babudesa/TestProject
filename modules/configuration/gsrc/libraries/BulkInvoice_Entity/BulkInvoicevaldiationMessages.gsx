package libraries.BulkInvoice_Entity

enhancement BulkInvoicevaldiationMessages : entity.BulkInvoice {
  
  function getPayeeValidationMsg() : String {
    var payee = this.Payee
    var msg : String = ""
    var isValidVendor = false
    var vendorType = this.Payee.Subtype
  

    //CHECK IF THE VENDOR IS A VALID VENDOR
    if(typeof payee == PersonVendor){
      isValidVendor = true
      if((payee as PersonVendor).PayableExt==false){
        msg = msg + "The vendor you have chosen is not payable.\n"
      }
    } else if (typeof payee == CompanyVendor){
      isValidVendor = true
      if((payee as CompanyVendor).PayableExt==false){
        msg = msg + "The vendor you have chosen is not payable.\n"
      }
    }
  
    //CHECK IF THE VENDOR SELECTED IS LINKED AND SYNCED, AND IF IT IS, IN FACT, A VENDOR
    if(isValidVendor){
      if(payee.generateLinkStatus().Linked and !payee.generateLinkStatus().Synced){
        msg = msg + "The payee you have chosen is out of sync.\n"
      }
    }
    
    if(isForeignVendorSubtype(payee)) {
      msg = msg + "The payee you have chosen is a Foreign Vendor. You cannot pay a Foreign Vendor\n"
    }
  
    //CHECK IF THE VENDOR HAS A STATUS OF BACKUP WITHHOLDING OR TAX LEVY
    if(payee.Ex_TaxStatusCode == TaxStatusCode.TC_B || payee.Ex_TaxStatusCode == TaxStatusCode.TC_T){
      msg = msg + "You cannot use Bulk Invoice to pay a vendor that has a Tax Levy or Backup Withholding.\n"
    }
    
    //CHECK IF THE VENDOR IS CLOSED
    if(payee.CloseDateExt != null){
     msg = msg + "This Vendor is closed. Select a valid Vendor.\n"
    }
  
    return msg=="" ? null : msg
  }
  
  
  public function isForeignVendorSubtype(payee : Contact) : boolean {
    var isForeign = false
      
    switch(typeof(payee)){
      case FrgnAutoRepairShopExt:
        isForeign = true
        break
      case Ex_ForeignCoVendor:
        isForeign = true
        break
      case Ex_ForeignCoVenLawFrm:
        isForeign = true
        break
      case Ex_ForeignCoVenMedOrg:
        isForeign = true
        break
      case Ex_ForeignPerVndrAttny:
        isForeign = true
        break
      case Ex_ForeignPerVndrDoc:
        isForeign = true
        break
      case Ex_ForeignPersonVndr:
        isForeign = true
        break
      default:
        isForeign = false
    }
     
    return isForeign
  }
   
  
}// End Enhancement



