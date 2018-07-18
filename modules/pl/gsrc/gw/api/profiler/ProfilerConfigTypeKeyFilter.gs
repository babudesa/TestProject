package gw.api.profiler
uses gw.api.filters.TypeKeyFilter
uses gw.entity.ITypekeyPropertyInfo

class ProfilerConfigTypeKeyFilter extends TypeKeyFilter
{
  construct( profilerConfigType : typekey.ProfilerConfig )
  {
    super( profilerConfigType, ProfilerConfig.Type.TypeInfo.getProperty( "Subtype" ) as ITypekeyPropertyInfo )
  }
}
