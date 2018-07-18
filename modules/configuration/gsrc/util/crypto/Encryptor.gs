package util.crypto;

uses com.gaic.claims.crypto.GAIEncryptor;
class Encryptor
{
  construct(){
  }
  
  static function encrypt(data :String):String
  {
    var encryptor :  GAIEncryptor = new GAIEncryptor();
    
    //Added 12/19/08 sprzygocki
    //Encryption for account numbers cannot be compared simply to a length, so by
    //adding a % character we guarantee that the encryption for account numbers and routing numbers
    //will always be caught
    //This should still work for encryption of other data, the extra character will be removed before
    //decryption below.
    var encryptedData : String = "%" + encryptor.encrypt( data )
    
    return encryptedData
  }
  
  static function decrypt(data :String):String
  {
    var encryptor :  GAIEncryptor = new GAIEncryptor();
    var dataToDecrypt : String = gw.api.util.StringUtil.substring( data, 1 )
    return encryptor.decrypt( dataToDecrypt )
  }
  
  //The string to mask must be at least 5 characters long
  static function maskString(stringToMask:String, currentUserHasPerm:boolean, pageIsInEditMode:boolean):String{
    var maskedString : String = ""
    //var stringStartLength : int = 0
    //var lastFourChar : String
    try{
      if(stringToMask == null || stringToMask == ""){
        maskedString = ""
      } else {
        //need to decrypt the routing number here in order to display
        //AES will always have a length of greater than 9 digits
        if(stringToMask.startsWith( "%" )){
          stringToMask = util.crypto.Encryptor.decrypt( stringToMask )
        }
        //checks if user has the permission to view the masked string, if they do it will
        //just return the decrypted value
        if(pageIsInEditMode){
          if(currentUserHasPerm){
            maskedString = stringToMask
          } else {
            maskedString = createMask(stringToMask)
          }
        } else {
          if(currentUserHasPerm){
            maskedString = stringToMask
          } else {
            maskedString = createMask(stringToMask)
          }
        }
      }
    }
    catch(e){
      gw.api.util.Logger.logInfo( "An error occured in util.crypto.Encryptor.maskString()")
      gw.api.util.Logger.logInfo( maskedString );
    }
    return maskedString
  }
  
  static function createMask(stringToMask : String) : String{
    var maskedString : String = ""
    var stringStartLength : int = 0
    var lastFourChar : String
    
    if(gw.api.util.StringUtil.length(stringToMask) > 4 ){ 
      stringStartLength = gw.api.util.StringUtil.length( stringToMask ) - 4
      var i = 0
      while(i < stringStartLength){
        maskedString = maskedString + "*"
        i=i+1
      }
      lastFourChar = gw.api.util.StringUtil.substring( stringToMask, stringStartLength )
      maskedString = maskedString + lastFourChar 
    } else {
      maskedString = "Invalid String"
    }
    
    return maskedString
  }
}
