package util.financials;
uses java.util.Iterator;
uses java.util.ArrayList;

@Export
class CheckFunctions
{
  construct()
  {
  }

  /**
   * @deprecated use check.handleOnPickForPayee(Check.FirstPayee)
   */
  public static function handleOnPickForPrimaryPayee(chk : Check, showFullName : Boolean) {
    var payee = chk.FirstPayee.Payee;
    chk.FirstPayee.PayeeType = chk.getSuggestedPayeeType(payee);
    chk.MailToAddress = payee.getPrimaryAddressDisplayValue();
    //chk.PayTo = payee.DisplayName;
    if(showFullName and payee typeis Company){
      setPayToLinesOnCheck(chk, payee.Name);
    }else{
      setPayToLinesOnCheck(chk, payee.DisplayName);
    }
    chk.MailTo = payee.DisplayName;
    chk.Reportability = (chk.FirstPayee.PayeeType == "vendor") ? "reportable" : "notreportable";   
    // 3/12/2008 - zthomas - Defect 783, If PayeeType is "other", loop through the payee's actual roles until an allowed role is found. Set the payeetype to correct role.
    if(chk.FirstPayee.PayeeType == "other"){
      for(actualRole in chk.FirstPayee.ClaimContact.Roles){
        if(exists(allowedRole in chk.getAllowedPayeeTypes( payee ) where allowedRole == actualRole.Role)){
          chk.FirstPayee.PayeeType = actualRole.Role;
        }
      }
    }
    // 12/7/2009 - zthomas - Defect 1762, Tax Levy vendors should no longer default to IRS.
    // Instead default to the vendor name like backup withholding vendors.
    //if(chk.PaymentMethod == "check" and payee.Ex_TaxStatusCode == "T"){
      //chk.PayTo = "Internal Revenue Service"        
    //  setPayToLinesOnCheck(chk, "Internal Revenue Service");
    //}
    
    chk.setCheckPayTo()
     
  }

  /**
   * @deprecated use check.handleOnPickForPayee(checkPayee)
   */
  public static function handleOnPickForJointPayees(chk: Check, checkPayee : CheckPayee, showFullName : Boolean) {
    if (checkPayee != null) {
      checkPayee.PayeeType = chk.getSuggestedPayeeType(checkPayee.Payee);
      
      // 3/12/2008 - zthomas - Defect 783, If PayeeType is "other", loop through the payee's actual roles until an allowed role is found. Set the payeetype to correct role.
      if(checkPayee.PayeeType == "other"){
        for(actualRole in checkPayee.ClaimContact.Roles){
          if(exists(allowedRole in chk.getAllowedPayeeTypes( checkPayee.Payee ) where allowedRole == actualRole.Role)){
            checkPayee.PayeeType = actualRole.Role;
    }
        }
      }
    }
    var payto : String = "";
    var first : boolean = true;
    for (payee in chk.Payees) {
      var name : String = payee.Payee.DisplayName;
      if (name != null) {
        if (!first) {
          name = payee.Payee.DisplayName;
          payto = payto + " & ";
        } else {//allows for full name primary payee
          if(showFullName and chk.FirstPayee.Payee typeis Company){
          name = payee.Payee.Name;
          }
          first = false;
        }
        payto = payto + name;
      }
    }
    
    setPayToLinesOnCheck(chk, payto);
    //chk.PayTo = payto;
    
    chk.setCheckPayTo();
    // 12/7/2009 - zthomas - Defect 1762, Tax Levy vendors should no longer default to IRS.
    // Instead default to the vendor name like backup withholding vendors.
    //if(chk.PaymentMethod == "check" and exists (payee in chk.payees where payee.payee.Ex_TaxStatusCode == "T")){
      //chk.PayTo = "Internal Revenue Service"
    //  setPayToLinesOnCheck(chk, "Internal Revenue Service");
    //}
    chk.MailToAddress = chk.FirstPayee.Payee.getPrimaryAddressDisplayValue();
    chk.MailTo = chk.FirstPayee.Payee.DisplayName;
    chk.Reportability = (chk.FirstPayee.PayeeType == "vendor") ? "reportable" : "notreportable";
  }
  
