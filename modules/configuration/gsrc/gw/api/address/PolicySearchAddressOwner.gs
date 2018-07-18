package gw.api.address
uses java.util.Set

@Export 
class PolicySearchAddressOwner extends SearchAddressOwnerBase {

      private var _policySearchCriteria : PolicySearchCriteria
  
      construct(policySearchCriteria : PolicySearchCriteria) {
                _policySearchCriteria = policySearchCriteria
      }

      override property get Address() : Address {
               return _policySearchCriteria.InsuredAddress
      }
      
      /* Bug Fix 6.0_Testing_FeatureActions [32]:   Set of fields needs to hide while Selecting Policy in Policy->PolicySelect General Page to maintain CC 4.0.9 UI Page */
      property get PolicySearchHiddenFields() : Set<AddressOwnerFieldId> {
               return CCAddressOwnerFieldId.CA_POLICYSEARCH_HIDDENFIELDS
      }
      
      override property  get HiddenFields() : Set<AddressOwnerFieldId> {
        var hideThese : Set<AddressOwnerFieldId> = super.HiddenFields
        return hideThese.concat(this.PolicySearchHiddenFields).toSet()
      }
      
      /* Bug Fix 6.0_Testing_FeatureActions [33]:   Address Standardization Button Is Hidden as like in  CC 4.0.9 UI Page */          
      function isStandardizationNeeded() : Boolean {    
             return false
      } 
}
