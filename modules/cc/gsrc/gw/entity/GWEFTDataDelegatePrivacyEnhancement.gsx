package gw.entity
uses gw.api.privacy.EncryptionMaskExpressions

enhancement GWEFTDataDelegatePrivacyEnhancement : entity.EFTDataDelegate {
  
  function maskBankAccountNumber(val : String) : String {
    return EncryptionMaskExpressions.maskBankAccountNumber(val)
  }
}
