package gw.api.databuilder

enhancement PropertyIncidentBuilderBaseEnhancement<T extends PropertyIncident, B extends PropertyIncidentBuilderBase> : gw.api.databuilder.PropertyIncidentBuilderBase<T, B>
{
  public function withPropertyDesc(desc : String) : B {
    this.set(PropertyIncident.Type.TypeInfo.getProperty( "propertyDesc" ), desc)
    return this.thisAsB()
  }
  
  public function withLodgingProvider(lodgingProvider : ValueGenerator<? extends LodgingProvider>) : B {
    this.addArrayElement(PropertyIncident.Type.TypeInfo.getProperty("LodgingProviders"), lodgingProvider);
    return this.thisAsB();
  }
}
