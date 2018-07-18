package gw.plugin.pcintegration.v1

uses gw.api.util.DisplayableException
uses gw.api.soap.GWAuthenticationHandler
uses gw.plugin.InitializablePlugin
uses gw.plugin.pcintegration.v1.PolicySearchConverter
uses gw.plugin.policy.search.IPolicySearchAdapter
uses soap.pcintegrationV1.api.CCPolicySearchIntegrationV1

uses java.util.Calendar
uses java.util.Date
uses java.util.Map
uses java.lang.RuntimeException
uses javax.xml.rpc.ServiceException
uses gw.plugin.pcintegration.v1.mapping.ProductCodeMapper

/**
 * Implementation of the PolicySearchAdapter that calls into PC.
 */
@Export
class PolicySearchPCPlugin implements IPolicySearchAdapter, InitializablePlugin 
{
  static var _pcSearchService : CCPolicySearchIntegrationV1
  
  var _username : String
  var _password : String
  
  construct() 
  {
  }

  /**
   * Retrieves the policy indicated by policySummary from the PC instance.
   */
  override function retrievePolicyFromPolicySummary( policySummary : PolicySummary ) : PolicyRetrievalResultSet 
  {
    if( policySummary.PolicyType != null && !ProductCodeMapper.isSupportedPolicyType( policySummary.PolicyType ) )
    {
      throw new DisplayableException("Unsupported PolicyType: " + policySummary.PolicyType )
    }
    return retrievePolicy( policySummary.PolicyNumber, policySummary.LossDate )
  }
  
  /**
   * Retrieves the policy again from the PC instance.
   */
  override function retrievePolicyFromPolicy( policy : Policy ) : PolicyRetrievalResultSet 
  {
    if( policy.PolicyType != null && !ProductCodeMapper.isSupportedPolicyType( policy.PolicyType ) )
    {
      throw new DisplayableException("Unsupported PolicyType: " + policy.PolicyType )
    }
    return retrievePolicy( policy.PolicyNumber, policy.Claim.LossDate )
  }
  
  /**
   * Search for policies on the PC instance given the search criteria.
   */
  override function searchPolicies( criteria : PolicySearchCriteria ) : PolicySearchResultSet 
  {
    if( criteria.PolicyType != null && !ProductCodeMapper.isSupportedPolicyType( criteria.PolicyType ) )
    {
      throw new DisplayableException("Unsupported PolicyType: " + criteria.PolicyType )
    }
    var pcCriteria = PolicySearchConverter.INSTANCE.createPCSearchCriteria( criteria )
    var pcSummaries = getPolicySearchService().searchForPolicies( pcCriteria )
    var ccSummaries = PolicySearchConverter.INSTANCE.convertPCPolicySummary( pcSummaries )

    var resultSet = new PolicySearchResultSet()
    resultSet.Summaries = ccSummaries
    return resultSet
  }
  
  /**
   * Called on initialization to set paramters from the plugin definition.  Part of the
   * InitializablePlugin interface.
   */
  override function setParameters( params : Map )
  {
    _username = params.get( "username" ) as String
    _password = params.get( "password" ) as String    
  }

  // lazily initializes the policy search service
  private function getPolicySearchService() : CCPolicySearchIntegrationV1
  {
    if( _pcSearchService == null ) 
    {
      try 
      {
        _pcSearchService = new CCPolicySearchIntegrationV1()
        _pcSearchService.addHandler( new GWAuthenticationHandler( _username, _password ) )
      } 
      catch( e ) 
      {
        throw new RuntimeException( e.getCause() as ServiceException )
      }
    }
    return _pcSearchService
  }

  /**
   * retrieves the policy indicated by the policyNumber and lossDate
   */
  private function retrievePolicy( policyNumber : String, lossDate: Date ) : PolicyRetrievalResultSet
  {
    var resultSet = new PolicyRetrievalResultSet()
    if (lossDate == null) {
      throw new DisplayableException(displaykey.Java.PolicyItemHandler.LossDateRequired)
    }

    var cal = Calendar.getInstance()
    cal.setTime( lossDate )
    
    try 
    {
      var pcPolicy = getPolicySearchService().retrievePolicy( policyNumber, cal )
      resultSet.Result = PolicySearchConverter.INSTANCE.convertPCPolicy( pcPolicy )
    }
    catch( e ) 
    {
      throw new DisplayableException( "Error retrieving policy.", e.Cause )
    }
    
    resultSet.NotUnique = false
    return resultSet
  }
}
