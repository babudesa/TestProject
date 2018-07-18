package pcf_gs.bulkinvoice
uses com.guidewire.pl.system.filters.BeanBasedQueryFilter

class BulkInvoiceStatusFilter implements BeanBasedQueryFilter{
  
  private var _status : BulkInvoiceStatusFilters
  
  construct(status : BulkInvoiceStatusFilters) {
    _status = status
  }

  override function applyFilter(bulkInvoice : Object) : boolean {
    if(bulkInvoice typeis BulkInvoice){
      return _status.TypeCodeList.contains(bulkInvoice.Status)
    }else{
      return false 
    }
  }

}
