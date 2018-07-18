package util.gaic.EDWPayloadGen
uses entity.Claim
uses java.lang.String
uses util.gaic.EDWPayloadGen.ClaimThreadExecutor
uses java.util.concurrent.Callable
uses java.lang.Exception

//Callable to be called by Future for the EDWPayloadGenClaimsConversion
class ClaimCallable implements Callable<ClaimThreadExecutor> 
{
  var claim: Claim
  var SchemaURL :String
  var claimThread : ClaimThreadExecutor = null
  
  /**
  * Constructor with Claim and Schema URL for validating the XML
  */ 
  construct(clm: Claim,scmUrl:String ) 
  {
    this.claim = clm
    this.SchemaURL= scmUrl
  }

  /**
  * Callable function to be called
  */
  override function call() : ClaimThreadExecutor  
  {
    try 
    {
      claimThread= new ClaimThreadExecutor(claim , SchemaURL)             
      claimThread.run()
    } 
    catch (e:Exception ) 
    {
      throw e
    }
    return claimThread
  }
}
