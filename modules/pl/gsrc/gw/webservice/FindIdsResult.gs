package gw.webservice;

/**
 * Deprecated interface. This class was used by the <code>IDataObjectAPI</code> to return
 * object Ids.
 */
@Deprecated("Part of IDataObjectAPI")
class FindIdsResult
{
 /**
 * A string array containing object Ids.
 */
  private var _ids : String[] as Ids
  private var _numResults : int as NumResults

  construct()
  {
  }
  
  construct(fIds : String[]) {
    _ids = fIds;
    _numResults = fIds == null ? 0 : fIds.length
  }
}
