package gw.api.databuilder;

uses entity.ContactContact
uses typekey.ContactRel

uses gw.api.databuilder.DataBuilder
uses gw.api.databuilder.ContactBuilder
/**
 * Builder for {@link com.guidewire.pl.domain.contact.ContactContact}
 *
 * @author paulyoung
 */
class MyContactContactBuilder extends DataBuilder<ContactContact, MyContactContactBuilder> {

  construct()
  {
    super( ContactContact);
  }

  function asRelationship( relationship : ContactRel ) : MyContactContactBuilder
  {
    set( ContactContact.Type.TypeInfo.getProperty( "Relationship" ), relationship )
    return this
  }

  function withSrcContact( relationship : ContactRel, contactBuilder : ContactBuilder ) : MyContactContactBuilder
  {
    set( ContactContact.Type.TypeInfo.getProperty( "Relationship" ), relationship )
    set( ContactContact.Type.TypeInfo.getProperty( "SourceContact" ), contactBuilder )
    return this
  }

  function withTargetContact( relationship : ContactRel, contactBuilder : ContactBuilder ) : MyContactContactBuilder
  {
    set( ContactContact.Type.TypeInfo.getProperty( "Relationship" ), relationship )
    set( ContactContact.Type.TypeInfo.getProperty( "RelatedContact" ), contactBuilder )
    return this
  }
}
