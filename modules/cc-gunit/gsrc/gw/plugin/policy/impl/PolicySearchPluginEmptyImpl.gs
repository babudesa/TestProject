package gw.plugin.policy.impl

uses gw.plugin.policy.search.IPolicySearchAdapter

/**
 * Empty plugin implementation. Can be used in situations where you need an adapter that will not throw
 * errors (as the demo adapter will, if the datamodel has incompatible changes).
 */
@ReadOnly
class PolicySearchPluginEmptyImpl implements IPolicySearchAdapter {

  construct() {
  }

  override function retrievePolicyFromPolicySummary(policySummary : PolicySummary) : PolicyRetrievalResultSet {
    return createEmptPolicyRetrievalResultSet()
  }
  
  override function retrievePolicyFromPolicy( policy : Policy ) : PolicyRetrievalResultSet {
    return createEmptPolicyRetrievalResultSet()
  }
  
  override function searchPolicies(criteria : PolicySearchCriteria) : PolicySearchResultSet {
    var resultSet = new PolicySearchResultSet()
    resultSet.setSummaries({})
    resultSet.ResultsCapped = false
    resultSet.UncappedResultCount = 0
    return resultSet
  }
  
  private function createEmptPolicyRetrievalResultSet() : PolicyRetrievalResultSet {
    var result = new PolicyRetrievalResultSet()
    result.NotUnique = false
    return result
  }
}
