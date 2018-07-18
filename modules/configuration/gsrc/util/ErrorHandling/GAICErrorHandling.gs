package util.ErrorHandling;

class GAICErrorHandling
{
  construct()
  {
  }
  public static function logError(obj:Object, ruleNumber:String, e:java.lang.Throwable, otherInfo:String){
    try{
      //use the template to create the error report
      var environment = java.lang.System.getProperty("gw.cc.env");
      var body : String = templates.email.GAICErrorCapture.renderToString(obj, ruleNumber, e, otherInfo)
      if(otherInfo == null){ 
        otherInfo = "" 
      }
            
      //E-mail the error log 
      if(environment != "prod"){
        if(ScriptParameters.EmailConfigStackTraces=="true"){
          util.Email.sendMail( ScriptParameters.ClaimCenterDevEmail, "Error Log", body )
        }
        else{
          gw.api.util.Logger.logError(getStackTrace(e))
        }
      }
      else if(environment == "prod"){
        if(ScriptParameters.EmailConfigStackTraces=="true"){
          util.Email.sendMail( ScriptParameters.ClaimCenterProdEmail, "Error Log", body )
        }
        else{
          gw.api.util.Logger.logError(getStackTrace(e))
        }
      }
      
      
    }
    catch(err){  //catch if the error handling routine breaks, and log it as a failsafe 
      var errorReason:String = "GAIC config error handling routine has failed, reason: \n"
      errorReason = getStackTrace(err)
      errorReason = errorReason + "\n\n--------------------------\n";
      errorReason = errorReason + "Original error: \n"
      errorReason = errorReason + getStackTrace(e)
      gw.api.util.Logger.logError( errorReason )  //log the reason error handling failed, and the original failure.
    }
    finally{
      if(ScriptParameters.EmailConfigStackTraces=="true"){
        var emailAddy = (java.lang.System.getProperty("gw.cc.env") == "prod" ? ScriptParameters.ClaimCenterProdEmail : ScriptParameters.ClaimCenterDevEmail)
        gw.api.util.Logger.logError( "The following error occurred: " + e.getCause() + " an e-mail has been sent to " + emailAddy + " additional information" )
        throw new gw.api.util.DisplayableException("An error has occurred, an e-mail has been sent to " + emailAddy)
      }
      else{
        throw new gw.api.util.DisplayableException("An error has occurred, details can be found in the server log")
      }
    }
    
  }
  public static function getClaimNumber(obj : Object) : String{
      var objType=obj;
      var theClaim : String;
      if(objType == Claim.Type.TypeInfo){
        theClaim = (obj as Claim).ClaimNumber
      }
      else if(objType == Exposure.Type.TypeInfo){
        theClaim = (obj as Exposure).Claim.ClaimNumber
      }
      else if(objType == TransactionSet.Type.TypeInfo){
        theClaim = (obj as TransactionSet).Claim.ClaimNumber
      }
      else if(objType == Activity.Type.TypeInfo){
        theClaim = (obj as Activity).Claim.ClaimNumber
      }
      else if(objType == Matter.Type.TypeInfo){
        theClaim = (obj as Matter).Claim.ClaimNumber
      }
      else if(objType == Policy.Type.TypeInfo){
        theClaim = (obj as Policy).Claim.ClaimNumber
      }
      else if(objType == Check.Type.TypeInfo){
        theClaim = (obj as Check).Claim.ClaimNumber
      }
      else{
        theClaim = "No Claim Number"
      }
      return theClaim;
   }
   private static function getStackTrace( e : java.lang.Throwable ) : String{
     var err = e.Message + "\n"
     for(val in e.StackTrace){
       err = err + val + "\n"; 
     }
     return err
  }
}
