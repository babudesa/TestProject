package gaic.webservice.cc
uses gw.api.webservice.exception.SOAPException
uses gw.api.database.Query

@WebService
class ProfitCenterGroupingAPI {

  construct() {}
  
  @Throws(SOAPException, "The provided name is null or more than one ProfitCenterGroupings with that Name exist")
  public function getProfitCentersByGroupingName(profitCenterGroupingName : String) : String[]{
    if(profitCenterGroupingName == null){
      throw new SOAPException("The provided ProfitCenterGrouping Name is null.") 
    }
    
    var groupings = Query.make(ProfitCenterGroupingExt).compare("Name", Equals, profitCenterGroupingName).select()
    if(groupings.Count > 1){
      throw new SOAPException("Multiple ProfitCenterGroupings found for provided name. Not sure which one to return.")
    }else if(groupings.Count == 1){
      return groupings.FirstResult.ProfitCenterItemExt*.ProfitCenter
    }else{
      //if no groupings at all are found, return an 'empty' String array
      return new String[0]   
    }
  }
}
