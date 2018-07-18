package gw.webservice;

@Deprecated("Part of IDataObjectAPI")
class SetPathValuesResult
{
  var _newObjects : SetPathValuesIDRef[] as NewObjects
  construct()
  {
  }
  
  construct(pNewObjects : SetPathValuesIDRef[]) {
    _newObjects = pNewObjects
  }
}
