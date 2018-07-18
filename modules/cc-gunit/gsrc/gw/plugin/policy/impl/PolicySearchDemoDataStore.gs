package gw.plugin.policy.impl
uses java.util.Date
uses gw.transaction.Bundle

class PolicySearchDemoDataStore {
  
  private var _policies : Policy[] = null

  construct() {
    generatePolicies()
  }
  
  public function getPolicy( policyNumber : String, lossDate : Date ) : Policy {
    var results = _policies.where( \p -> p.PolicyNumber == policyNumber and (lossDate == null or p.EffectiveDate <= lossDate and p.ExpirationDate >= lossDate ))
    if( results.length > 1 ) {
      throw new PolicyNotUniqueException( "The policy store was not able to find a unique policy for policy number " + policyNumber + " and date " + lossDate + ".  Expected 1, found " + results.length )
    }
    if( results.length == 0 ) {
      return null
    }
    return results[0]
  }
  
  public function findPolicies( criteria : PolicySearchCriteria ) : Policy[] {
    var foundPolicies = _policies.where( \p -> policyMatchesCriteria( p, criteria ) )
    return foundPolicies
  }
  
  // ignores some criteria fields, including VIN, PropertyAddress, InsuredAddress fields that are NOT City
  // or State or Country or PostalCode
  private function policyMatchesCriteria( policy : Policy, criteria : PolicySearchCriteria ) : boolean {
    var lossDateMatches = criteria.LossDate == null or ( policy.EffectiveDate <= criteria.LossDate and policy.ExpirationDate >= criteria.LossDate )
    var isMatch = lossDateMatches and
                  ( criteria.PolicyType == null or criteria.PolicyType == policy.PolicyType ) and
                  ( criteria.LossType == null or criteria.LossType == policy.LossType ) and
                  ( !criteria.PolicyNumber.HasContent or ( policy.PolicyNumber != null and policy.PolicyNumber.startsWith( criteria.PolicyNumber ) ) )
    if( isMatch ) {
      // lossdate, policytype, and policynumber fields passed, now check insured if necessary
      var insured = policy.insured
      if( criteria.CompanyName.HasContent ) {
        isMatch = (insured != null) and
                  (insured typeis Company) and
                  compareString( criteria.CompanyName, (insured as Company).Name )
      }
      if( criteria.LastName.HasContent ) {
        isMatch = isMatch and
                  insured != null and
                  (insured typeis Person) and
                  compareString( criteria.LastName, (insured as Person).LastName )
      }
      if( criteria.FirstName.HasContent ) {
        isMatch = isMatch and
                  insured != null and
                  (insured typeis Person) and
                  compareString( criteria.FirstName, (insured as Person).FirstName )
      }
      if( isMatch and criteria.TaxIdString.HasContent ) {
        isMatch = insured != null and criteria.TaxIdString == insured.TaxID
      }
      
      if( isMatch and addressHasSearchableData( criteria.InsuredAddress ) ) {
        if( insured != null ) {
          var addressMatches = false
          for( var insuredAddress in insured.AllAddresses ) {
            addressMatches = addressMatches or compareAddresses( criteria.InsuredAddress, insuredAddress ) 
          }
          isMatch = addressMatches
        } else {
          isMatch = false
        }
      }
    }
    return isMatch
  }
  
  private function addressHasSearchableData( address : Address ) : boolean {
    return address != null and
           (address.City.HasContent or
            address.PostalCode.HasContent or
            address.State != null or
            address.Country != null)
  }
  
  private function compareAddresses( pattern : Address , targetAddress : Address ) : boolean {
    if( pattern == null ) {
      return true
    }
    if( targetAddress == null ) {
      return false
    }
    return compareString( pattern.City, targetAddress.City ) and
           ( pattern.State == null or pattern.State == targetAddress.State ) and
           compareString( pattern.PostalCode, targetAddress.PostalCode ) and
           ( pattern.Country == null or pattern.Country == targetAddress.Country )
  }
  
  private function compareString( enteredValue : String, storedValue : String) : boolean {
    if( !enteredValue.HasContent ) {
      return true  // no search term was entered
    }
    if( storedValue == null ) {
      return false
    }
    return storedValue.toLowerCase().startsWith( enteredValue.toLowerCase() )
  }
  
  protected function generatePolicies()  {
    var generator = new PolicySearchPolicyGenerator()
    var policyArray = generator.generatePolicies() as List<Policy>
    policyArray.addAll(getExtraPolicies(policyArray[0].Bundle) as List<Policy>)
    _policies = policyArray as Policy[]
  }
  
  // for subclasses to extend the set of policies available
  protected function getExtraPolicies(bundle : Bundle) : Policy[] {
    return {}
  }
}
