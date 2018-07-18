package libraries.BulkInvoice_Entity
uses java.util.Iterator;
uses java.util.ArrayList;
enhancement BulkInvoice : entity.BulkInvoice {
  function getMailToAddress(): String{
    return this.PayTo;
  }

  // Generate a unique hash string based off the current date and time for today
  function generateRefrenceSequenceNumber() : String {
    var result = new java.lang.StringBuffer();
  
    // Get time in milliseconds
    var currentDateAndTime : java.util.Calendar = java.util.Calendar.getInstance();
    var currentDateOnly : java.util.Calendar = java.util.Calendar.getInstance();
    currentDateOnly.clear();
    currentDateOnly.set(currentDateAndTime.get(java.util.Calendar.YEAR), currentDateAndTime.get(java.util.Calendar.MONTH), currentDateAndTime.get(java.util.Calendar.DATE));
    var currentDateAndTimeInMs : long = currentDateAndTime.getTimeInMillis();
    var currentDateOnlyInMs : long = currentDateOnly.getTimeInMillis();
    var timeOnlyInMs : long = currentDateAndTimeInMs - currentDateOnlyInMs;

    var fourthPower : long = 11316496;
    var thirdPower : long = 195112;
    var secondPower : long = 3364;
    var firstPower : long = 58;

    var quotient : long;
    var remainder : long;
    var digit : char;
  
    // Calculate fifth "digit"
    quotient = timeOnlyInMs / fourthPower;
    remainder = timeOnlyInMs - quotient * fourthPower;
    if (quotient < 10) {
      digit = quotient + 48;
    } else if ((quotient > 10) && (quotient < 34)) {
      digit = 65 + quotient - 10;
    } else {
      digit = 97 + quotient - 34;
    }
    result.append(digit);
  
    // Calculate the fourth "digit"
    quotient = remainder/thirdPower;
    remainder = remainder - quotient *  thirdPower;
    if (quotient < 10) {
      digit = quotient + 48;
    } else if ((quotient > 10) && (quotient < 34)) {
      digit = 65 + quotient - 10;
    } else {
      digit = 97 + quotient - 34;
    }
    result.append(digit);
		
     // Calculate the third "digit"
    quotient = remainder/secondPower;
    remainder = remainder - quotient * secondPower;
    if (quotient < 10) { 
      digit = quotient + 48;
    } else if ((quotient > 10) && (quotient < 34)) {
      digit = 65 + quotient - 10;
    } else {
      digit = 97 + quotient - 34;
    }
    result.append(digit);

    // Calculate the second "digit"
    quotient = remainder/firstPower;
    remainder = remainder - quotient *firstPower;
    if (quotient < 10) {
      digit = quotient + 48;
    } else if ((quotient > 10) && (quotient < 34)) {
      digit = 65 + quotient - 10;
    } else {
      digit = 97 + quotient - 34;
    }
    result.append(digit);
  
    // Calculate the first "digit"
    if (remainder < 10) {
      digit = remainder + 48;
    } else if ((remainder > 10) && (remainder < 34)) {
      digit = 65 + remainder - 10;
    } else {
      digit = 97 + remainder - 34;
    }
    result.append(digit);

    return result;
  }

  function setMemo(){
    var memo : String = "Pymt. For Invoice"
    var format : java.text.SimpleDateFormat = new java.text.SimpleDateFormat("M/d/yyyy")
    var ServiceDateStart : String
    var ServiceDateEnd : String
  
    if(this.InvoiceNumber!=null){
      memo = memo + " #" + this.InvoiceNumber
    }
    if(this.DateOfServiceFromExt!=null){
      ServiceDateStart = format.format(this.DateOfServiceFromExt)
      if(this.DateOfServiceToExt!=null){
        ServiceDateEnd = format.format(this.DateOfServiceToExt)
        memo = memo + " from " + ServiceDateStart + " to " + ServiceDateEnd
      } else {
        memo = memo + " from " + ServiceDateStart
      }
    } else {
      if(this.DateOfServiceToExt!=null){
        memo = memo + " to " + ServiceDateEnd
      }
    }
    this.Memo = memo
  }

  //BulkInvoice line items include recovery reserve lines OOB - this function removes recovery reserves
  //Sprint/Maintenance Release: AgriBusiness Sprint 14
  //Author: Stephanie Przygocki
  //Date: 6-27-08

  function removeCostCat(res : ReserveLineWrapper) : boolean{
    if(res.ReserveLine.CostCategory != "deductible" and res.ReserveLine.CostCategory != "salvage"
       and res.ReserveLine.CostCategory != "subrogation" and res.ReserveLine.CostCategory != "overpayment"
       and res.ReserveLine.CostCategory != "secondinjuryfund"){
      return true;
    }else{
      return false;
    }
  }
 public static function setPayToLinesOnCheck(chk:BulkInvoice, payToString:String){
    var stringList:ArrayList = new ArrayList();
    var stringToAdd:String = "";
    var payToStringArray:String[] = null;
    var payToStringList:List = new ArrayList();

    if(payToString != null){
      payToStringArray = payToString.split( " " ); //Split the passed in string to make each name and & in it's own element.
}
    for(payToStr in payToStringArray){
      payToStringList.add( payToStr )
    }

    var payToStringIter:Iterator = payToStringList.iterator();

    /*
    *  This block of code will concatinate the elements of the payTo list ensuring that each of the 
    *  6 pay to lines are filled to the 40 character limit without breaking a name in the middle.
    *  If adding the next element to the string will make the character length go over 40 characters, 
    *  It will be placed on the next line.
    */
    while(payToStringIter.hasNext()){
      var payTo:String = payToStringIter.next() as java.lang.String;
      if(payTo.length() <= 40){
        var newString:String = stringToAdd + payTo + " ";
        if(newString.length() < 40){
          if(payToStringIter.hasNext()){
            stringToAdd = newString;
          }else{
            stringList.add( newString )
            stringToAdd = "";
          }
        }
        if(newString.length() == 40){
          stringList.add( newString )
          stringToAdd = "";
        }
        if(newString.length() > 40){
          stringList.add( stringToAdd )
          stringToAdd = payTo + " ";
        }
      }else{
        var longString:String = stringToAdd + payTo + " ";
        while(longString != null){
          if(longString.length() > 40){
            stringList.add(longString.substring( 0, 40 ));
            longString = longString.substring( 40 );
          }  
          if(longString.length() > 0 and longString.length() <= 40){
            stringList.add(longString);
            longString = null;
          } 
        }
      }
    }
    if(stringToAdd != null and stringToAdd.length() != 0){
      stringList.add( stringToAdd )
    }

    var stringIter:Iterator = stringList.iterator()
    if(stringIter.hasNext()){  //Set the 6 payto lines with the concatinated strings.
      chk.PayToLine1Ext  = stringIter.next() as java.lang.String; 
    }else{
      chk.PayToLine1Ext = null;
    }
    if(stringIter.hasNext()){
      chk.PayToLine2Ext = stringIter.next() as java.lang.String;  
    }else{
      chk.PayToLine2Ext = null;
    }
    if(stringIter.hasNext()){
      chk.PayToLine3Ext = stringIter.next() as java.lang.String;  
    }else{
      chk.PayToLine3Ext = null;
    }
    if(stringIter.hasNext()){
      chk.PayToLine4Ext = stringIter.next() as java.lang.String;  
    }else{
      chk.PayToLine4Ext = null;
    }
    if(stringIter.hasNext()){
      chk.PayToLine5Ext = stringIter.next() as java.lang.String;  
    }else{
      chk.PayToLine5Ext = null;
    }
    if(stringIter.hasNext()){
      chk.PayToLine6Ext = stringIter.next() as java.lang.String;  
    }else{
      chk.PayToLine6Ext = null;
    }
  }
   function replacePostalCode(mailAddress : Address) : String {
     if(mailAddress.PostalCode != null && mailAddress.Country.Code =="US" && mailAddress.PostalCode.length()==10 && mailAddress.PostalCode.contains("-")){
       return mailAddress.PostalCode.replace("-", "")
     }
     else if(mailAddress.PostalCode != null && mailAddress.Country.Code =="US" && mailAddress.PostalCode.length()==10 && mailAddress.PostalCode.contains(" ")){
       return mailAddress.PostalCode.replace(" ", "")
     }
    else{
      return mailAddress.PostalCode
    }
  }
  
  /**
   * Gets indicator field for CheckWriter. As of 8.26.15 
   * this indicator is only used for Workers' Comp checks 
   * and Bulk Checks that include at least one payment 
   * allocated to a WC claim. Indicates that the check is 
   * related to a WC claim and may require unique text
   * on the back of the check.
   * 
   * @return 2-character code
   */
  function getBackOfCheckIndicator() : String {
    var result : String = ""
    for (payment in this.InvoiceItems){
      if(util.WCHelper.isWCorELLossType(payment.Claim)){
        result = "WC"
        break;
      }
    }
    return result
  }
}
