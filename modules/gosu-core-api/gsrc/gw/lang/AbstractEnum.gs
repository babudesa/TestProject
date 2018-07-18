package gw.lang
uses gw.internal.gosu.parser.EnumUtil
uses gw.lang.reflect.IEnumValue
uses java.lang.Comparable

class AbstractEnum<E extends AbstractEnum<E>> implements Comparable<E>, IEnumValue, java.io.Serializable
{
  var _name : String
  var _ordinal : int = -1
  
  property get Name() : String
  {
    if( _name == null )
    {
      _name = EnumUtil.getName( this )
    }
    return _name
  }
  override property get Code() : String
  {
    return Name
  }
  override property get DisplayName() : String
  {
    return Name
  }
  
  override property get Ordinal() : int
  {
    if( _ordinal == -1 )
    {
      _ordinal = EnumUtil.getOrdinal( this )
    }
    return _ordinal
  }
  
  override property get Value() : E
  {
    return this as E
  }
  
  override function compareTo( obj : E ) : int
  {
    return Ordinal - obj.Ordinal
  }

  // Equals is final to ensure that two enum constants are equal iff they are
  // the same reference.
  final override function equals( other : Object ) : boolean
  {
    return this === other
  }
  final override function hashCode() : int
  {
    //return super.hashCode()
    return java.lang.System.identityHashCode( this )
  }

  override function toString() : String
  {
    return Name
  }

  private function writeObject( out: java.io.ObjectOutputStream )
  {
    var ord = Ordinal // ensure _ordinal is initialized
    // Note GosuClassInstance handles readResolve() for enums
    out.defaultWriteObject()
  }
}
