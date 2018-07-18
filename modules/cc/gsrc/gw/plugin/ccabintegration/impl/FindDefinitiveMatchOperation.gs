package gw.plugin.ccabintegration.impl;

uses gw.api.util.DisplayableException
uses soap.abintegration.api.IContactAPI;
uses soap.abintegration.enums.ABContactFindMatchResultType;

class FindDefinitiveMatchOperation extends AddressBookOperation {
  construct(converterFactory : ObjectConverterFactory, api : IContactAPI) {
    super( converterFactory, api )
  }

  function findDefinitiveMatch(contact : Contact) : ContactFindMatchResult {
    var contactFindMatchResult = new ContactFindMatchResult()
    try {
      var abContact = getCCToABConverter().convert(contact, typeof contact) as soap.abintegration.entity.ABContact
      var abContactFindMatchResult = getContactAPI().findDefinitiveMatch(abContact)
      var match = abContactFindMatchResult.getABContact()
      var abToCCConverter = getABToCCConverter()
      
      contactFindMatchResult.Contact = match == null ? null : abToCCConverter.convert(match, typeof match) as Contact
      
      if (ABContactFindMatchResultType.GW_IMPLAUSIBLE_MATCH.equals(abContactFindMatchResult.getResultType())) {
        contactFindMatchResult.ResultType = ContactMatchResultType.TC_IMPLAUSIBLE_MATCH
      } else if (ABContactFindMatchResultType.GW_INCOMPATIBLE_TYPE_MATCH.equals(abContactFindMatchResult.getResultType())) {
        contactFindMatchResult.ResultType = ContactMatchResultType.TC_INCOMPATIBLE_TYPE
      } else if (ABContactFindMatchResultType.GW_NO_MATCH.equals(abContactFindMatchResult.getResultType())) {
        contactFindMatchResult.ResultType = ContactMatchResultType.TC_NO_MATCH
      } else if (ABContactFindMatchResultType.GW_PLAUSIBLE_MATCH.equals(abContactFindMatchResult.getResultType())) {
        contactFindMatchResult.ResultType = ContactMatchResultType.TC_PLAUSIBLE_MATCH
      } else {
        throw new DisplayableException("Unexpected result type: " + abContactFindMatchResult.getResultType());
      }
    } catch (e) {
      throw new DisplayableException("Error finding definitive match: " +  e.LocalizedMessage, e.Cause)
    }
    return contactFindMatchResult
  }
}
