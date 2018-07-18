package gaic.webservice
uses java.lang.Exception
uses java.lang.Integer
@WebService
class BulkClaimValidationValidatorsAPI {
  construct() {

  }

function populateValidationErrors(loadcommandID: String) {
  gw.api.util.Logger.logInfo("BulkClaim validation- claim validation implementation Starts" )
  var loadCmdId = Integer.parseInt(loadcommandID)
  var claims  =gw.api.database.Query.make(Claim).compare("Loadcommandid", Equals, loadCmdId)
  .compare("ValidationLevel",NotEquals,typekey.ValidationLevel.TC_PAYMENT)
  
  .select()
   for(claim in claims) { 
     try{      
        gw.api.util.Logger.logInfo("************************* Validation Reports for Claim "+ claim.ClaimNumber + " ****************")
        var validationResult=claim.validate( true); 
    
           for(yy in  validationResult.EntityValidations) {
                 for(tt in yy.ValidationIssues) {

                   gw.api.util.Logger.logInfo("validation  reason           ==" + tt.Reason)
                   gw.api.util.Logger.logInfo("validation  Level            ==" + tt.Level.Description)
                   gw.api.util.Logger.logInfo("validation entityvalidation  =="+tt.EntityValidation.EntityId.RootType.DisplayName)
                   gw.api.util.Logger.logInfo("validation relatedbeanid     =="+tt.RelatedBeanID.Type.DisplayName)
                   
                   print("validation  reason           ==" + tt.Reason)
                   print("validation  Level            ==" + tt.Level.Description)
                   print("validation entityvalidation  =="+tt.EntityValidation.EntityId.RootType.DisplayName)
                   print("validation relatedbeanid     =="+tt.RelatedBeanID.Type.DisplayName)

                }
  
           }
     }catch(e:Exception){
       print("Error in  Populate error messages :: " + e.Message)
     }
     finally
     {
       loadCmdId = null
       claims = null
     }
       
     }
       gw.api.util.Logger.logInfo("BulkClaim validation- claim validation implementation Ends" )
    }
}
