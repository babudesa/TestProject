package pcf_gs.bulkinvoice

/**
 * Custom helper that to extend GW functionality
 */
class BulkPayHelper extends gw.api.financials.BulkPayHelper{
  
  construct() {

  }
  
  function getFilteredInvoices(typeFilter : BulkInvoiceTypeFilters, statusFilter : BulkInvoiceStatusFilters) : List<BulkInvoice>{
    return this.AllBulkInvoices.toList().where(\ invoice -> 
      invoice typeis BulkInvoice && 
      typeFilter.TypeCodeList.contains(invoice.BulkInvoiceTypeExt) &&
      statusFilter.TypeCodeList.contains(invoice.Status)) as List<BulkInvoice>
  }

}
