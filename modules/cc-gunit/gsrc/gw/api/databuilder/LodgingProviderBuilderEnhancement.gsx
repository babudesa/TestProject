package gw.api.databuilder

enhancement LodgingProviderBuilderEnhancement : gw.api.databuilder.LodgingProviderBuilder {
  /**
   * Sets the Contact
   */
  function withContact(contact : Contact) : LodgingProviderBuilder {
    this.set(LodgingProvider.Type.TypeInfo.getProperty("Contact"), contact)
    return this
  }
}