  public static function generateTaxport1099Message(msgCheck : Check, theNetAmount : java.math.BigDecimal, thePaymentBox : String) : String {
    var messageContent : String = "";
    var thePayee : CheckPayee;
    var theAddress : Address;
    var theExpenseCode : String ;
    //var Ex_TaxStatusCode :String;
    //Get vendor payee
    foreach  (checkPayee in msgCheck.Payees) {
    
      if (checkPayee.PayeeType == "vendor") {
        thePayee = checkPayee
        var taxAddress : Address
        var mailingAddress : Address
        foreach (address in thePayee.Payee.AllAddresses) {
          if (address.AddressType == "Tax") {
            taxAddress = address
          }
          else if (address.AddressType == "mailing") {
            mailingAddress = address;
          }
        }
        
        if (taxAddress != null) {
          theAddress = taxAddress
        } else if (mailingAddress != null) {
          theAddress = mailingAddress
        } else {
          theAddress = thePayee.Payee.PrimaryAddress;
        }
        break;
      }
    }
    // Get an expense code
    foreach (p in msgCheck.Payments) {
      foreach (l in p.LineItems) {
        if (l.IRS1099BoxNumberExt != null) {
          theExpenseCode = l.IRS1099BoxNumberExt.Code
        
          break;
        }
      }
        break;
    }
    
    
 // If Vendor has Backup Withholding send 28% of his NetAmount to Box04 and 28% to Box07 in Taxport1099
 // If No Backup Withholding send 72% to Box07 in Taxport1099
    
    for (payee in msgCheck.Payees){
      if (payee.Payee.Ex_TaxStatusCode == "B" && msgCheck.BackupWithholdingCheckExt==true){
        if (thePaymentBox=="04"){
          theNetAmount=theNetAmount;
        } else {
          theNetAmount=theNetAmount;  
        }
      } else if (payee.Payee.Ex_TaxStatusCode == "B" && msgCheck.BackupWithholdingCheckExt==false){
        theNetAmount=theNetAmount;
      } else {
        theNetAmount=theNetAmount;
      }
    }
 

    if (thePayee == null || theExpenseCode == "") {
      if (thePayee == null) {
        gw.api.util.Logger.logWarning("Destination 8 - Taxport 1099 Warning: Check #"+msgCheck.CheckNumber+" for claim #"+msgCheck.Claim.ClaimNumber+" does not have a vendor as a payee and cannot be marked as reportable for 1099 purposes.")
      }
      if (theExpenseCode == "") {
        gw.api.util.Logger.logWarning("Destination 8 - Taxport 1099 Warning: Check #"+msgCheck.CheckNumber+" for claim #"+msgCheck.Claim.ClaimNumber+" does not have an expense code and cannot be marked as reportable for 1099 purposes.")
      }
    } else {
      messageContent = templates.messaging.Taxport1099Data.renderToString(msgCheck, thePayee, theNetAmount, theAddress, theExpenseCode, thePaymentBox)
    }
    return messageContent;
  }
  
  public static function handleOnPickForAdditionalPayees(chk: Check, checkPayee : CheckPayee) {
    var hasVendor:boolean = false
    if (checkPayee != null) {
      checkPayee.PayeeType = chk.getSuggestedPayeeType(checkPayee.Payee);
      //checkPayee.IsOriginalPayeeExt = false
    }
    if(exists(payee in chk.Payees where payee.PayeeType=="vendor")){
      hasVendor=true 
    }
    if(!hasVendor and checkPayee.PayeeType=="vendor"){
      chk.Reportability = "reportable"
    } else if(!hasVendor and checkPayee.PayeeType!="vendor"){
      chk.Reportability = "notreportable"
    }
  }
  
  public static function handleRemoveForAdditionalPayees(chk: Check, checkPayee : CheckPayee) {
    var hasVendor:boolean = false
    if(exists(payee in chk.Payees where payee.PayeeType=="vendor")){
      hasVendor=true 
    }
    if(hasVendor){
      chk.Reportability = "reportable"
    } else {
      chk.Reportability = "notreportable"
    }
  }
  
