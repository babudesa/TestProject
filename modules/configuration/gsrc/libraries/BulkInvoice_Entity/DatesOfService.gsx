package libraries.BulkInvoice_Entity

enhancement DatesOfService : entity.BulkInvoice {
  function getDatesOfService() : String {
    var datesString:String
    var format : java.text.SimpleDateFormat = new java.text.SimpleDateFormat("M/d/yyyy")
    var ServiceDateStart : String = (this.DateOfServiceFromExt!=null?format.format(this.DateOfServiceFromExt):null)
    var ServiceDateEnd : String = (this.DateOfServiceToExt!=null?format.format(this.DateOfServiceToExt):null)

    if(ServiceDateStart!=null){
      if(ServiceDateEnd!=null){
        datesString = ServiceDateStart + " to " + ServiceDateEnd
      } else {
        datesString = ServiceDateStart
      }
    } else {
      datesString = "No dates of service provided"
    }
  
    return datesString
  }
}
