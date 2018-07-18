package gw.plugin.integration.mapping

uses com.guidewire.pl.plugin.util.ReflectionException
uses java.lang.ClassNotFoundException

class TypelistNotFoundException extends ReflectionException
{
  construct(str : String, cnfe : ClassNotFoundException) {
    super(str, cnfe)
  }
}