  /* 
  *  This function accepts a check entity and a string of check payees and splits them between
  *  the 6 possible pay to lines.
  *  10/5/2009
  *  Zach Thomas
  */
  public static function setPayToLinesOnCheck(chk:Check, payToString:String){
    var stringList:List = new ArrayList();
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
        if(util.StringUtils.getXMLValue(newString, false).length() < 40){
          if(payToStringIter.hasNext()){
            stringToAdd = newString;
          }else{
            stringList.add( newString )
            stringToAdd = "";
          }
        }
        if(util.StringUtils.getXMLValue(newString, false).length() == 40){
          stringList.add( newString )
          stringToAdd = "";
        }
        if(util.StringUtils.getXMLValue(newString, false).length() > 40){
          stringList.add( stringToAdd )
          stringToAdd = payTo + " ";
        }
      }else{
        var longString:String = stringToAdd + payTo + " ";
        while(longString != null){
          if(util.StringUtils.getXMLValue(longString, false).length() > 40){
            stringList.add(longString.substring( 0, 40 ));
            longString = longString.substring( 40 );
          }  
          if(util.StringUtils.getXMLValue(longString, false).length() > 0 and util.StringUtils.getXMLValue(longString, false).length() <= 40){
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
  

    /**
    * Gets all valid Cost Types
    * 
    * @param claim the Claim
    * @param isManual is this a Manual Check or Bulk Invoice
    * @return the list of allowed Cost Types
    */
    public static function getCostTypeValues(claim : Claim, thePaymentMethod : PaymentMethod, account : BankAccount) : List<CostType> {
       
        var validCostTypes : List<CostType> = new ArrayList<CostType>()
        var env = gw.api.system.server.ServerUtil.getEnv(); 

         //includes new GAI as TPA cost types for E&S currenlty hiddend from CERT & PROD environments
        if((claim.LossType == LossType.TC_SPECIALTYES) && (thePaymentMethod == PaymentMethod.TC_MANUAL || thePaymentMethod == null) 
            and claim.Policy.PolicyType != PolicyType.TC_PRC and claim.Policy.PolicyType != PolicyType.TC_PRX) {
            
            
            if(account == BankAccount.TC_TOMIC){
              validCostTypes = typekey.CostType.getTypeKeys(false)
                     .where(\c ->c == typekey.CostType.TC_GAIASTPAEXPENSE ||
                                 c == typekey.CostType.TC_GAIASTPALOSS)
            }else{
              validCostTypes = typekey.CostType.getTypeKeys(false)
                                   .where(\c ->c == typekey.CostType.TC_CLAIMCOST || 
                                               c == typekey.CostType.TC_EXPENSE ||
                                               c == typekey.CostType.TC_GAIASTPAEXPENSE ||
                                               c == typekey.CostType.TC_GAIASTPALOSS)
            }
            
           
        } else {

            validCostTypes = typekey.CostType.getTypeKeys(false)
                                .where(\c ->c == typekey.CostType.TC_CLAIMCOST || 
                                            c == typekey.CostType.TC_EXPENSE)
        } 

        return validCostTypes
    }
    
    
    /**
    * Fitlers the reserve lines for the NewPaymentDetialV pcf & BulkInvoiceItemsLV.pcf
    * 
    * @param reserveLines the payable Reserve Lines on the Claim
    * @return the filtered list of Reserve Lines
    */
    public static function filterReserveLines(reserveLines : List<Object>, claim : Claim, thePaymentMethod : PaymentMethod, account : BankAccount) : List<ReserveLine> {
        
        var validCostTypes : List<CostType> = getCostTypeValues(claim, thePaymentMethod, account)
        
        
        var payableReserveLines = reserveLines as List<ReserveLine>
        var filteredReserveLines : List<ReserveLine> = new ArrayList<ReserveLine>()
        
        //filter reserve lines based on valid cost types for the claim
        filteredReserveLines = payableReserveLines.where(\ r -> exists(costType in validCostTypes where r.CostType == costType ))
        
        //add the "New.." reserve line back into the filtered list
        if(!exists(rl in filteredReserveLines where rl == payableReserveLines.last())){
            filteredReserveLines.add(payableReserveLines.last())
        }
        
        return filteredReserveLines      
     }
    
    
    
    /**
    * Checks the given cost type to see if it is 1099 reportable
    * 
    * @param type the Cost Type
    * @return is the Cost Type 1099 Reportable
    */
    public static function is1099ReportableCostType(type : CostType) : boolean {

        var isReportable : boolean = false

        if(type == CostType.TC_GAIASTPAEXPENSE || type == CostType.TC_GAIASTPALOSS){
           isReportable = false
        }else {
           isReportable = true
        }

        return isReportable
    }
    
    // defect 8350: function validates When To Pay date on the last screen of the check wizard 
    public static function validateWhenToPayDate(check:Check):String{
      if(check.ScheduledSendDate!=null){
        if(gw.api.util.DateUtil.compareIgnoreTime(Check.ScheduledSendDate, gw.api.util.DateUtil.currentDate()) >= 0){  
          return null 
        }
        else{ 
          return displaykey.Java.Validation.Date.ForbidPast
        }
      }
      else
        return displaykey.Java.Validation.Date.InvalidDate(null, (now() as java.util.Date).formatDate(SHORT))
    }
}//End CheckFunctions 