package pcf_gs.bulkinvoice
uses com.guidewire.pl.system.filters.BeanBasedQueryFilter

class BulkInvoiceTypeFilter implements BeanBasedQueryFilter {
  
  private var _typeFilter : BulkInvoiceTypeFilters
  
  construct(typeFilter : BulkInvoiceTypeFilters) {
    _typeFilter = typeFilter
  }

  override function applyFilter(bulkInvoice : Object) : boolean {
    if(bulkInvoice typeis BulkInvoice){
      return _typeFilter.TypeCodeList.contains(bulkInvoice.BulkInvoiceTypeExt)
    }else{
      return false 
    }
  }

}
