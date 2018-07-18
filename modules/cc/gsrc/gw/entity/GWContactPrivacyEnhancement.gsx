package gw.entity
uses gw.api.privacy.EncryptionMaskExpressions

enhancement GWContactPrivacyEnhancement : entity.Contact {
  
  function maskTaxId(taxId :  String) : String {
    return EncryptionMaskExpressions.maskTaxId(taxId)
  }
  
}
