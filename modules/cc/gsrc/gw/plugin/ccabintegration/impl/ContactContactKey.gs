package gw.plugin.ccabintegration.impl;

uses java.lang.System

class ContactContactKey {
    var _source : Contact
    var _target : Contact
    var _relationship : ContactRel

    construct(source : Contact, 
              target : Contact, 
              relationship : ContactRel) {
      _source = source
      _target = target
      _relationship = relationship
    }

    public override function equals(o : Object) : boolean {
      var hc1 = hashCode()
      var hc2 = o.hashCode()
      if (hc1 == hc2) return true
      if (o == null || !(o typeis ContactContactKey)) return false

      var that = o as ContactContactKey

      if (!_relationship.Code.equals(that._relationship.Code)) { 
        return false
      }
      
      // Note the use of the system identity, rather than equals(). When dealing with toolkit objects in the same
      // object graph, you want to use object identity; the equals() methods on the generated objects are unreliable.
      // Same goes for the calculation of hashCode(), below.
      if (_source != that._source) return false
      if (_target != that._target) return false

      return true
    }

    public override function hashCode() : int {
      var result : int
      result = System.identityHashCode(_source)
      result = 29 * result + System.identityHashCode(_target)
      result = 29 * result + (_relationship as Object).hashCode()
      return result
    }
}
