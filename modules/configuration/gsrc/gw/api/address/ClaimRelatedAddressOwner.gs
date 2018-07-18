package gw.api.address
uses java.util.Set
uses gw.entity.IEntityPropertyInfo
uses gw.util.concurrent.LazyVar
uses java.util.HashSet

/**
 * Superclass for claim related address owner objects, which will typically
 * display a drop down of the claim's related addresses.
 * <ul>
 * <li>The list of addresses to display comes from the claim's Addresses property
 * <li>The set of non editable addresses is determined by calling
 *     claim.canEditAddress on each address in the list of addresses
 * <li>The default implementation of the Claim property returns null. This
 *     property should only be non null when actually setting the claim's
 *     loss location
 * </ul>
 */
@Export
abstract class ClaimRelatedAddressOwner extends CCAddressOwnerBase {
  
  private var _claim : Claim as readonly RelatedClaim
  private var _nonEditableAddresses = LazyVar.make(\ -> findNonEditableAddresses())

  construct(prop : IEntityPropertyInfo, inClaim : Claim) {
    super(prop)
    _claim = inClaim
  }

  override property get RequiredFields() : Set<AddressOwnerFieldId> {
    return AddressFields.getClaimFileRequiredFields(_claim)
  }

  override property get HiddenFields() : Set<AddressOwnerFieldId> {
    return AddressFields.getClaimFileHiddenFields(_claim)
  }

  override property get Addresses() : Address[] {
    return addOriginalValue(_claim.getLossLocationAddresses())
  }
  
  override property get NonEditableAddresses() : Set<Address> {
    return _nonEditableAddresses.get();
  }

  override property get DefaultCountry() : Country {
     return (_claim.Policy.insured.PrimaryAddress.Country != null)
             ? _claim.Policy.insured.PrimaryAddress.Country
             : super.DefaultCountry
  }

  override property get ShowAddressSummary() : boolean {
    return false
  }
  
  /*
    If the policy is verified or the address is not new, then 
    return the addresses common to the policy array and the address owner array.
  */
  private function findNonEditableAddresses() : Set<Address> {
    var result = (_claim.Policy.Verified or !Address.New)
            ? _claim.Policy.Addresses.toSet().intersect(Addresses.toSet())
            : new HashSet<Address>()
    result.add(null)
    return result
  }
}
