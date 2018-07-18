package gw.api.databuilder

uses gw.api.databuilder.MyContactContactBuilder

uses gw.api.databuilder.ContactBuilder

enhancement CompanyBuilderEnhancement : CompanyBuilder
{
  
  /**
   * Use this ContactBuilder to create a new related contact of the given relationship.
   * @param relationship the relationship for the new contact
   * @param contactBuilder the  
   * @return ContactBuilder
   */
  function withMyRelatedContact( relationship : ContactBidiRel, contactBuilder : ContactBuilder ) : CompanyBuilder
  {
    var accessor = com.guidewire.pl.system.dependency.PLDependencies.getContactConfiguration().getContactRelationshipConfigFile().getAccessor( relationship )
    var rel = accessor.getContactRel()
    if (accessor.isForward()) {
      this.addArrayElement( Contact.Type.TypeInfo.getProperty( "TargetRelatedContacts" ), new MyContactContactBuilder().withTargetContact( rel, contactBuilder ))
    } else {
      this.addArrayElement( Contact.Type.TypeInfo.getProperty( "SourceRelatedContacts" ), new MyContactContactBuilder().withSrcContact( rel, contactBuilder ))
    }
    return this
  }
}
