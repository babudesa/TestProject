package gaic.webservice

@WebService
class RetrieveLoadcommandIDAPI {
  
  public function  retrieveLoadcommandid() :String{
    var loadCmdID=ScriptParameters.EDWNotesConversionLoadCommandID as java.lang.String
    return loadCmdID
  }
}