package gw.processes
uses gw.transaction.Transaction
uses gw.processes.BatchProcessBase
uses java.lang.Exception

class EscheatableImpl extends BatchProcessBase {

  construct(batchProcessType : BatchProcessBase) {
    this(batchProcessType)
  }
  
  construct() {
    super(BatchProcessType.TC_ESCHEATABLEPROCESS)
    gw.api.util.Logger.logInfo("EscheatbleImpl.gs called")
  }
  
 Override function doWork(): void {
   Transaction.runWithNewBundle(\ bundle -> Escheatable())
 }
 
 private function Escheatable(): void{
   try{
   var bundle=Transaction.getCurrent()
   
   //for regular US/Canadian checks
   var escheatQuery = gw.api.database.Query.make(Check)
   var resultSet = escheatQuery.select()
   // checks in this arraylist should be blocked form processing since thay fail link sync validations
   var unSync : java.util.ArrayList = new java.util.ArrayList();
     for (anEscheat in resultSet) {
        bundle.add(anEscheat)
        
        for(payee in anEscheat.Payees){
          var payeeContact:Contact = payee.Payee
          var linkStatus = payeeContact.generateLinkStatus()
          if((payeeContact typeis PersonVendor or payeeContact typeis CompanyVendor) and 
          linkStatus.Linked and (!linkStatus.Synced or !linkStatus.SyncedRemote)){
            gw.api.util.Logger.logWarning("Claim Number "+ anEscheat.Claim.ClaimNumber +" with Check No " 
                      +anEscheat.CheckNumber+ " with payee " + payee + " has link and sync validation")
                      //added check numbers since this is common in payees and payment
                      //this are the check number having link sync validation need to be skipped
                      //hence added in arraylist to check against those.
                      unSync.add(payee.Check);
               }
          
        }
        for(payment in anEscheat.Payments)
        {
           if(!anEscheat.ManualCheck and anEscheat.TypeOfCheckExt=="us_check" and 
           (anEscheat.EscheatStatusExt=="notapplicable" or anEscheat.EscheatStatusExt==NULL) and 
           !unSync.contains(payment.Check) and anEscheat.LoadCommandID == null){
                  
                  //if disconnected feature log and skip 
                   if (payment.Claim.checkDisconnectedFeatures()){
                      gw.api.util.Logger.logWarning("Claim Number "+ anEscheat.Claim.ClaimNumber +" with Check No " 
                      +anEscheat.CheckNumber+ " has disconnected features")
                      continue
                    }
                    
                    //if validation level is not payment log and skip
                    if (!(payment.Claim.ValidationLevel=="payment"&& payment.Exposure.ValidationLevel=="payment")){
                      gw.api.util.Logger.logWarning("Claim Number "+ anEscheat.Claim.ClaimNumber +" with Check No " 
                      +anEscheat.CheckNumber+ " doesn't have validation level payment")
                      continue
                    }
                  
                     anEscheat.EscheatStatusExt="escheatable"
                     gw.api.util.Logger.logInfo("US Check : "+anEscheat.CheckNumber+ 
                      " has Escheatment status notapplicable now changed to " + anEscheat.EscheatStatusExt)
                 }
           if(!anEscheat.ManualCheck and anEscheat.TypeOfCheckExt=="canadian_check" and 
           (anEscheat.EscheatStatusExt=="escheatable" or anEscheat.EscheatStatusExt==NULL)and 
           !unSync.contains(payment.Check) and anEscheat.LoadCommandID == null){
                   
                   //if disconnected feature log and skip 
                   if (payment.Claim.checkDisconnectedFeatures()){
                      gw.api.util.Logger.logWarning("Claim Number "+ anEscheat.Claim.ClaimNumber +" with Check No " 
                      +anEscheat.CheckNumber+ " has disconnected features")
                      continue
                  }
                  
                  //if validation level is not payment log and skip
                    if (!(payment.Claim.ValidationLevel=="payment"&& payment.Exposure.ValidationLevel=="payment")){
                      gw.api.util.Logger.logWarning("Claim Number "+ anEscheat.Claim.ClaimNumber + " with Check No " 
                      +anEscheat.CheckNumber+ " doesn't have validation level payment")
                      continue
                    }
                   
                       anEscheat.EscheatStatusExt="notapplicable"
                       gw.api.util.Logger.logInfo("Canadian Check : "+anEscheat.CheckNumber+ 
                        " has Escheatment status eschetable now changed to " + anEscheat.EscheatStatusExt)
                 }
       }
   }
   
   //for Bulk Invoices
   //Commented until Guidewire comes with a solution to avoid exception while updating Bulk Invoices.
  var escheatQueryBulk = gw.api.database.Query.make(BulkInvoice)
   var resultSetBulk = escheatQueryBulk.select()
   for (anEscheatBulk in resultSetBulk) {
        bundle.add(anEscheatBulk)
           if(anEscheatBulk.EscheatStatusExt=="notapplicable" or anEscheatBulk.EscheatStatusExt==NULL)
        {
                   gw.api.util.Logger.logInfo("Skipping bulk invoices changes "+anEscheatBulk.CheckNumber)
                   //gw.api.util.Logger.logInfo("Bulkinvoice number : "+anEscheatBulk.CheckNumber+ " has Escheatment status "
                   //+ anEscheatBulk.EscheatStatusExt + " now changed to Escheatable" )
                  // anEscheatBulk.EscheatStatusExt="escheatable"
         }
     }
   }Catch(ex: Exception){
     util.ErrorHandling.GAICErrorHandling.logError(null, "EscheatableImpl.gs", ex, null)
     gw.api.util.Logger.logError(ex.Message)
     gw.api.util.Logger.logError(ex.printStackTrace())
  }
 }
}
