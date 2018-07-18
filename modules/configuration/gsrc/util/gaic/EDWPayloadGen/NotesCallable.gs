package util.gaic.EDWPayloadGen
uses util.gaic.EDWPayloadGen.NotesExecutor
uses java.lang.String
uses entity.Claim
uses java.util.concurrent.Callable
uses java.lang.Exception

//Callable to be called by Future for the EDWPayloadGenNotesConversion
class NotesCallable implements Callable<NotesExecutor> 
{
  var claim: Claim
  var SchemaURL :String
  var notesThread: NotesExecutor = null;
  
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
  override function call() : NotesExecutor 
  {
    try 
    {
      notesThread = new NotesExecutor(claim , SchemaURL)             
      notesThread.run()
    } 
    catch (e:Exception ) 
    {
      throw e
    }
    return notesThread
  }
}
