package gw.plugin.ccabintegration.impl
uses gw.api.util.mapping.NameTranslatorImpl
uses java.io.File
uses gw.api.util.mapping.IdentityFieldMapper
uses gw.api.util.mapping.NullFieldMapper

enhancement NameTranslatorImplEnhancement : NameTranslatorImpl {
  static function create(file : File, sourceNamespace : String, targetNamespace : String) : NameTranslatorImpl {
    return new NameTranslatorImpl(file, sourceNamespace, targetNamespace, new NullFieldMapper(), IdentityFieldMapper.getINSTANCE())
  }
}
