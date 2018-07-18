package gw.api.databuilder

enhancement PersonBuilderEnhancement : PersonBuilder {
  
  public function withSpecialtyType(specialtyType : SpecialtyType) : PersonBuilder {
    this.set(Person.Type.TypeInfo.getProperty( "SpecialtyType" ), specialtyType)
    return this
  }

  function withMyContactAddress(addrBuilder : AddressBuilder) : PersonBuilder {
    this.addArrayElement(Contact.Type.TypeInfo.getProperty( "ContactAddresses" ), new MyContactAddressBuilder().withAddress( addrBuilder ))
    return this
  } 

  /**
   * Use this ContactBuilder to create a new related contact of the given relationship.
   * @param relationship the relationship for the new contact
   * @param contactBuilder the  
   * @return ContactBuilder
   */
  function withMyRelatedContact( relationship : ContactBidiRel, contactBuilder : ContactBuilder ) : PersonBuilder
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
