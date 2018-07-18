package gw.plugin.ccabintegration.impl;

uses com.guidewire.pl.plugin.addressbook.AddressBookRemotableSearchResultSpec
uses soap.abintegration.api.IContactAPI;
uses soap.abintegration.entity.ObjectFilter;
uses soap.abintegration.entity.ABContact;
uses gw.api.util.DisplayableException

class FindPotentialMatchesOperation extends SearchOperationBase
{
  construct(converterFactory : ObjectConverterFactory, api : IContactAPI, searchFilter : ObjectFilter ) {
    super(converterFactory, api, searchFilter);
  }

  public function findPotentialMatches(contact : Contact, remotableSearchResultSpec : AddressBookRemotableSearchResultSpec) : ContactSearchResult {
    var publicId : String = null;
    // If the Contact represents an existing contact, then set up the PublicID for the input ABContact, so that it
    // will be excluded from the potential match search.
    if (contact.getAddressBookUID() != null) {
      publicId = getContactAPI().getPublicIdFromLinkId(contact.getAddressBookUID());
    }
    try {
      var abContact = getCCToABConverter().convert(contact, typeof contact) as ABContact
      abContact.PublicID = publicId
      var abContactSearchResultSpec = convertSearchResultSpec(remotableSearchResultSpec)
      var abContactSearchResult = getContactAPI().findPotentialMatches(abContact, abContactSearchResultSpec)
      return convertSearchResult(abContactSearchResult)
    } catch( e ) {
      throw new DisplayableException("Error finding potential match", e.Cause)
    }
  }
}
