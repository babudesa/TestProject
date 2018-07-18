package gw.plugin.integration.mapping

uses gw.lang.reflect.IPropertyInfo
uses gw.api.util.mapping.ObjectConverter
uses gw.api.util.mapping.IFieldMapper

class NullFieldMapper implements IFieldMapper {

  override function mapField(converter : ObjectConverter,
                           source : Object,
                           target : Object,
                           sourceProperty : IPropertyInfo) {
  }
}
