package gw.api.databuilder

enhancement MobilePropertyIncidentBuilderBaseEnhancement<T extends MobilePropertyIncident, B extends MobilePropertyIncidentBuilderBase> : gw.api.databuilder.MobilePropertyIncidentBuilderBase<T, B>
{
  public function withLocationAddress(address : AddressBuilder) : B {
    this.set(MobilePropertyIncident.Type.TypeInfo.getProperty( "LocationAddress" ), address)
    return this.thisAsB()
  }
}
