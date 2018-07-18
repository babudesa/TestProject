package gw.webservice;

@Deprecated("Part of IDataObjectAPI")
class SetPathValuesIDRef 
{
  var _refID : String as RefID
  var _publicID : String as PublicID
  construct()
  {
  }
  
  construct(pRefId : String, pPublicId : String) {
    _refID = pRefId
    _publicID = pPublicId
  }
  
}
