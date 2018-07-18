package gw.webservice.cc.pcintegration.v1.pcentities
uses java.util.Calendar

@Export
class PCClaimSearchCriteria
{
  var _policyNumbers : String[] as PolicyNumbers
  var _beginDate : Calendar as BeginDate
  var _endDate : Calendar as EndDate
  var _lob : String as Lob
  
  // null matches claims in any state; use "open", "draft", "closed", "archived" to match claims in a specific state.
  var _status : String as Status

  
  construct()
  {
  }
  
}
