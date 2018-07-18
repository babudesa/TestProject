package libraries.BulkInvoice_Entity

enhancement FilterBulkInvoiceList : entity.BulkInvoice {
  function filterBulkInvoices(typeFilter : String, statusFilter : String) : boolean {
    var typeShow:boolean = false
    var statusShow:boolean = false
    var showInvoice:boolean = false
  
    if(typeFilter=="All"){
      typeShow = true
    } else if(typeFilter==this.BulkInvoiceTypeExt.Code){
      typeShow = true
    }
  
    if(statusFilter=="All"){
      statusShow = true
    } else if(statusFilter==this.Status.Code){
      statusShow = true
    }
  
    if(typeShow==true and statusShow==true){
      showInvoice=true
    }
  
    return showInvoice
  }
}
