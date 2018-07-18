package gw.webservice.cc.financials.bulkpay
uses java.util.Date
uses gw.api.database.*

@WebService()
class IBulkInvoiceAPIExt {
  
  construct() {

  }
  
  /**
   * Takes in the publicID of a bulk invoice then finds the publicIDs of all checks related to that
   * invoice. The check publicIDs are then used to load the check and update the specified field
   * with the specified value.
   */
  function updateChecks(bulkInvoicePublicID : String, fieldName : String, value : Date){

    var pubIDs = Query.make(Check)
         .join("BulkInvoiceItemInfo")
         .join("BulkInvoiceItem")
         .join("BulkInvoice")
         .compare("PublicID", Relop.Equals, bulkInvoicePublicID)
         .select(\ row -> { 
           return row.PublicID //optimization to only return the publicID so we don't have a bunch of checks in memory
         })
         .toList()
    
    //unable to use the .getCurrent() bundle due to permission issues with batchsu, so create a new one
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
      for(pubID in pubIDs){
        var check = Check(pubID)
        //print("updating check " + check.PublicID)
        bundle.add(check)
        check.setFieldValue(fieldName, value)
      }
    }, "su")
  }
  
}
