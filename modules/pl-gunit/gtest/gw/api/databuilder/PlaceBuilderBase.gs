package gw.api.databuilder

class PlaceBuilderBase<T extends Place, B extends PlaceBuilderBase<T, B>> extends ContactBuilder<T, B>
{
  construct( type : Type<Place> )
  {
    super( type, 0 )
  }
  
  function withName( name : String ) : B
  {
    set( Place.Type.TypeInfo.getProperty( "Name" ), name )
    return this as B
  }
}
