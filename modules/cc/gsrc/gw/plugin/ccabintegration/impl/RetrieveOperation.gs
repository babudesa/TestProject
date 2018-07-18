package gw.plugin.ccabintegration.impl

uses soap.abintegration.api.IContactAPI
uses soap.abintegration.entity.ABContactRetrievalResult
uses java.util.Map
uses soap.abintegration.entity.ABContactRelationshipSpec
uses soap.abintegration.entity.ObjectFilter
uses java.util.HashMap
uses gw.api.util.DisplayableException

uses java.util.HashSet
uses gw.transaction.Bundle

class RetrieveOperation extends AddressBookOperation {
  private var _relatedContactFilter : ObjectFilter

  construct(converterFactory : ObjectConverterFactory, api : IContactAPI, relatedContactFilter : ObjectFilter) {
    super(converterFactory, api)
    _relatedContactFilter = relatedContactFilter
  }

  function retrieveContact(addressBookId : String, contactRelationshipSpec : ContactRelationshipSpec) : Contact {
    var publicId = getContactAPI().getPublicIdFromLinkId(addressBookId)
    if (publicId == null) {
      return null
    }
    var result : Contact
    try {
      var abContactRelSpec = getABContactRelationshipSpec(contactRelationshipSpec)
      var abContactLookupResult = getContactAPI().retrieveContact(publicId, null, abContactRelSpec)
      var abContact = abContactLookupResult.getABContact()
      if (abContact == null) {
        result = null
      } else {
        result = convertABContactLookupResult(abContactLookupResult)
      }
    } catch (e) {
      throw new DisplayableException("Error retrieving contact.", e.Cause)
    }
    return result
  }

  function retrieveRelatedContacts( contact: Contact, contactRelationshipSpec: ContactRelationshipSpec ) : Contact {
    var resultContact : Contact = null
    var publicId = getContactAPI().getPublicIdFromLinkId(contact.AddressBookUID)
    if (publicId == null) {
      return null
    }
    try {
      var abContactRelSpec = getABContactRelationshipSpec(contactRelationshipSpec)
      var abContactLookupResult = getContactAPI().retrieveContact(publicId, _relatedContactFilter, abContactRelSpec)
      resultContact = convertABRelatedContactsLookupResult(contact, abContactLookupResult)
    } catch (e) {
      throw new DisplayableException("Error retrieving contact.", e.Cause)
    }
    return resultContact
  }

  private function convertABContactLookupResult(abContactLookupResult : ABContactRetrievalResult) : Contact {
    var /* ContactContactKey, ContactContact */ contactContactByKey = new HashMap()
    // Note that it's important to use the same ObjectConverter for all the contacts being converted here, to
    // maintain referential integrity when the same object is referenced multiple times in the ABContactLookupResult.
    // For example, a contact may refer to itself in one of its relationships. By using the same ObjectConverter for
    // all conversions, we're guaranteed that when we convert the ABContact the second time, it returns the same object
    // it returned when it converted the ABContact the first time.
    var abToCCConverter = getABToCCConverter()
    // Convert the Contact.
    var contact = abContactLookupResult.ABContact
    var result = abToCCConverter.convert(contact, typeof contact) as Contact
    // Now convert the related Contacts.
    var sources = abContactLookupResult.Relationships.Sources
    var sourceRelatedContacts = new ContactContact[sources.length]
    for (src in sources index i) {
      var linkId = src.LinkID
      var source = abToCCConverter.convert(src.ABContact, typeof src.ABContact) as Contact
      var target = result
      var relationship = abToCCConverter.convert(src.Relationship, typeof src.Relationship) as ContactRel
      sourceRelatedContacts[i] = getContactContact(source, target, relationship, contactContactByKey, linkId, null)
    }
    result.SourceRelatedContacts = sourceRelatedContacts
    var targets = abContactLookupResult.Relationships.Targets
    var targetRelatedContacts = new ContactContact[targets.length]
    for( tgt in targets index i) {
      var source = result
      var target = abToCCConverter.convert(tgt.ABContact, typeof tgt.ABContact) as Contact
      var linkId = tgt.LinkID
      var relationship = abToCCConverter.convert(tgt.Relationship, typeof tgt.Relationship) as ContactRel
      targetRelatedContacts[i] = getContactContact(source, target, relationship, contactContactByKey, linkId, null);
    }
    result.TargetRelatedContacts = targetRelatedContacts
    return result
  }

