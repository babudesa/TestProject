package libraries.Check_Entity
uses java.text.SimpleDateFormat
uses java.util.ArrayList;
uses gw.api.util.Logger //Added for logging in Debug - SR
uses gw.api.util.DisplayableException
uses gw.api.util.StringUtil
uses gw.api.address.AddressOwner
uses gw.entity.TypeKey

enhancement Check : entity.Check {
  
  //9/17/09 erawe - commented out getMailToAddress() to check in Zach's changes that were merged on 9/16/09.
  //This commented function will be created in an Equine post production release per Santosh in order to only
  //have to maintain one admin-prod file, and get the company name on checks Returned to Office.

  //function getMailToAddress(): String{
  //  //defect 1556 erawe 1/12/09 added a check, if street address line 2 exist or not for the mail to display
  //  //9/9/09 defect 2376 erawe:  Added issuing company to add to address on hold checks
  //  var addy:String = ""
  //  if(this.DeliveryMethod == "hold"){
  //      if(this.claim.AssignedGroup.CompanyNameExt !=null){
  //        addy = this.claim.AssignedGroup.CompanyNameExt.Name + ", "
  //      }else{
  //      addy = "Great American Insurance Company, "
  //      }
  //      if(this.ex_MailToAddress.AddressLine2 !=null){
  //        return this.ex_MailTo + " " + addy + " " + this.ex_MailToAddress.AddressLine1 + ", " + this.ex_MailToAddress.AddressLine2 + "," + this.ex_MailToAddress.CityStateZip;
  //      }
  //      else {
  //       return this.ex_MailTo + " " + addy + " " + this.ex_MailToAddress.AddressLine1 + ", " + this.ex_MailToAddress.CityStateZip;
  //      }
  //  }else
  //  if(this.ex_MailToAddress.AddressLine2 !=null){
  //    return this.ex_MailTo + " " + this.ex_MailToAddress.AddressLine1 + ", " + this.ex_MailToAddress.AddressLine2 + "," + this.ex_MailToAddress.CityStateZip;
  //  }
  //  else {
  //    return this.ex_MailTo + " " + this.ex_MailToAddress.AddressLine1 + ", " + this.ex_MailToAddress.CityStateZip;
  //  }
  //}

function getCheckMailToAddress(): String {
    // Defect 9208 - Address was pointing to wrong location on check, and changed after the contact was
    // edited elsewhere. Changing how the address is pulled.
    var rawAddress:String[] = this.MailToAddress.split("\\|");
    
    // Assign the address values for ease of use
    var addressType:String = rawAddress[0]
    var addressLine1:String = rawAddress[1]
    var addressLine2:String = rawAddress[2]
    var addressCountry:String = rawAddress[3]
    var addressCity:String = rawAddress[4]
    var addressState:String = rawAddress[5]
    var addressZip:String = rawAddress[6]
    
    //defect 1556 erawe 1/12/09 added a check, if street address line 2 exist or not for the mail to display
    //9/9/09 defect 2376 erawe:  Added issuing company to add to address on hold checks
    var addy:String = "";
    var divisionName : String =(this.Claim.AssignedGroup.DivisionNameExt.DivisionNameValue==null?"":this.Claim.AssignedGroup.DivisionNameExt.DivisionNameValue + ", ")
    
    var attentionMailToString=(this.AttentionMailToExt!=null)?"Attn: "+this.AttentionMailToExt+", ":""

    if(this.DeliveryMethod == "hold"){

      addy = displaykey.GAIC.Check.ReturnToOffice.DefaultCompany + ",";

      if(addressLine2 != "null"){
        return addy + " " + divisionName + attentionMailToString + addressLine1 + ", " 
               + addressLine2 + addressCity + ", " + addressState + " " + addressZip;
      } else {
        return addy + " " + divisionName + attentionMailToString + addressLine1 + ", " 
               + addressCity + ", " + addressState + " " + addressZip;
      }
    } else if(addressLine2 != "null"){
      if(this.ex_MailTo !=null){
        return this.ex_MailTo + " " + attentionMailToString + addressLine1 + ", "+ 
               addressLine2 + ", " + addressCity + ", " + addressState + " " + addressZip;  
      } else {
        return attentionMailToString + addressLine1 + ", " + addressCity + ", " + 
               addressState + " " + addressZip;
      }
    } else {
      if(this.ex_MailTo !=null){
        return this.ex_MailTo + " " + attentionMailToString + addressLine1 
               + ", " + addressCity + ", " + addressState + " " + addressZip;
      } else {
        return attentionMailToString + addressLine1 + ", " + addressCity + 
               ", " + addressState + " " + addressZip;
      }
    }
  }

  function getMailToAddress(): String{
    //defect 1556 erawe 1/12/09 added a check, if street address line 2 exist or not for the mail to display
    //9/9/09 defect 2376 erawe:  Added issuing company to add to address on hold checks
    var addy:String = "";
   var divisionName : String =(this.Claim.AssignedGroup.DivisionNameExt.DivisionNameValue==null?"":this.Claim.AssignedGroup.DivisionNameExt.DivisionNameValue+", ")
    
   var attentionMailToString=(this.AttentionMailToExt!=null)?"Attn: "+this.AttentionMailToExt+", ":""
  //var attentionMailToString=(this.AttentionMailToExt==null)?"Attn: "+this.AttentionMailToExt+", ":""
  
    if(this.DeliveryMethod == "hold"){
     //   if(this.Claim.AssignedGroup.CompanyNameExt !=null){
       //   addy = this.Claim.AssignedGroup.CompanyNameExt.DisplayName + ",";
        //}else{
        addy = displaykey.GAIC.Check.ReturnToOffice.DefaultCompany + ",";
        //}
        if(this.ex_MailToAddress.AddressLine2 !=null){
          return addy + " " + divisionName + attentionMailToString + this.ex_MailToAddress.AddressLine1 + ", "+ this.ex_MailToAddress.AddressLine2 + "," + this.ex_MailToAddress.CityStateZip;
        }
        else {
         return addy + " " + divisionName + attentionMailToString + this.ex_MailToAddress.AddressLine1 + ", "+ this.ex_MailToAddress.CityStateZip;
        }
 //Defect # 8929 Mailing address on bulk invoice line items includes the word 'null'
 //}else
   // if(this.ex_MailToAddress.AddressLine2 !=null){
     // return this.ex_MailTo + " " + attentionMailToString + this.ex_MailToAddress.AddressLine1 + ", " + this.ex_MailToAddress.AddressLine2 + ", " + this.ex_MailToAddress.CityStateZip;      
    //}else if(this.ex_MailTo != null){ // Defect #8929 Mailing address on bulk invoice line items includes the word 'null'
     //return this.ex_MailTo + " " + attentionMailToString + this.ex_MailToAddress.AddressLine1 + ", "+ this.ex_MailToAddress.CityStateZip;
    //}else {
      //return attentionMailToString + this.ex_MailToAddress.AddressLine1 + ", "+ this.ex_MailToAddress.CityStateZip;
    //}
  //}
  
}else
if(this.ex_MailToAddress.AddressLine2 != null){
  if(this.ex_MailTo !=null){
   return this.ex_MailTo + " " + attentionMailToString + this.ex_MailToAddress.AddressLine1 + ", " + this.ex_MailToAddress.AddressLine2 + ", " + this.ex_MailToAddress.CityStateZip;      
  }else {
   return attentionMailToString + this.ex_MailToAddress.AddressLine1 + ", "+ this.ex_MailToAddress.CityStateZip;
  }
}else{
  if(this.ex_MailTo !=null){
   return this.ex_MailTo + " " + attentionMailToString + this.ex_MailToAddress.AddressLine1 + ", "+ this.ex_MailToAddress.CityStateZip; 
}else{
 return attentionMailToString + this.ex_MailToAddress.AddressLine1 + ", "+ this.ex_MailToAddress.CityStateZip;
  }
 }
}

  ////10/20/09 erawe - defect 2376, commented out below function and replaced with above.
  //function getMailToAddress(): String{
  //  //defect 1556 erawe 1/12/09 added a check, if street address line 2 exist or not for the mail to display
  //  if(this.ex_MailToAddress.AddressLine2 !=null){
  //    return this.ex_MailTo + " " + this.ex_MailToAddress.AddressLine1 + " " + this.ex_MailToAddress.AddressLine2 +", "+  this.ex_MailToAddress.CityStateZip;
  //  }
  //  else {
  //  return this.ex_MailTo + " " + this.ex_MailToAddress.AddressLine1 + " " + this.ex_MailToAddress.CityStateZip;
  //  }
  //}

  function isDeductibleSubtracted() : Boolean {
    for (payment in this.Payments) {
      if (payment.DeductibleSubtracted == true)
      {
        print ("In 'Step 2a of 3 (Enter a payment wizard), I have set Deductible applies? to Yes" )
        return true
      }
    }
    print ("In 'Step 2a of 3 (Enter a payment wizard), I have set Deductible applies? to No" )
    return false;
  }

  function hasTaxWithholdings(contact : CheckPayee):boolean{

    if(contact.Payee.Ex_TaxStatusCode != null and contact.Payee.Ex_TaxStatusCode.Code ==  "B" or contact.Payee.Ex_TaxStatusCode.Code == "T"){ 
      return true;
    }
    else{
      return false;
    }
  }

  //* sdalal 1/2/2009 - Adding Address Type for the Compliance Accounting address to
  //  rpampush 6/11/09 - Moved the compliance accounting address build to within the if statement, this prevents the address from being created multiple
  // times in the database  
  function checkPayeesForWithholding(){
  
    if(exists(payee in this.Payees where payee.Payee.Ex_TaxStatusCode.Code ==  "B" or payee.Payee.Ex_TaxStatusCode.Code == "T")){
    var complianceAddy:Address = new Address(this.Claim);
    var cAccounting = new Company()

      cAccounting.Name = "Great American Insurance Company";
  
    complianceAddy.AddressType = "mailing";
    complianceAddy.AddressLine1 = "Compliance Accounting Department";
    complianceAddy.AddressLine2 = "301 East Fourth Street, 16th Floor";
    complianceAddy.City = "Cincinnati";
    complianceAddy.State = "OH";
    complianceAddy.Country = "US";
    complianceAddy.PostalCode = "45202";
      this.ex_MailToAddress = complianceAddy;
      this.ex_MailTo = cAccounting;

    }
  }

  function hasPayeeWithholdings():boolean{
      if(exists(payee in this.Payees where payee.Payee.Ex_TaxStatusCode.Code ==  "B" or payee.Payee.Ex_TaxStatusCode.Code == "T")){
        return true;
      }
      else{
        if(this.DeliveryMethod != "agent" and this.ex_MailTo.DisplayName == "Great American Insurance Company"){
          this.ex_MailTo = null;
          this.ex_MailToAddress = null; 
        }
        return false;
      }
  }

  function printCheck(inCheck:Check)
    {
      for(payment in inCheck.Payments)
      {
        //changed to logging in Debug - SR
        Logger.logDebug("****BEGIN PAYMENT****")
        Logger.logDebug("CostType = " + payment.CostType)
        Logger.logDebug("CostCategory = " + payment.CostCategory)
        Logger.logDebug("Amount = " + payment.Amount)
        Logger.logDebug("Exposure = " + payment.Exposure)
        Logger.logDebug("****END PAYMENT****")
      }
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
  function hasPayeeBackupWithholding():boolean{
    if(exists(payee in this.Payees where payee.Payee.Ex_TaxStatusCode.Code ==  "B" and payee.PayeeType.DisplayName == "Vendor")){
      return true;
    }
    else{
   
      return false;
    }
  }

  function setMemo(){
    this.Memo = ""; 
  }

  /*Verifies that the payee is one of the accepted payee types
    Sprint/Maintenance Release: EM 10 - Defect 1104
    Author: Kris Boyd
    Date: 5/9/08
    Updated: -
  */
  function validPayeeTypes() : List{
    var payeeList : List = new ArrayList()
    for(payee in this.Payees){//loop through all payees on the check
      //Valid payee types are claimant, coveredparty, formercoverredparty, vendor, AdditionalInterestRisk, formerinsured, insured and lienholder
      if(payee.PayeeType != "claimant" and payee.PayeeType != "coveredparty" 
        and payee.PayeeType != "insured" and payee.PayeeType != "lienholder" 
        and payee.PayeeType != "AdditionalInterestRisk" and payee.PayeeType != "vendor" and payee.PayeeType != "doingbusinessas" 
        and payee.PayeeType != "guardianadlitem"){
        //If not valid add this payee to the list
        payeeList.add(payee);
      }//end payee check
    }//end payee loop
  
    //List will be empty if all payees are valid, other wise list the payees that are not valid
    return payeeList;
  }

  /*Check to see if the check should be reportable, return true if it is.
    Sprint/Maintenance Release: EM 11 - Defect 685
    Author: Kris Boyd
    Date: 6/6/08
    Updated: Removed the expense requirement per Karen - 6/25/08
  */
  function reportable() : boolean{
    if(exists(payee in this.Payees where payee.PayeeType == "vendor")){ //and exists(payments in this.Payments where payments.CostType == "expense")){
      return true;
    }
    return false
  }

  /*
    Defect 3719
    Removing restrictions on who can be paid in ClaimCenter with the following exceptions:
    Former contacts, contacts with subtypes of Legacy Vendor Company,
    Vendors who are not link and sync and marked as payable will not show up in the payee dropdown list
    Commentted out the old getPayeeClaimContacts function for posterity just in case we might need
    to revert.
    Author: mmanalili
    Date: 1/26/11
 
  */

  /*function getPayeeClaimContacts():List {
    var payeeList = new ArrayList(); 
  
    for(contact in this.Claim.getRelatedContacts()) {
      var claimCont : ClaimContact = this.Claim.getClaimContact( contact );
 
      if(claimCont != null) {
        if(claimCont.Contact.Subtype!="LegacyVendorCompanyExt"
          and (!exists(role in claimCont.Roles where role.isFormerRole()))
          and (claimCont.CompanyVendor == null or (claimCont.CompanyVendor.PayableExt==true and claimCont.CompanyVendor.gaic_LinkedAndSynced()))
          and (claimCont.PersonVendor == null  or (claimCont.PersonVendor.PayableExt==true and claimCont.PersonVendor.gaic_LinkedAndSynced()))) {
            payeeList.add( claimCont.Contact )
        }
      }
    }
    return payeeList;
  }*/

/*Populate the payee list with only valid payees. Defect - 9030
  
  */

 function getPayeeClaimContacts():List {
   var payeeList = new ArrayList(); 
   var claimRelatedContacts = this.Claim.getRelatedContacts().where(\ c -> c.Subtype!="LegacyVendorCompanyExt")

   for(contact in claimRelatedContacts) {
     var claimCont : ClaimContact = this.Claim.getClaimContact(contact)
     if(claimCont != null and claimCont.Roles != null and claimCont.Roles.countWhere(\ ccr -> !ccr.isFormerRole()) > 0){
       var isvalidClmContact : boolean = 
         (claimCont.CompanyVendor == null or (claimCont.CompanyVendor.PayableExt==true and claimCont.CompanyVendor.AddressBookUID!=NULL))
          and (claimCont.PersonVendor == null  or (claimCont.PersonVendor.PayableExt==true and claimCont.PersonVendor.AddressBookUID!=NULL))
       if(claimCont != null && isvalidClmContact){
         payeeList.add(claimCont.Contact) 
       }
     }
   }
   return payeeList;
 }

 // Defect 9171 : Checks for closed vendors selected as Check Payee in NewCheckWizard
  function throwClosedDateError(chkpayee: CheckPayee){ 
    if (chkpayee.Payee.CloseDateExt != null) 
    throw new DisplayableException(displaykey.Validation.NewCheckWizard.ClosedDate)
   }
 
  /*Populate a the payee list with only valid payees.
    Sprint/Maintenance Release: EM 10 - Defect 525
    Author: Zach Thomas
    Date: 6/25/08
    Updated : 12/2/2008 - zthomas - Defect 1361, Commented out original Claim.Contacts array.  
              Instead using sorted Claim.getRelatedContacts then finding the matching ClaimContact for each Contact.
  */

  //function getPayeeClaimContacts():List{
  //  var payeeList = new ArrayList(); 
  //  
  //  //for(claimCont in this.Claim.Contacts){// Loop through claim contacts
  //  for(contact in this.Claim.getRelatedContacts()){// Loop through related contacts
  //    //var claimContQuery = find(cont in ClaimContact where cont.Contact == contact)// Find matching ClaimContact
  //    //var claimCont : ClaimContact = claimContQuery.getAtMostOneRow()
  //    var claimCont : ClaimContact = this.Claim.getClaimContact( contact );
  //    // Prevent blank claimcontact
  //    if(claimCont != null){
  //      // Don't allow agency in payee list.
  //      if(claimCont.hasRole( "agency" ) and claimCont.Contact.Subtype!="LegacyVendorCompanyExt"
  //      and (!exists(role in claimCont.Roles where role.isFormerRole()))
  //      and (claimCont.CompanyVendor == null or (claimCont.CompanyVendor.PayableExt==true and claimCont.CompanyVendor.gaic_LinkedAndSynced()))  
  //      and (claimCont.PersonVendor == null  or (claimCont.PersonVendor.PayableExt==true and claimCont.PersonVendor.gaic_LinkedAndSynced()))){
  //        // Add payee to list if suggested payee type is an allowed payee type.
  //        if(exists(allowedRole in this.getAllowedPayeeTypes( claimCont.Contact ) where allowedRole == this.getSuggestedPayeeType( claimCont.Contact ))){
  //          payeeList.add( claimCont.Contact )
  //        }
  //        // Some contacts have "other" as the suggested payee type when they are actually allowed, add those contacts to the payee list.    
  //        if(this.getSuggestedPayeeType(claimCont.Contact) == "other"){
  //          //Add payee to list if actual role is an allowed role
  //          if(exists(allowedRole in this.getAllowedPayeeTypes( claimCont.Contact ) where exists(actualRole in claimCont.Roles where allowedRole == actualRole.Role))){
  //            payeeList.add( claimCont.Contact )
  //          }
  //        }
  //      }
  //    }// End Contact Loop
  //  }  
  //  return payeeList;
  //}


  /*Function that sets all the history information for a check - kmboyd - defect 1294 - 11/10/08*/
  function setCheckHistoryInfo(){
    setMailTo();
    setPayees();
    setClaimant();
  }

  function setMailTo(){
    if(this.New || this.Editable || this.Bulked){  
      if(!this.Bulked){
        this.MailTo = this.ex_MailTo.DisplayName
      }
      this.MailToAddress = this.ex_MailToAddress.AddressType + "|" + this.ex_MailToAddress.AddressLine1 + "|" + this.ex_MailToAddress.AddressLine2 + "|" + this.ex_MailToAddress.Country
      + "|" + this.ex_MailToAddress.City + "|" + this.ex_MailToAddress.State + "|" + this.ex_MailToAddress.PostalCode + "|" + this.ex_MailToAddress.PublicID
      + "|" + this.ex_MailToAddress.County + "|" + this.ex_MailToAddress.Description
    }
  }

  /*Sets 3 string variables that are \n delimited. This are for display on the Check Details screen. It is a set of history
  strings that will not change after a check has been issued. kmboyd - Defect 1294 - 11/10/08*/
  function setPayees() {
    //var date=(new SimpleDateFormat("M-d-yyyy")).format(gw.api.util.DateUtil.currentDate())
    this.IssuedPayeesExt = ""
    this.IssuedPayeeTypesExt = ""
    this.IssuedPayeeTaxIDExt = ""
    //this.IssuedPayeeDateAddedExt = ""
    for(payee in this.Payees){
      if(this.IssuedPayeesExt != null){
        this.IssuedPayeesExt = this.IssuedPayeesExt + "\n" + payee.ClaimContact.Contact
        this.IssuedPayeeTypesExt = this.IssuedPayeeTypesExt + "\n" + payee.PayeeType.DisplayName
        this.IssuedPayeeTaxIDExt = this.IssuedPayeeTaxIDExt + "\n" + payee.ClaimContact.Contact.TaxID      
        //this.IssuedPayeeDateAddedExt = this.IssuedPayeeDateAddedExt + "\n" + date
      }else{
        this.IssuedPayeesExt = payee.ClaimContact.Contact.toString()
        this.IssuedPayeeTypesExt = payee.PayeeType.DisplayName
        this.IssuedPayeeTaxIDExt = payee.ClaimContact.Contact.TaxID   
        //this.IssuedPayeeDateAddedExt = date
      }
    }
    //if(!this.Bulked){
      this.IssuedPayToAddressExt = this.ex_PayToAddress.AddressType + "|" + this.ex_PayToAddress.AddressLine1 + "|" + this.ex_PayToAddress.AddressLine2 + "|" + this.ex_PayToAddress.Country
      + "|" + this.ex_PayToAddress.City + "|" + this.ex_PayToAddress.State + "|" + this.ex_PayToAddress.PostalCode + "|" + this.ex_PayToAddress.PublicID
      + "|" + this.ex_PayToAddress.County + "|" + this.ex_PayToAddress.Description
    //}
  }

  function setClaimant(){
    this.IssuedClaimantExt = this.ClaimContact.DisplayName
  }
  /*
  Check to see if tax reportability has been changed to not reportable while the backup withholding 
  flag is set to true. If so, the backup withholding flag will be set to false. 
  Author: Jennifer Miller
  Date: 7/31/08
  Updated: 
  */
  function resetBackupWithholdingFlag(inCheck:Check)
    {
          if(inCheck.Reportability == "notreportable" && inCheck.BackupWithholdingCheckExt == true)
          {
          // Sending Offset messages to Box04 and Box07 on Taxport1099 
             //inCheck.BackupWithholdingCheckExt = false
          }
    }
  //Gets next available number and stores in CheckNumber field. If the Checknumber is already filled,
  //then the number generator won't fire.  
  function getEFTReferenceNumber(inBank:String){
    var x = ""
    if (this.CheckNumber == null){
       x = util.UniqueNumberGenerators.generateEFTCheckNumber( inBank )
      this.CheckNumber = x
    }
  }

  //Function filters out the delivery types for checks and eft's
  //jlmiller EC sprint 3
  function getDeliveryType(type : String) : boolean {
      if (this.PaymentMethod == "eft")
      {
        if(type == "send" or type == "email")
        {
          return true;
        }
        else{
          return false;
         }
      }else{     
          return true;     
      }
  }


  //Function filters out the manual check type for use on the regualr checks/eft wizard
  //jlmiller EC sprint 3
  function getPaymentMethods(type : String) : boolean {
    
        if(type == "manual")
        {
          return false;
        }
        else{
          return true;
         }
    
    
  }
  function checkEditable():boolean{
    if(this.Status == "draft" or this.Status == "pendingapproval" or this.Status == "awaitingsubmission" or this.Status == "rejected" or this.Status == "notifying"){
      return true;    
    }
    return false;
  }

  // 12/1/2008 - zthomas - Defect 1220, Added function to determine which radio button to have selected on New Check Wizard Screen.
  function checkDateOfService() : Boolean{
    if(this.DateOfService != null and this.ServicePdStart == null and this.ServicePdEnd == null) {
      return true;
    }else if((this.ServicePdStart != null or this.ServicePdEnd != null) and this.DateOfService == null){
      return false;
    }else{
      return true;
    }
  }

  //Function to parse the check history primary payee address field
  //Added validation to see if the address string is blank and also put in checks for each individual field to make sure they
  //didn't throw an ElementNotFound excetpion - kmboyd - 3/13/09
  //8/27/2009 - zjthomas - Defect 2247, added checks around state and postal code to prevent null from displaying on the pcf.
  private function getAddressHistory(addressHistoryString : String) : Address{
    var addy:Address
    if(addressHistoryString != null and addressHistoryString != ""){
      addy = new Address();
      var st : java.util.StringTokenizer = new java.util.StringTokenizer(addressHistoryString, "|");
          //print(st.countTokens())
          //print(addressHistoryString)
      var token : String = ""
      
      if(st.hasMoreTokens()){
        token = st.nextToken()
        for(type in AddressType.getTypeKeys(false)){
          if(type.DisplayName == token){
            addy.AddressType = type
          }
        }
      }else{
        addy.AddressType = null;
      }
  
      if(st.hasMoreTokens()){
        token = st.nextToken()
        if(token != "null"){
          addy.AddressLine1 = token;
        }
      }else{
        addy.AddressLine1 = "";
      }
  
      if(st.hasMoreTokens()){
        token = st.nextToken()
        if(token != "null"){
          addy.AddressLine2 = token;
        }
      }else{
        addy.AddressLine2 = "";
      }
  
      if(st.hasMoreTokens()){
        token = st.nextToken()
        if(token != "null"){        
          addy.Country = token;
        }
      }else{
        addy.Country = null;
      }
  
      if(st.hasMoreTokens()){
        token = st.nextToken()
        if(token != "null"){   
          addy.City = token;
        }
      }else{
        addy.City = "";
      }
  
      /* 2/4/2014 - dcarson2 - Defect 6722 - fixed for null and "null" */
            if(st.hasMoreTokens()){
        token = st.nextToken()
        if(token != null and !token.equals("null")){
          for(type in State.getTypeKeys(false)){
            if(type == token){
              addy.State = type
            }
          }
        }
      }else{
        addy.State = null;
      }
  
      if(st.hasMoreTokens()){
        token = st.nextToken()
        if(token != "null"){
          addy.PostalCode = token;
        }
      }else{
        addy.PostalCode = "";
      }
    
      if(st.hasMoreTokens()){
        addy.PublicID = st.nextToken()
      }else{
        addy.PublicID = "";
      }
    }
    return addy;
  }

//defect 6107 (4/'13)- if statement linking payee address to address history which will then cause payee address to change if new address input for manual draft
// rvw with Doug D. and Ryan determined that no need for manual conditions to be present in this function - same removed 
  public function getPrimaryPayeeHistoryAddress() : Address {
    var addy:Address = null
    if(this.Bulked) {
      addy = this.PayToAddressOwner.Address
    } else {
      addy = getAddressHistory(this.IssuedPayToAddressExt)
    }
    return addy
  }

  

  public function getMailToHistoryAddress() : Address {
    var addy:Address = null
    if(this.Bulked){
      addy = this.ex_MailToAddress
    } else {
      addy = getAddressHistory(this.MailToAddress);
    }
    return addy
  }

  public function getPayeeAddyMatchingCheck(payTo:String, addy : Address) : String {
    var addyAsString = ""
    var payToString:String[] = null
  
    if(payTo!=null){
      payToString = util.StringUtils.splitName( payTo )
      addyAsString = addyAsString + payToString[0] + "\n"
      if(payToString[1].length()!=0){
        addyAsString = addyAsString + payToString[1] + "\n"
      }
    }
    if(addy!=null){
      if(addy.AddressLine1!=null){
        addyAsString = addyAsString + addy.AddressLine1 + "\n"      
      }
      if(addy.AddressLine2!=null){
        addyAsString = addyAsString + addy.AddressLine2 + "\n"      
      }
      if(addy.City!=null){
        addyAsString = addyAsString + addy.City    
      }
      if(addy.State!=null){
        addyAsString = addyAsString  + ", " + addy.State + " "     
      }else{
        addyAsString = addyAsString + " "
      }
      if(addy.PostalCode!=null){
        addyAsString = addyAsString + addy.PostalCode     
      }
    }
  
    return addyAsString;
  }

  public function getMemoMatchingCheck() : String{
    var checkMemo = ""
    var lastIndex:int = 0
    var memoLineOne = ""
    var memoLineTwo = ""
  
    if(this.Memo!=null){
      if(this.Memo.length() < 75){
        checkMemo = this.Memo
      } else {
        lastIndex = this.Memo.lastIndexOf( " ", 75 )
        if(lastIndex < 0){
          memoLineOne = this.Memo.substring(0, 75)
          memoLineTwo = this.Memo.substring(75, this.Memo.length())
        } else {
          memoLineOne = this.Memo.substring(0, lastIndex)
          memoLineTwo = this.Memo.substring(lastIndex + 1, this.Memo.length())
          if(memoLineTwo.length() > 75){
            memoLineTwo = memoLineTwo.substring(0, 75)
          }
        }
        checkMemo = memoLineOne + "\n" + memoLineTwo
      }
    }
  
    return checkMemo
  }


  public function getPayToAppearingOnCheck():String{
  if(this.Bulked && this.PayTo != null   &&  this.PayToLine1Ext == null){
        return StringUtil.toUpperCase(this.PayTo)
     }else{
        var payToString:String = "";

        if(this.PayToLine1Ext != null){
          payToString = payToString + this.PayToLine1Ext + "\n";
        }
        if(this.PayToLine2Ext != null){
          payToString = payToString + this.PayToLine2Ext + "\n";
        }
        if(this.PayToLine3Ext != null){
          payToString = payToString + this.PayToLine3Ext + "\n";
        }
        if(this.PayToLine4Ext != null){
          payToString = payToString + this.PayToLine4Ext + "\n";
        }
        if(this.PayToLine5Ext != null){
          payToString = payToString + this.PayToLine5Ext + "\n";
        }
        if(this.PayToLine6Ext != null){
          payToString = payToString + this.PayToLine6Ext + "\n";
        }     
         return payToString.toUpperCase();
      }
  }

  public function setCheckPayTo(){
    var payToString:String = "";
  
    if(this.PayToLine1Ext != null){
      payToString = payToString + this.PayToLine1Ext + " ";
    }
    if(this.PayToLine2Ext != null){
      payToString = payToString + this.PayToLine2Ext + " ";
    }
    if(this.PayToLine3Ext != null){
      payToString = payToString + this.PayToLine3Ext + " ";
    }
    if(this.PayToLine4Ext != null){
      payToString = payToString + this.PayToLine4Ext + " ";
    }
    if(this.PayToLine5Ext != null){
      payToString = payToString + this.PayToLine5Ext + " ";
    }
    if(this.PayToLine6Ext != null){
      payToString = payToString + this.PayToLine6Ext;
    }
  
    this.PayTo = payToString;
  }

  /* 
  * Display only the first line of the Pay To The Order Of field, the other lines will be denoted by * if multiple lines exist.
  * Sprint/Maintenance Release: EM 16 - Defect 2570
  * Author: Zach Thomas
  * Date: 11/9/09
  */
  public function getCheckSummaryPayTo():String{
    if(this.PayToLine1Ext != null and (this.PayToLine2Ext != null or this.PayToLine3Ext != null or
      this.PayToLine2Ext != null or this.PayToLine2Ext != null or this.PayToLine2Ext != null)){
      return this.PayToLine1Ext + " *"
    }else{
      return this.PayTo
    }
  }

  public function setAccount() : void {
    if(this.TypeOfCheckExt == "us_check")
      this.BankAccount = "national_city"
    
    if(this.TypeOfCheckExt == "canadian_check")
      this.BankAccount = "royal_bank_of_canada"
  }
  
  function setCheckData(copyPayToAddy:Boolean) : void {
    this.setAddressType(this.ex_PayToAddress); 
    this.checkForSameAddy(copyPayToAddy); 
    if(this.ex_MailToAddress.New){
      this.setAddressType(this.ex_MailToAddress)
    }
//    if(!this.ManualCheck){      
//    if(copyPayToAddy==null)        
//         this.setBankAccount()          
//    if(this.ex_PayToAddress.Country != "CA")   
//     this.setBankAccount()     
//    }
  }
  
  //defaults the mailing address type of new addresses	
  function setAddressType(addy : Address){
    if(addy.New and addy.AddressType == null){
      addy.AddressType = "mailing";
    }
  }
		
  //checks to see if the addresses become different and the same as payee address box should be unchecked.
  function checkForSameAddy(copyPayToAddy:Boolean){
    if(copyPayToAddy and this.Payees.length > 0 and 
    (this.ex_PayToAddress != this.ex_MailToAddress or this.Payees[0].Payee != this.ex_MailTo)){
      copyPayToAddy = false
      this.checkMailToAddy(copyPayToAddy)
    }
  }

  //update or reset mail to person and address
  //Triggers when the "Same as primary Payee" checkbox is changed
  function checkMailToAddy(copyPayToAddy:Boolean){
    this.ex_MailToAddress = null
    this.ex_MailTo = null
    if(copyPayToAddy){
      this.ex_MailToAddress=this.ex_PayToAddress
      this.ex_MailTo = this.Payees[0].Payee
      this.AttentionMailToExt = ""
      
      if(this.ex_PayToAddress.City.length>25){
        this.ex_MailToAddress.City=this.ex_PayToAddress.City.substring(0,25)
        throw new DisplayableException("Primary Payee and Mail to Name City "+ this.ex_PayToAddress.City.trim() + " exceeds the max 25 character field length. Review the truncated fields and make necessary adjustments before proceeding.")
      }
    }
  }
  
  function setClaimantDuringEdit() {
    if(this.Payments.length > 0){
      for(payment in this.Payments){
        this.Claimant = payment.Exposure.getClaimContactByRole( "claimant" ).Contact
      }
    }
  }
  
  //Calls the GeneralErrorWorksheet.  Displays the Canadian Address Warning:
  //This payee has a Canadian address.  Please select the appropriate Check Type to determine if you want a anadian check or a U.S. Check issued
  function getCanadianAddressWarning() {
    pcf.GeneralErrorWorksheet.goInWorkspace(displaykey.Validator.Check.CanadianAddress.Warning.Message(this.Claim.Policy.CurrencyTypeExt));
  }
  
  //If the Mail To Address Country field has a value and the Primary Payee Country is Canada 
  //call the Canadian Address Warning
  function canadianAddressFieldCheckForMailTo() {
    if(this.Status != TransactionStatus.TC_PENDINGAPPROVAL && this.Status!=TransactionStatus.TC_AWAITINGSUBMISSION && this.Status!=TransactionStatus.TC_REJECTED){
    if(this.ex_MailToAddress.Country != null and this.Claim.Policy.CurrencyTypeExt!="usd") {
      getCanadianAddressWarning();
    }
    }
  }
  
  //Function is called in the new section. The function checks the Primary Payee address is canadian then
  //call the Canadian Address Warning
  function canadianAddressFieldCheckForPrimaryPayee() {
    
     if(this.Status != TransactionStatus.TC_PENDINGAPPROVAL && this.Status!=TransactionStatus.TC_AWAITINGSUBMISSION && this.Status!=TransactionStatus.TC_REJECTED){
    if(this.Claim.Policy.CurrencyTypeExt!="usd")
      getCanadianAddressWarning();
  }
  }
   /*   public function populateCheckMemo(checkMemo:String, prevInvoiceNumber:String, prevInvoiceDate:DateTime)
  separated into InvoiceNumber and InvoiceDate functions due to defect 5935 - March 2013
   
   public function populateCheckMemo(checkMemo:String, prevInvoiceNumber:String, prevInvoiceDate:DateTime) {
    
    if(this.Claim.LossType=="EXECLIABDIV" or this.Claim.LossType=="PROFLIABDIV"){
      var dateFormat : java.text.SimpleDateFormat = new java.text.SimpleDateFormat("MM/dd/yyyy")
      var currentString:String = null
      var previousString:String = null
      
      if(this.InvoiceNumber != null && this.InvoiceDateExt != null){
        currentString = "Invoice " + this.InvoiceNumber + ", Date of Invoice: " + dateFormat.format(this.InvoiceDateExt)
      }
      if(this.InvoiceNumber != null && this.InvoiceDateExt == null){
        currentString = "Invoice " + this.InvoiceNumber
      }
      if(this.InvoiceNumber == null && this.InvoiceDateExt != null){
        currentString = "Date of Invoice: " + dateFormat.format(this.InvoiceDateExt)
        }
      
      if(prevInvoiceNumber != null && prevInvoiceDate != null){
        previousString = "Invoice " + prevInvoiceNumber + ", Date of Invoice: " + dateFormat.format(prevInvoiceDate)
        }
      if(prevInvoiceNumber != null && prevInvoiceDate == null){
        previousString = "Invoice " + prevInvoiceNumber
      }
      if(prevInvoiceNumber == null && prevInvoiceDate != null){
        previousString = "Date of Invoice: " + dateFormat.format(prevInvoiceDate)
      }
    
      if(previousString != null and currentString != null and checkMemo != null){
        this.Memo = checkMemo.replaceAll(previousString, currentString)
      }else{
        if (checkMemo != null && currentString != null){
          this.Memo = checkMemo + " " + currentString
      }
        else if (checkMemo != null && currentString == null){
          this.Memo = checkMemo.replaceAll(previousString, "")
        }else{
          this.Memo = currentString
      }
      }
    }
  }

   */
  
  /* Defect 6885: cmullin - 5.14.14 - separated Specialty E&S code from PLD/ELD to accomodate custom Check Memo requirements
   * WORKCOMP: dnmiller 03.02.15 - added Worker's Comp checks on Medical and Vocational Rehab features
  */  
    public function populateCheckMemoInvoiceNumber(checkMemoInvoiceNumber:String, prevInvoiceNumber:String) {
      var currentString:String = null
      var previousString:String = null
      if(this.Claim.LossType=="EXECLIABDIV" or this.Claim.LossType=="PROFLIABDIV" or this.Claim.LossType == LossType.TC_MERGACQU or this.Claim.LossType == LossType.TC_SPECIALHUMSERV){
        if(this.InvoiceNumber != null){
          currentString = "Invoice: " + this.InvoiceNumber 
        }
        if(prevInvoiceNumber != null){
          previousString = "Invoice: " + prevInvoiceNumber 
        }
        if(previousString != null and currentString != null and checkMemoInvoiceNumber != null){
          this.Memo = checkMemoInvoiceNumber.replaceAll(previousString, currentString)
        }else{
          if (checkMemoInvoiceNumber != null && currentString != null){
            this.Memo = checkMemoInvoiceNumber + ", " + currentString
          }else if (checkMemoInvoiceNumber != null && currentString == null){
            this.Memo = checkMemoInvoiceNumber.replaceAll(previousString, "")
            }else{
              this.Memo = currentString
            }
        }
      }else if(this.Claim.LossType=="SPECIALTYES" and (this.FirstPayment.CostType == "expense" or this.FirstPayment.CostType == "gaiastpaexpense")){
        if(this.InvoiceNumber != null){
          currentString = ", Invoice: " + this.InvoiceNumber 
        }
        if(prevInvoiceNumber != null){
          previousString = ", Invoice: " + prevInvoiceNumber 
        }
        if(previousString != null and currentString != null and checkMemoInvoiceNumber != null){
          this.Memo = checkMemoInvoiceNumber.replaceAll(previousString, currentString)
        }else{
          if (checkMemoInvoiceNumber != null && currentString != null){
            this.Memo = checkMemoInvoiceNumber + currentString
          }else if (checkMemoInvoiceNumber != null && currentString == null){
            this.Memo = checkMemoInvoiceNumber.replaceAll(previousString, "")
          }else{
            this.Memo = currentString
          }
        }
      }else if(util.WCHelper.isWCorELLossType(this.Claim) && (this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS 
       or this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_VOCATIONAL_REHAB)){
       this.Memo = populateWCMemoInvoiceNum(checkMemoInvoiceNumber, prevInvoiceNumber)
      }
    }

   public function populateWCMemoInvoiceNum(checkMemoInvoiceNumber:String, prevInvoiceNumber:String): String{
     var currentString:String = null
     var previousString:String = null
     if (this.Payments.first().Exposure.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS || this.Payments.first().Exposure.ExposureType == ExposureType.TC_WC_VOCATIONAL_REHAB){
       if (this.Memo == null || this.Memo.contains("Invoice Number ") || this.Memo.contains("Dates of Service") || this.Memo.contains("Date of Service")){
         if(this.InvoiceNumber != null){
           currentString = "Invoice Number " + this.InvoiceNumber
           if (this.Memo != null && (this.Memo.contains(",") || this.Memo.contains("Dates of Service") || this.Memo.contains("Date of Service"))){
             currentString = currentString + ", "
           }
         }
         if(prevInvoiceNumber != null){
           previousString = "Invoice Number " + prevInvoiceNumber
           if (this.Memo != null && this.Memo.contains(",")){
             previousString = previousString + ", "
           }
         }
         if(previousString != null and currentString != null and checkMemoInvoiceNumber != null  && previousString != currentString){
           return checkMemoInvoiceNumber.replace(previousString, currentString)
         }else{
           if (checkMemoInvoiceNumber != null && currentString != null && previousString != null){ //&& checkMemoInvoiceNumber.contains("Service")
             if (this.ServicePdEnd == null && this.ServicePdStart == null && currentString.contains(",")){
               return currentString.replace(",", "")
             }else{
               return currentString
             }
           }else if ( this.Memo != null && currentString != null && this.Memo.contains(currentString)){
             return this.Memo
           }else if (checkMemoInvoiceNumber != null && !checkMemoInvoiceNumber.contains("Invoice Number") && currentString != null && !currentString.contains(checkMemoInvoiceNumber)){
             return currentString + checkMemoInvoiceNumber
           }else if (checkMemoInvoiceNumber != null && currentString == null){
             return checkMemoInvoiceNumber.replace(previousString, "")
           }else if (checkMemoInvoiceNumber == null && currentString == null){
             return ""
           }
           else{
             return "Invoice Number " + this.InvoiceNumber
           }
         }
       }
     }
     return this.Memo
   }
    
    public function populateCheckMemoInvoiceDate(checkMemoInvoiceDate:String, prevInvoiceDate:DateTime) {
    print("populateCheckMemoInvoiceDate - " + this.Claim.LossType)
    if(this.Claim.LossType=="EXECLIABDIV" or this.Claim.LossType=="PROFLIABDIV" or this.Claim.LossType == LossType.TC_MERGACQU or this.Claim.LossType == LossType.TC_SPECIALHUMSERV){
      var dateFormat : java.text.SimpleDateFormat = new java.text.SimpleDateFormat("MM/dd/yyyy")
      var currentString:String = null
      var previousString:String = null
      
      if(this.InvoiceDateExt != null){
        currentString = "Date of Invoice: " + dateFormat.format(this.InvoiceDateExt)
      }
     
      
      if(prevInvoiceDate != null){
        previousString = "Date of Invoice: " + dateFormat.format(prevInvoiceDate)
        }
    
    
      if(previousString != null and currentString != null and checkMemoInvoiceDate != null){
        this.Memo = checkMemoInvoiceDate.replaceAll(previousString, currentString)
      }else{
        if (checkMemoInvoiceDate != null && currentString != null){
          this.Memo = checkMemoInvoiceDate + ", " + currentString
      }
        else if (checkMemoInvoiceDate != null && currentString == null){
          this.Memo = checkMemoInvoiceDate.replaceAll(previousString, "")
        }else{
          this.Memo = currentString
      }
      }
    }
  }
  
  function getDisplayNameWithoutFormer(name:String):String{
 
 var displayName= util.StringUtils.getStringValue(name)  
   if(displayName!="" && displayName.contains("(Former)")){
    return displayName.remove("(Former)")
  }else{
    return displayName
  }
}

function getDisplayNameWithoutFormerAndClosed(name:String):String{
   var displayName= util.StringUtils.getStringValue(name)
  
   if(displayName!="" && displayName.contains("(Closed)")){
    displayName = displayName.remove("(Closed)")
   }
   if(displayName!="" && displayName.contains("(Former)")){
    displayName = displayName.remove("(Former)")
   } 
   return displayName
}
  
   /*2015 WORKCOMP - dnmiller - Added functions to populate the check memo based on Service Date(s)*/
   public function populateCheckMemoServiceDate(checkMemoServiceDate:String, prevServiceDate:DateTime): String {
    //print("populateCheckMemoInvoiceDate - " + this.Claim.LossType)
    if(util.WCHelper.isWCorELLossType(this.Claim) && (this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS
     or this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_VOCATIONAL_REHAB )){
     //or this.FirstPayment.CostType == CostType.TC_EXPENSE)){
      var dateFormat : java.text.SimpleDateFormat = new java.text.SimpleDateFormat("MM/dd/yyyy")
      var currentString:String = null
      var previousString:String = null
      
      
      if(this.DateOfService != null && checkMemoServiceDate != null && checkMemoServiceDate.contains("Invoice Number")){
        currentString = ", Date of Service " + dateFormat.format(this.DateOfService)
      }else if(this.DateOfService != null && (checkMemoServiceDate == null || !checkMemoServiceDate.contains("Invoice Number"))){
        currentString = "Date of Service " + dateFormat.format(this.DateOfService)
      }
      
      if(prevServiceDate != null && (this.Memo == null || !this.Memo.contains("Invoice Number"))){
        previousString = "Date of Service " + dateFormat.format(prevServiceDate)
      }else if (prevServiceDate != null && this.Memo.contains("Invoice Number")){
        previousString = ", Date of Service " + dateFormat.format(prevServiceDate)
      }
    
      return replaceServiceDates(previousString, currentString, checkMemoServiceDate)
    }
    return this.Memo
  }
  
  public function populateCheckMemoDatesOfService(checkMemo:String, prevStart: DateTime, prevEnd: DateTime): String{
    if(util.WCHelper.isWCorELLossType(this.Claim) && (this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS
     or this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_VOCATIONAL_REHAB )){
     //or this.FirstPayment.CostType == CostType.TC_EXPENSE)){
      var dateFormat : java.text.SimpleDateFormat = new java.text.SimpleDateFormat("MM/dd/yyyy")
      var currentString:String = null
      var previousString:String = null
      
      if (this.ServicePdStart != null && this.ServicePdEnd != null && this.InvoiceNumber == null){
        currentString = "Dates of Service " + dateFormat.format(this.ServicePdStart) + " - " + dateFormat.format(this.ServicePdEnd)
      }else if (this.ServicePdStart != null && this.ServicePdEnd != null && this.InvoiceNumber != null){
        //Need to add comma if Invoice Number 
        currentString = ", Dates of Service " + dateFormat.format(this.ServicePdStart) + " - " + dateFormat.format(this.ServicePdEnd)
      }
      
      if (checkMemo == null){
        previousString = ""
      }else if (prevStart != null && prevEnd != null && !checkMemo.contains("Invoice Number")){
        previousString = "Dates of Service " + dateFormat.format(prevStart) + " - " + dateFormat.format(prevEnd)
      }else if (prevStart != null && prevEnd != null && checkMemo.contains("Invoice Number")){
        previousString = ", Dates of Service " + dateFormat.format(prevStart) + " - " + dateFormat.format(prevEnd)
      }
      return replaceServiceDates(previousString, currentString, checkMemo)

    }
    else if (this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS && this.DOSTypeExt == DateOfServiceExt.TC_RECURRING){
      return getReplacementRecurringMemo(prevStart, prevEnd, this.Memo)
    }
    return this.Memo
  }
  
  /*2015 WORKCOMP - dnmiller - helper function for populating the Check Memo with the Service Date or Service Dates */
  private function replaceServiceDates(previousString: String, currentString: String, checkMemo: String): String{
    if (previousString == currentString){
      return this.Memo
    }
    if(previousString != null && currentString != null && previousString != currentString && checkMemo != null){
      return checkMemo.replaceAll(previousString, currentString)
     //need this else if for recurring check where previous will be same as current
    }else if (previousString==currentString && currentString != null && (checkMemo == null || !checkMemo.contains(currentString))){
      return checkMemo + currentString
    }else{
        if (checkMemo != null && checkMemo.contains("Invoice Number") && currentString != null){
          return checkMemo + currentString
        }else if (checkMemo != null && !checkMemo.contains("Invoice Number") && currentString != null){
          return checkMemo + " " + currentString
        }else if (checkMemo != null && currentString == null && previousString != null){
          return checkMemo.replaceAll(previousString, "")
        }else if (checkMemo == null && currentString != null){
          return currentString
        }
      }
      return this.Memo
  }
  
  private function getReplacementRecurringMemo(prevStart:DateTime, prevEnd:DateTime, memo: String): String{
    var returnString = memo
    var prevDates = getDateString(prevStart, prevEnd)
    var newDates = getDateString(this.ServicePdStart, this.ServicePdEnd)
    
    if (memo !=null && returnString.contains(prevDates) && prevDates != ""){
      returnString = returnString.replace(prevDates, newDates)
    }
    else if ((memo !=null && returnString.contains(prevDates) && prevDates == "")){ //  combine with next else if condition
      returnString = this.getInjuryString() + " " + newDates
    }
    else if (memo != null && !returnString.contains(prevDates)){
      returnString = returnString + " " + newDates
    }
    else if (memo == null){
      returnString = newDates
    }
    return returnString
  }
    
  private function getDateString(date1: DateTime, date2: DateTime): String {
    var dateFormat : java.text.SimpleDateFormat = new java.text.SimpleDateFormat("MM/dd/yyyy")
    var dateString = ""
    // need to not return the dates for 08 - Death Benefits
    if (this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_COMPROMISEDEATH){
      return " "
    }
    // Auto-fill the Service Dates in the Memo
    if (date1 == null && date2 == null){
      dateString = "<MM/DD/YY>" + " Through " + "<MM/DD/YY>"
    }
    else if (date1 != null && date2 == null){
      dateString = dateFormat.format(date1) + " Through " + "<MM/DD/YY>"
    }
    else if (date1 != null && date2 != null){
      dateString = dateFormat.format(date1) + " Through " + dateFormat.format(date2)
    }
    return dateString
  }
  
  /* WORKCOMP - dnmiller - Function to set the Check Memo for recurring checks.
   *                       Need to go back and replace MM/DD/YY with the service start and end dates. */
  public function setWCMemo(wcDOS: DateOfServiceExt): String{
    var dateFormat : java.text.SimpleDateFormat = new java.text.SimpleDateFormat("MM/dd/yyyy")
    if (this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS || this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_VOCATIONAL_REHAB){
        if (this.InvoiceNumber != null){
    //      if (this.Memo == null || (this.Memo != null && !this.Memo.contains("Invoice Number"))){
            this.Memo = populateWCMemoInvoiceNum(this.InvoiceNumber, null)
    //      }
        } 
        if (this.DOSTypeExt == DateOfServiceExt.TC_DATEOFSERVICE){
          if (this.Memo == null || (this.Memo != null && this.DateOfService != null && !this.Memo.contains(dateFormat.format(this.DateOfService)))){
            return populateCheckMemoServiceDate(this.Memo, null)
          }
        } else {
          if (this.Memo == null || (this.Memo != null && this.ServicePdStart != null && !this.Memo.contains(dateFormat.format(this.ServicePdStart)))){
            return populateCheckMemoDatesOfService(this.Memo, null, null)
          }
        }
    }
    else if (this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS ){
      if (this.Memo == null){
        if (wcDOS == typekey.DateOfServiceExt.TC_DATEOFSERVICE || wcDOS == typekey.DateOfServiceExt.TC_STARTEND){
          if (this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_COMPROMISEDEATH){
            return "Death Benefits"
          } else {
            return  this.getInjuryString() + " MM/DD/YY Through MM/DD/YY"
          }
        } 
        else if (wcDOS == DateOfServiceExt.TC_RECURRING){
          return getinitialRecurringMemo()
        }
        else {
        return ""
        } 
      }
    }
    return this.Memo
  }

  function getInitialRecurringMemo(): String{
    var returnString = ""
    var dateFormat : java.text.SimpleDateFormat = new java.text.SimpleDateFormat("MM/dd/yyyy")
    if (!util.WCHelper.isWCorELLossType(this.Claim)){
      returnString = this.Memo
    }    
    if (this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_EMPLOYERS_LIABILITY){
      returnString = this.Memo
    } else {
      if (this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS && (this.Memo == null || this.Memo.contains(this.getInjuryString()))){
        var injuryString = this.getInjuryString()
        // Determine the Injury Type string
        if (this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_COMPROMISEDEATH){
          returnString = "Death Benefits"
        } else {
          // Auto-fill the Service Dates in the Memo
          if (this.ServicePdStart == null && this.ServicePdEnd == null){
            returnString = injuryString + " <MM/DD/YY>" + " Through " + "<MM/DD/YY>"
          }
          else if (this.ServicePdStart != null && this.ServicePdEnd == null){
            returnString = injuryString + " " + dateFormat.format(this.ServicePdStart) + " Through " + "<MM/DD/YY>"
          }
          else if (this.ServicePdStart != null && this.ServicePdEnd != null){
            returnString = injuryString + " " + dateFormat.format(this.ServicePdStart) + " Through " + dateFormat.format(this.ServicePdEnd)
            //need to replace previous not just overwrite.
          }
        }
      }// MEDICAL AND VOCATIONAL Feature types 
      else if (this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS || this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_VOCATIONAL_REHAB){
        if (this.Memo != null && !this.Memo.contains("Invoice Number ") && !this.Memo.contains("Date of Service") && !this.Memo.contains("Dates of Service")){
          return this.Memo
        } 
        if (this.InvoiceNumber != null){
          returnString = "Invoice Number " + this.InvoiceNumber
        }
        if (this.ServicePdEnd != null && this.ServicePdStart != null){
          if (returnString == null || returnString == ""){
            returnString = "Dates of Service " + dateFormat.format(this.ServicePdStart) + " - " + dateFormat.format(this.ServicePdEnd)
          }else{
            returnString = returnString + ", " + "Dates of Service " + dateFormat.format(this.ServicePdStart) + " - " + dateFormat.format(this.ServicePdEnd)
          }
        }
      }
    }
    return returnString
  }
  
  function getRecurringMemo(prevMemo: String, prevStart: DateTime, prevEnd: DateTime): String{
    var returnString = prevMemo
    var dateFormat : java.text.SimpleDateFormat = new java.text.SimpleDateFormat("MM/dd/yyyy")
//    if (this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_EMPLOYERS_LIABILITY ){
//      returnString = prevMemo
  //  }
    // INDEMNITY Feature type
    if (this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_INDEMNITY_TIMELOSS){
      if (prevMemo == null || prevMemo.contains(this.getInjuryString())){
        returnString = getReplacementRecurringMemo(prevStart, prevEnd, prevMemo)
      }
    }
    // MEDICAL AND VOCATIONAL Feature types 
    else if (this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_MEDICAL_DETAILS || this.FirstPayment.Exposure.ExposureType == ExposureType.TC_WC_VOCATIONAL_REHAB){
      if (prevMemo == null || prevMemo.contains("Invoice Number ") || prevMemo.contains("Date of Service") || prevMemo.contains("Dates of Service")){
       returnString = populateCheckMemoDatesOfService(prevMemo, prevStart, prevEnd)
      }
    }
    return returnString
  }
   
   function getInjuryString(): String {
     var injuryString=""
     if (this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_DEATH ||
         this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_COMPROMISEDEATH){
       injuryString = "Death Benefits"
     }
     else if (this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_PERMTOTALDISABILITY ||
              this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_LIFETIMEINCOMETXONLY){
       injuryString = "Permanent Total Disability"
     }
     else if (this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_IMPAIRBENEFITSFLONLY ||
              this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPIMPAIRTXONLY){
       injuryString = "Impairment"
     }
     else if (this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_SUPPBENEFITSFLONLY ||
              this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_SUPPEARNNOPERM ||
              this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_SUPPEARNPERM ||
              this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPIMPAIRSUPPTXONLY){
       injuryString = "Supplemental Income"
     }
     else if (this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPINJURY ||
              this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPINCOMETXONLY){
       injuryString = "Temporary Disability"
     }
     else if (this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_MEDICALONLY ||
              this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_CONTRACTMEDORHOSP ||
              this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_CONTRACTMEDVAONLY){
       injuryString = "Medical Payment"
     }
     else if (this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_PERMPARTIAL || 
              this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_PERMPARTIALNOSUPP ||
              this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_MAJORPERMPARTIAL ||
              this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_MINORPERMPARTIAL){
       injuryString = "Permanent Partial Disability"
     }
     else if (this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPTOTALINJURY || 
              this.FirstPayment.WCInjuryTypeExt == WCInjuryTypeExt.TC_TEMPPARTIALINJURY){
       injuryString = this.FirstPayment.WCInjuryTypeExt.Description
     }
     return injuryString
   }     
  
  property get isRecurringCheck(): Boolean{
    if(this.CheckSet.Recurrence != null){
      return true
    }
    return false
  }

  property get recurringEndDate(): DateTime {
    if (this.isRecurringCheck && this.ServicePdStart != null){
      var returnDate:DateTime
      if (this.CheckSet.Recurrence typeis WeeklyCheckRecurrence){
        returnDate = gw.api.util.DateUtil.addWeeks(this.ServicePdStart, this.CheckSet.Recurrence.WeeklyFrequency)
        return gw.api.util.DateUtil.addDays(returnDate, -1)
      }
      if (this.CheckSet.Recurrence typeis MonthlyCheckRecurrence){
        if (this.CheckSet.Recurrence.RecurrenceDay != null && this.CheckSet.Recurrence.RecurrenceDay != RecurrenceDay.TC_DAY){
          // Monthly schedule add 4 weeks instead of months
          returnDate = gw.api.util.DateUtil.addWeeks(this.ServicePdStart, (4 * this.CheckSet.Recurrence.MonthlyFrequency))
        }else { 
          returnDate = gw.api.util.DateUtil.addMonths(this.ServicePdStart, this.CheckSet.Recurrence.MonthlyFrequency)
        }
        return gw.api.util.DateUtil.addDays(returnDate, -1)
      }
    }
    else if (this.isRecurringCheck && this.ServicePdStart == null){
      return null
    }
    return this.ServicePdEnd
  }
  
  property get remainingRecurringChecks(): int{
    var count = 0
    if (this.isRecurringCheck){
      for (check in this.CheckSet.Checks){
        if (check.IssueDate == null){
          count = count + 1
        }
      }
    }
    return count
  }
  
  property get isRecurrenceActive(): boolean{
    if (this.isRecurringCheck){
      if (this.remainingRecurringChecks > 0){
        return true
      }
    }
    return false
  }
  
  public function updateRecurringChecks() {
    if (this.CheckSet.Recurrence != null){
      for (each in this.CheckSet.RecurringChecks.first().Checks){
        if (each.ScheduledSendDate >= this.ScheduledSendDate){
          each.ex_MailToAddress = this.ex_MailToAddress
          each.ex_PayToAddress = this.ex_PayToAddress
          each.UpdateCheckHistoryExt = true
        }
      }
    }
  }
  
  public function setRecurringServiceDates(){
    if (this.CheckSet.Recurrence != null){
      var prevCheck = this
      var checkNum = 1
      if (this == this.CheckSet.PrimaryCheck){
        
      }
      //var dateFormat : java.text.SimpleDateFormat = new java.text.SimpleDateFormat("MM/dd/yyyy")
      for (chk in this.CheckSet.Recurrence.ChecksSortedByDate){
        print ("Schedule Send Date : " + chk.ScheduledSendDate)
        if (chk != this && chk.ScheduledSendDate >= this.ScheduledSendDate){
          if (this.CheckSet.Recurrence typeis WeeklyCheckRecurrence){
            chk.ServicePdStart = gw.api.util.DateUtil.addWeeks(this.ServicePdStart, checkNum * this.CheckSet.Recurrence.WeeklyFrequency)
            chk.ServicePdEnd = gw.api.util.DateUtil.addWeeks(this.ServicePdStart, (checkNum+1) * this.CheckSet.Recurrence.WeeklyFrequency)
            chk.ServicePdEnd = gw.api.util.DateUtil.addDays(chk.ServicePdEnd, -1)
          }
          if (this.CheckSet.Recurrence typeis MonthlyCheckRecurrence){
            if (this.CheckSet.Recurrence.RecurrenceDay != null && this.CheckSet.Recurrence.RecurrenceDay != RecurrenceDay.TC_DAY){
            // Monthly schedule add 4 weeks instead of months
              chk.ServicePdStart = gw.api.util.DateUtil.addWeeks(this.ServicePdStart, (4 * checkNum * this.CheckSet.Recurrence.MonthlyFrequency))
              chk.ServicePdEnd = gw.api.util.DateUtil.addWeeks(this.ServicePdStart, (4 *(checkNum+1) * this.CheckSet.Recurrence.MonthlyFrequency))
            }else { 
            //Calendar Monthly schedules add months
              chk.ServicePdStart = gw.api.util.DateUtil.addMonths(this.ServicePdStart, checkNum * this.CheckSet.Recurrence.MonthlyFrequency)
              chk.ServicePdEnd = gw.api.util.DateUtil.addMonths(this.ServicePdStart, (checkNum+1) * this.CheckSet.Recurrence.MonthlyFrequency)
            }
            chk.ServicePdEnd = gw.api.util.DateUtil.addDays(chk.ServicePdEnd, -1)
          }
          chk.Memo = chk.getRecurringMemo(prevCheck.Memo, prevCheck.ServicePdStart, prevCheck.ServicePdEnd)
          checkNum++
        }
      }
    }
  }
  
  public function updateRecurringFields(){
    if (this.CheckSet.Recurrence != null){
      for (each in this.CheckSet.RecurringChecks.first().Checks){
        each.IssuedPayeesExt = this.IssuedPayeesExt
        each.IssuedPayeeTypesExt = this.IssuedPayeeTypesExt
        each.IssuedPayeeTaxIDExt = this.IssuedPayeeTaxIDExt
        each.IssuedPayToAddressExt = this.IssuedPayToAddressExt
        each.IssuedClaimantExt = this.IssuedClaimantExt
        // update mail to address
        each.MailToAddress = this.MailToAddress
        // Update Reportability based on TPA preferences
        if (each.Reportability == "reportable" && !util.admin.ExternalUserAdminUtil.is1099Enabled(each)){
           each.Reportability = "notreportable"
        }
      }

      // Set the recurring start/end dates and update Statement of Account for each check.
      this.setRecurringServiceDates()

    }
  }
  
/*  function clearCheckMemo(previousDOSType: DateOfServiceExt){
    var replaceString = this.setWCMemo(previousDOSType)
    if ( previousDOSType != null ){
      if ((replaceString != null && replaceString != "" )){
        this.Memo = this.Memo.replace(replaceString, "")
      }
    }
  }*/
  function setPreviousStart(): DateTime{
    return this.ServicePdStart
  }
  
  function recurringValidation(): String {
    if (!this.isRecurringCheck){
      if (this.New){
        return "Enter details for Recurring Checks."
      } else {
        return "A recurring schedule cannot be added to a single check."
      }
    }
    return null
  }

/**
* Defect 8490 - Returns a list of states with non-default check back values. 
*/
static function stateHasSpecificCheckBackValues() : List {
  return stateHasSpecificCheckBackValues(null)
}
/**
* Defect 8490 - Returns a list of states with non-default check back values. 
* @param state - This state will be removed from the list.
* 
* * Defect 8917 - anicely - Removed NC
*/
static function stateHasSpecificCheckBackValues(state:State) : List {
  var states = New List(){typekey.State.TC_AR, typekey.State.TC_CA, typekey.State.TC_DE,
    typekey.State.TC_NY, typekey.State.TC_RI, typekey.State.TC_UT}

  if (state == null){
    return states 
  } else {
    states.remove(state)
  }
  return states
}

/**
 * Defect 8490 - determines if the Worker's Comp NC policy check requirements aplly. Returns true if:
 *   Workers Comp Claim
 *   Policy State is North Carolina or
 *   Policy State is either null or has no non NC state-specific values and the Insured State is North Carolina
 * Defect 8916 - anicely - Removing calls to this function
 */
function northCarolinaPolicyReturnToOffice() : boolean{
  return northCarolinaPolicyReturnToOffice(this.Claim)
}

/**
 * Defect 8490 - determines if the Worker's Comp NC policy check requirements aplly. Returns true if:
 *   Workers Comp Claim
 *   Policy State is North Carolina or
 *   Policy State is either null or has no non NC state-specific values and the Insured State is North Carolina
 */
static function northCarolinaPolicyReturnToOffice(claim:Claim) : boolean{
  if (not claim.isWCclaim){
    return false
  }

  return (claim.Policy.PolicyStateExt == State.TC_NC)
    or (claim.Policy.PolicyStateExt == null and claim.Policy.insured.PrimaryAddress != null and
      claim.Policy.insured.PrimaryAddress.State == State.TC_NC)
    or (not stateHasSpecificCheckBackValues(State.TC_NC).contains(claim.Policy.PolicyStateExt) and
      claim.Policy.insured.PrimaryAddress != null and claim.Policy.insured.PrimaryAddress.State == State.TC_NC)
}

/**
 * Defect 8490 - Determines if NC Check Payee State logic applies. Returns true if:
 * - Workers Comp Claim
 * - Policy State not North Carolina, Alaska, Arkansas, California, Delaware, New Mexico, New York, Rhode Island, or Utah
 * - Insured Policy State not North Carolina, Alaska, Arkansas, California, Delaware, New Mexico, New York, Rhode Island,
 *     or Utah
 */
static function northCarolinaPayeeReturnToOffice(claim:Claim) : boolean{
  if (not claim.isWCclaim){
    return false
  }
  if (claim.Policy.PolicyStateExt != null and Check.stateHasSpecificCheckBackValues()
    .contains(claim.Policy.PolicyStateExt)){
   return false
  }
  if (claim.Policy.insured.PrimaryAddress.State != null and Check.stateHasSpecificCheckBackValues()
    .contains(claim.Policy.insured.PrimaryAddress.State)){
   return false
  }
  return true
}

  /*function to check for final non recurring check where recurring checks do exists on the claim but have not been issued, defect 8529, reg checks and manual checks */
function checkfinalnonrecurring() {
  var payment : Payment
  var finpayment = false
  for (trans in this.CheckSet.AllTransactions){
    if (trans.Subtype == "Payment"){
      payment = trans as Payment
      if (payment.PaymentType == "final"){
        finpayment = true
      }
    }
  }
  var pendingrecurring = false
    for (chk in this.Claim.getChecksIterator(false)){
      if ((chk as Check).IssueDate == null and (chk as Check).isRecurringCheck){
        if ((chk as Check).Payments.first().ReserveLine == payment.ReserveLine){
        pendingrecurring = true
        break;
        }
      }
    }  
    if (pendingrecurring and finpayment){
      throw new com.guidewire.pl.web.controller.UserDisplayableException(displaykey.Web.NewCheckWizard.Recurring)
    }  
}

}