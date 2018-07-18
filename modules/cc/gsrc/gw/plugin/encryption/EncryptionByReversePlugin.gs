package gw.plugin.encryption

uses gw.plugin.util.IEncryption
uses java.lang.StringBuilder

/**
 * This is a sample Encryption Plug-in and should not be used in a production environment.
 */
class EncryptionByReversePlugin implements IEncryption
{
  construct() {}
  
  override function encrypt(value:String) : String {
    return reverse(value)
  }
  
  override function decrypt(value:String) : String {
    return value.substring(value.length() / 2, value.length())
  }
  
  override function getEncryptedLength(size:int) : int {
    return size * 2
  }
  
  override property get EncryptionIdentifier() : String {
    return "gw.reverse"
  }
  
  private function reverse(value:String) : String {
    if (value != null) {
      var buffer = new StringBuilder(value)
      return buffer.reverse().append(value).toString()
    } else {
      return null
    }  
  }
}