  //todo paulyoung from nedel - there's a lot of duplicated code here, perhaps they can be refactored together?
  private function convertABRelatedContactsLookupResult(ccContact: Contact, abContactLookupResult : ABContactRetrievalResult) : Contact {
    var /* ContactContactKey, ContactContact */ contactContactByKey = new HashMap()
    // Note that it's important to use the same ObjectConverter for all the contacts being converted here, to
    // maintain referential integrity when the same object is referenced multiple times in the ABContactLookupResult.
    // For example, a contact may refer to itself in one of its relationships. By using the same ObjectConverter for
    // all conversions, we're guaranteed that when we convert the ABContact the second time, it returns the same object
    // it returned when it converted the ABContact the first time.
    var abToCCConverter = getABToCCConverter()
    // Convert the Contact.
    //var contact = abContactLookupResult.ABContact
    // var result = abToCCConverter.convert(contact, typeof contact) as Contact
    // Now convert the related Contacts.
    var currSources = new HashSet<String>();
    ccContact.SourceRelatedContacts.each( \ c -> currSources.add( c.AddressBookUID ) )
    ccContact.TargetRelatedContacts.each( \ c -> currSources.add( c.AddressBookUID ) )

    var sources = abContactLookupResult.Relationships.Sources
    var sourceRelatedContacts = new ContactContact[sources.length]
    for (src in sources index i) {
      var addressBookUID = src.LinkID
      if (currSources.contains( addressBookUID )) continue;
      var source = abToCCConverter.convert(src.ABContact, typeof src.ABContact) as Contact
      var target = ccContact
      var relationship = abToCCConverter.convert(src.Relationship, typeof src.Relationship) as ContactRel
      sourceRelatedContacts[i] = getContactContact(source, target, relationship, contactContactByKey, addressBookUID, ccContact.Bundle)
    }

    // todo: paulyoung from nedel - changes as above
    var targets = abContactLookupResult.Relationships.Targets
    var targetRelatedContacts = new ContactContact[targets.length]
    for( tgt in targets index i) {
      var addressBookUID = tgt.LinkID
      if (currSources.contains( addressBookUID )) continue;
      var source = ccContact
      var target = abToCCConverter.convert(tgt.ABContact, typeof tgt.ABContact) as Contact
      var relationship = abToCCConverter.convert(tgt.Relationship, typeof tgt.Relationship) as ContactRel
      targetRelatedContacts[i] = getContactContact(source, target, relationship, contactContactByKey, addressBookUID, ccContact.Bundle);
    }
    return ccContact
  }

  private function getABContactRelationshipSpec(contactRelationshipSpec : ContactRelationshipSpec) : ABContactRelationshipSpec {
    var abContactRelationshipSpec = new ABContactRelationshipSpec()
    abContactRelationshipSpec.SourceRelationships = convertSpecRels(contactRelationshipSpec.SourceRelationships)
    abContactRelationshipSpec.TargetRelationships = convertSpecRels(contactRelationshipSpec.TargetRelationships)
    return abContactRelationshipSpec
  }

  private function convertSpecRels(ccRels : ContactRelationshipSpecRel[]) : soap.abintegration.enums.ContactRel[]  {
    var abRels = new soap.abintegration.enums.ContactRel[ccRels.length]
    for (ccRel in ccRels index i) {
//      var result = getCCToABConverter().convert(ccRel.Relationship) as IPropertyInfo
//      abRels[i] = result.accessor.getValue( soap.abintegration.enums.ContactRel ) as soap.abintegration.enums.ContactRel
      abRels[i] = getCCToABConverter().convert(ccRel.Relationship, typeof ccRel.Relationship) as soap.abintegration.enums.ContactRel
    }
    return abRels
  }

  // In order to prevent returning duplicate ContactContacts, we cache them by key. A set of contact relationships
  // can contain a duplicate if it contains a self-referencing relationship (one-hop loop).
  private function getContactContact(source : Contact,
                                     target : Contact,
                                     relationship : ContactRel,
                                     contactContactByKey : Map /* ContactContactKey, ContactContact */,
                                     addressBookUID : String,
                                     bundle: Bundle) : ContactContact {
    //todo : paulyoung from nedel - we probably need to be able to pass a bundle in here to create this in the same bundle as the CC contact
    var key = new ContactContactKey(source, target, relationship)
    var cc = contactContactByKey.get(key) as ContactContact
    if (cc == null) {
      if (bundle != null) {
        cc = new ContactContact(bundle)
      } else {
        cc = new ContactContact()
      }
      cc.SourceContact = source
      cc.RelatedContact = target
      cc.Relationship = relationship
      cc.AddressBookUID = addressBookUID
      contactContactByKey.put(key, cc)
    }
    return cc
  }
}
