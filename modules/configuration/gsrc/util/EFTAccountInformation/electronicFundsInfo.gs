package util.EFTAccountInformation;

class electronicFundsInfo
{
  construct()
  {
  }
  
  //Masks the ABA routing number for US bank accounts
  //Original Author - Jennifer Miller
  //Updated by Stephanie Przygocki
  //Foundation 3
  //Moved from the Check entity to a utility
  static function maskABANumber(routingNumber:String, currentUserHasPerm:boolean):String{
    var hiddenRouteNumber : String
    var routingStart : int
    var lastFourDigit : String

    try{
      if(routingNumber == null){
        hiddenRouteNumber = null
      } else {
        //need to decrypt the routing number here in order to display
        if(routingNumber.startsWith( "%" )){
          routingNumber = util.crypto.Encryptor.decrypt( routingNumber )
        }
        //checks if user has the permission to view the routing number, if they do it will
        //just return the decrypted value
        if(currentUserHasPerm){
          hiddenRouteNumber = routingNumber
        } else {
          if(gw.api.util.StringUtil.length(routingNumber) > 4 ){ 
            hiddenRouteNumber = "*****"
            routingStart = gw.api.util.StringUtil.length( routingNumber ) - 4
            lastFourDigit = gw.api.util.StringUtil.substring( routingNumber, routingStart )
            hiddenRouteNumber = hiddenRouteNumber + lastFourDigit 
          } else {
            hiddenRouteNumber = "Invalid Routing Number"
          }
        }
      }
    }
    catch(e){
      gw.api.util.Logger.logInfo( "An error occured in util.EFTAccountInformation.electronicFundsInfo.maskABANumber()")
      gw.api.util.Logger.logInfo( hiddenRouteNumber );
    }
    return hiddenRouteNumber
  }
  
  //Masks the bank account number
  //Original Author - Jennifer Miller
  //Updated by Stephanie Przygocki
  //Foundation 3
  //Moved from the Check entity to a utility
  static function maskAccountInfo(accountInfo:String, currentUserIsAdjuster:boolean):String{
    var hiddenAcctNumber : String
    var routingStart : int
    var lastFourDigit : String
   
    try{
      accountInfo = gw.api.util.StringUtil.trim( accountInfo )
      if(accountInfo == null){
        hiddenAcctNumber = null
      } else {
        //need to decrypt the routing number here in order to display
        if(accountInfo.startsWith( "%" )){
          accountInfo = util.crypto.Encryptor.decrypt( accountInfo )
        }
        if(currentUserIsAdjuster){
          hiddenAcctNumber = accountInfo
        } else {
          if (gw.api.util.StringUtil.length(accountInfo) > 4 ){ 
            hiddenAcctNumber = "*****"
            routingStart = gw.api.util.StringUtil.length( accountInfo ) - 4
            lastFourDigit = gw.api.util.StringUtil.substring( accountInfo, routingStart )
            hiddenAcctNumber = hiddenAcctNumber + lastFourDigit 
          } else {
            hiddenAcctNumber = "Invalid Account Number"
          }
        }
      }
    }
    catch(e){
      gw.api.util.Logger.logInfo( "An error occured in util.EFTAccountInformation.electronicFundsInfo.maskAccountInfo()")
      gw.api.util.Logger.logInfo( hiddenAcctNumber );
      gw.api.util.Logger.logInfo( e as java.lang.String )
    }
    return hiddenAcctNumber
  }
  
  //Generates the EFT number
  //Author Stephanie Przygocki
  //Foundation 2
  static function getEFTReferenceNumber(bank:String, checkNumber:String):String{
    var eftRefNumber:String  = util.UniqueNumberGenerators.generateEFTCheckNumber( bank )  
    return eftRefNumber  
  }
  
  //Filters delivery type for checks and EFT payments
  //This function is not used for bulk invoices as bulk invoices will always have a copy
  //sent to the recipient
  //Author Stephanie Przygocki
  //Foundation 2
  static function getDeliveryType(deliveryType : String, paymentMethod : String) : boolean {
    var filter:boolean = true
    if(paymentMethod=="eft"){
      if(deliveryType=="send" || deliveryType=="email"){
        filter=true
      } else {
        filter=false
      }
    } else {
      filter = true
    }
    return filter
  }
  
  //Builds the display name for EFT accounts that shows in payment drop downs on bulk invoices
  //and regular checks
  //Author: Stephanie Przygocki
  //Foundation 3 - 12/18/08
  static function buildDisplayName(account : ABEFTAccountInfoExt, currentUserIsAdjuster : boolean) : String {
    var retString : String = ""
    
    if (account.NameOnAccountExt != null and account.NameOnAccountExt.length() > 0) {
      retString = retString + account.NameOnAccountExt + " - ";
    }
    if (account.BankNameExt != null and account.BankNameExt.length() > 0) {
      retString = retString + account.BankNameExt + " - ";
    }
    if (account.AccountTypeExt != null) {
      retString = retString + account.AccountTypeExt + " - ";
    }
    if (account.AccountNumberExt != null and account.AccountNumberExt.length() > 0) {
      retString = retString + maskAccountInfo(account.AccountNumberExt, currentUserIsAdjuster);
    }    
    
    return retString;
  }
  
}
