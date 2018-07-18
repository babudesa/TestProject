package libraries.Check_Entity

enhancement BulkInvoiceVisability : entity.Check {
  function checkDates(bulkDate : java.util.Date, checkDate : java.util.Date) : boolean {
    if(this.Bulked)
      if(bulkDate!=null)
        return true
      else
        return false
    else
      if(checkDate!=null)
        return true
      else
        return false  
  }
}
