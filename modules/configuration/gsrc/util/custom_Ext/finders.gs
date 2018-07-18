package util.custom_Ext;
uses java.util.ArrayList
uses com.gaic.claims.cc.util.TypeCodeUtil

class finders{
  
  construct(){
  }

//******************************************************************************************  

  // 11/13/07 - zthomas - Defect 555, add additional countries.
  // 03/04/2009 - zjthomas - Defect 646, remove postal code masking for AU, BE, FR, DE and GB.
  static function getPostCodeMask( countryCode: String) : String {  

  var mask:String
    
    if(countryCode != null){

      if(countryCode.equals("US")){
        mask = "#####-####";
      }      
      if(countryCode.equals("CA")){
        mask = "### ###";
      }      
//      if(countryCode.equals("AU")){
//        mask = "####";
//      }      
//      if(countryCode.equals("BE")){
//        mask = "####";
//      }      
//      if(countryCode.equals("FR")){
//        mask = "#####";
//      }      
//      if(countryCode.equals("DE")){
//        mask = "#####";
//      }      
//      if(countryCode.equals("GB")){
//        mask = "########";
//      }
    }
    
    return mask
  }
  
//******************************************************************************************  

  // 11/13/2007 - zthomas Defect 555, add additional countries.  Defect 558, modify validationExpression for postalcode.
  // 03/04/2009 - zjthomas - Defect 646, remove postal code validation for AU, BE, FR, DE and GB.
  static function getPostCodeValidation( countryCode: String, postalCode: String) : String {   

  var validation:String
  
    if(countryCode != null){
      
      if(countryCode.equals("US")){
        validation = "([0-9]{5}(-[0-9]{4})?)";
      }else if(countryCode.equals("CA")){
        validation = "([A-Z][0-9][A-Z] [0-9][A-Z][0-9])";
//      }else if(countryCode.equals("AU")){
//        validation = "([0-9]{4})";
//      }else if(countryCode.equals("BE")){
//        validation = "([0-9]{4})";
//      }else if(countryCode.equals("FR")){
//        validation = "([0-9]{5})";
//      }else if(countryCode.equals("DE")){
//        validation = "([0-9]{5})";
//      }else if(countryCode.equals("GB")){
//        if(postalCode.length() == 6){
//          validation = "([A-Z][0-9] [0-9][A-Z]{2})$";
//        }else{
//          validation = "([A-Z][A-Z0-9][A-Z0-9]?[A-Z0-9]? [0-9][A-Z]{2})$";
//        }
      }else{
        validation = ".+";
      }
    }else{
      validation = ".+";
    }
      
    return validation
  }
  
//******************************************************************************************  

  //11/13/07 - zthomas - Defect 558, modify validationExpression for Postal Code
  //06/20/08 - zthomas - Defect 941, Change parameters to format alpha characters to uppercase.
  static function postCodeValidation(addy : Address) : Boolean {
 
    var result = true;
  
    if(addy.PostalCode!=null){
    
      addy.PostalCode = addy.PostalCode.replaceAll( "[.]", "" )
      addy.PostalCode = addy.PostalCode.toUpperCase()

      if(!addy.PostalCode.matches( getPostCodeValidation(addy.Country.Code, addy.PostalCode)) ){  
        result = false
      }
    }
      
    return result
  }
 
  //*****************************************************************************************
 
  //11/13/07 - zthomas - Defect 555 add additional countries
  //11/13/07 - zthomas - Defect 558 Modify validationExpression for PostalCode
  //03/04/09 - zjthomas - Defect 646, remove postal code validation for AU, BE, FR, DE and GB.
  static function postCodeExpression(countryCode : String) : String {
   
    var expression = new java.lang.StringBuffer();
   
    expression.append( "Invalid zip code format.")
    
    if(countryCode != null){

      if(countryCode.equals("US")){
        expression.append(" (Examples 45202 or 45202-3110)");
      }
      if(countryCode.equals("CA")){
        expression.append(" (Example H3Z 2Y7)");
      }      
//      if(countryCode.equals("AU")){
//        expression.append(" (Example 3171)");
//      }      
//      if(countryCode.equals("BE")){
//        expression.append(" (Example 4000)");
//      }      
//      if(countryCode.equals("FR")){
//        expression.append(" (Example 33380)");
//      }      
//      if(countryCode.equals("DE")){
//        expression.append(" (Example 53225)");
//      }      
//      if(countryCode.equals("GB")){
//        expression.append(" (Examples M2 5BQ, M34 4AB, CR0 2YR, W1A 4ZZ, DN16 9AA or EC1A 1HQ)");
//      }
    }
    
    return expression.toString()
 
  }
 
//*****************************************************************************************
 
  //11/13/07 - zthomas - Defect 560, modify address screens
  //03/04/09 - zjthomas - Defect 646, retire states for AU, BE, FR, DE and GB.
  static function stateRequired(countryCode : String, stateRequired : Boolean) : Boolean {
    var result = false;
   
    if(stateRequired){
//    if(countryCode == "US" or countryCode == "CA" or countryCode == "AU" or countryCode == "BE" or
//    countryCode == "FR" or countryCode == "DE" or countryCode == "GB"){
      if(countryCode == "US" or countryCode == "CA"){

        result = true;
      }
    }   
    return result;
 
  }


//*****************************************************************************************
 
  //7/31/09 - zthomas - Defect 2247, Require zip only for US and Canada.
  static function postCodeRequired(countryCode : String, postalCodeRequired : Boolean) : Boolean {
    var result = false;
   
   if(postalCodeRequired){
      if(countryCode == "US" or countryCode == "CA"){
        result = true;
      }
    }
    
    return result;
 
  }//****************************************************************************************** z 

  static function setDefaultCountry(invalue : Contact) : Boolean {

  var result = false;
    
    //Set default country to US on all contacts except for foreign vendors.
    if(invalue.New and invalue.PrimaryAddress.Country.DisplayName==null and invalue.Subtype != "Ex_ForeignCoVendor" and
    invalue.Subtype != "Ex_ForeignCoVenLawFrm" and invalue.Subtype != "Ex_ForeignCoVenMedOrg" and
    invalue.Subtype != "Ex_ForeignPersonVndr" and invalue.Subtype != "Ex_ForeignPerVndrAttny" and
    invalue.Subtype != "Ex_ForeignPerVndrDoc"){
      invalue.PrimaryAddress.Country = "US";
      result = true;
    }
    return result
 }

//******************************************************************************************

//******************************************************************************************
// findActivityPattern
// ---------------------------------------------
// Function that returns an activity pattern object
// code: the text "code" data element for the activity pattern
//
// AgriBusiness sprint 5 by rbr
//******************************************************************************************
  static function findActivityPattern( code : String) : ActivityPattern {
    var activityPatternQuery = gw.api.database.Query.make(ActivityPattern);
    activityPatternQuery.compare("Code", Equals, code)
    
    var resultSet = activityPatternQuery.select();
        
    return resultSet.getAtMostOneRow();
  }
  
//******************************************************************************************
// getActivityPattern
// ---------------------------------------------
// Function that returns the public id of an activity pattern
// code: the text "code" data element for the activity pattern
//
// AgriBusiness sprint 5 by rbr
//******************************************************************************************  
  static function getActivityPattern( code: String) : String {

    var result : String
    var query = find( ap in ActivityPattern where ap.Code == code )
    query.getAtMostOneRow();
    for (apo in query){
      result = apo.PublicID
    }
  return result 
  }
  
  
//******************************************************************************************
//******************************************************************************************  
/* This function was replaced by the function above in Equine by Mr. Zach Thomas
  static function getPostCodeMask( countryCode: String) : String {
    
  var mask:String
  var num=0

    if(countryCode!=null){
      for(con in country.TypeKeys index j){
        if(countryCode.equals( con.Name )){  
          num = j
        }
      }
    }

    switch(num){  
      case 38: mask="###-###";break  // Canada
      case 227: mask="#####-####";break  // US
      default: mask="";break
    }
    
    return mask
  }
*/
//******************************************************************************************  
/* This function was replaced by the function above in Equine by Mr. Zach Thomas
 static function setDefaultCountry(invalue : Contact) : String {
 var result="not changed"  
   if(invalue.PrimaryAddress.Country.Name==null){
     invalue.PrimaryAddress.Country="US"
     result="changed"
   }
   return result
 }*/
//******************************************************************************************  
//find user id to pass into a script parameter
  
  static function getUsername( userid: String) : String {
    var result : String
    var query = find( user in Credential where user.UserName==userid)
    query.getAtMostOneRow();
    for (userop in query){
      result = userop.PublicID
    }
  return result 
  }

  static function getUserOb ( userid: String) : User {
    var result:User
    var credent:Credential
    var query = find( credent in Credential where credent.UserName==userid)
    query.getAtMostOneRow();   
    for (credential in query){
      credent = credential
    }
    var query2 = find ( user in User where user.Credential == credent)
    for (user in query2){
      result = user
    }
    return result
  }
  
//******************************************************************************************  
//* sdalal Agri 16 - Added the 2 functions below to be used in conjuntion with the ISO Reference 
//* tables.
  static function getISOEnabledStatus( lossType : LossType ) : Boolean {
    var result : Boolean
    var query = find( isorefvalue in ISOReferenceValuesExt where isorefvalue.LossTypeExt==lossType)
        query.getAtMostOneRow();
    for (isoenabledflag in query){
      result = isoenabledflag.ISOEnabledExt
    }
  return result 
  }
  
  static function getISOStopSendingAfter( lossType: String) : int {
    var result : int = -1;
    var stopSendingQuery = find( isorefvalue in ISOReferenceValuesExt where isorefvalue.LossTypeExt==lossType).getAtMostOneRow().StopSendingAfterExt
    if(stopSendingQuery!=null){
      result = stopSendingQuery
    }
    return result 
  }

  static function getEnvironment() : String {
    
    var environment : String = java.lang.System.getProperty("gw.cc.env");
    var platform : String = ""
    var appendingSuffix : String = "ClaimCenter Notification"
    var from : String = platform + " " + appendingSuffix
    
    switch ( environment ) {
      case "dev":  //Development - Equine
        platform = "Development";
        break;
      case "dev2":  //Development - Agribusiness
        platform = "Development 2";
        break;
      case "dev3":
        platform = "Development 3";
        break;
      case "dev4":
        platform = "Development 4";
        break;
      case "dev5":
        platform = "Development 5";
        break;
      case "dev6":
        platform = "Development 6";
        break;
      case "dev7":
        platform = "Development 7";
        break;
      case "dev8":
        platform = "Development 8";
        break;
      case "dev9":
        platform = "Development 9";
        break;
      case "int":  //Integration - Equine
        platform = "Integration";
        break;
      case "int2":  //Integration - Agribusiness
        platform = "Integration 2";
        break;
      case "int3":
        platform = "Integration 3";
        break;
      case "cert":  //Certification
        platform = "Certification";
        break;
      case "local":  //localhost
        platform = "Localhost";
        break;
      default:
        break;
    }
 
    if( platform == "")
      return from
    else  
      return platform + " " + from
  }
  //********************************************************************************************
  
  //Returns a list of current business unit names - kmboyd - 4/21/2009
  static function getBusinessUnitList() : List {
    var busUnitList : List = new ArrayList()
    
    var query = find(group in Group where group.GroupType=="busunit");
    
    if(query.getCount() > 1){
      foreach(group in query){
        busUnitList.add(group.Name)
      }
    }
    return busUnitList;
  }
 
   static function enablePRO() : boolean {
    /*Defect 2733 If the user's "group" belongs to any Agribusiness team then "Restore from Pro" 
    button will be not appear for that particular user 
    Defect 5270 4/13/12 erawe - allow Agri, Equine, Claims IT and GAIC Claims users to see Restore PRO Policy Requests menu item.
    GAIC Claims user does NOT include any other child groups within except Equine and Agri at this time, 4/13/12
    Defect 5710  erawe: Remove (comment out) Excess Group until they go to Production, then uncomment before the move to Prod
    var isAgriBusinessGroup : boolean = false
    7/22/15 erawe - Int1 has different group id now than other DB, whole Int1 sending to EDW thing.  So I changed these
                    to be Name.  Where parent this should include child groups.  This all
                    has to do with the Desktop error when one of these groups not loaded.
    12/2/15 kniese - defect8069 - Allow Restore Pro Policy Requests for Workers Comp
    5/12/16 dcarson2 - defect 8574 - Updated WC group names to match name changes
    */
    var restoreProGroup : boolean = false
    
    for(ref in User.util.getCurrentUser().GroupUsers) {
      if(ref.Group.Parent.Name == "AgriBusiness® Claims Division" or ref.Group.Name == "AgriBusiness® Claims Division" or
      //if(ref.Group.Parent == Group( "group:10002" /* AgriBusiness Business Unit */ ) or ref.Group == Group( "group:10002" /* AgriBusiness Business Unit */ ) or
        ref.Group.Parent.Name == "Equine Mortality Claims Division" or ref.Group.Name == "Equine Mortality Claims Division" or
        //ref.Group.Parent == Group( "group:10001" /* Equine Business Unit */ ) or ref.Group == Group( "group:10001" /* Equine Business Unit */ ) or 
        ref.Group.Name == ("Excess Liability Claims Division") or
        //ref.Group.Parent == Group( "group:50001" /* Excess Liability */ ) or ref.Group == Group( "group:50001" /* Excess Liability */ ) or
        ref.Group.Parent.Parent.Name == ("Alternative Markets Claims Division") or ref.Group.Parent.Name == ("Alternative Markets Claims Division") or ref.Group.Name == ("Alternative Markets Claims Division") or
        ref.Group.Parent.Parent.Name == ("Environmental Claims Unit") or ref.Group.Parent.Name == ("Environmental Claims Unit") or ref.Group.Name == ("Environmental Claims Unit") or
        ref.Group.Parent.Parent.Name == ("Strategic Comp Claims Division") or ref.Group.Parent.Name == ("Strategic Comp Claims Division") or ref.Group.Name == ("Strategic Comp Claims Division") or
        ref.Group.Parent.Parent.Name == ("Trucking Claims Division") or ref.Group.Parent.Name == ("Trucking Claims Division") or ref.Group.Parent.Parent.Parent.Name == ("Trucking Claims Division") or ref.Group.Name == ("Trucking Claims Division") or
        ref.Group.Name == "GAIC Claims" or
        //ref.Group == Group( "group:10000" /* GAIC Claims */ ) or
        ref.Group.Name == "Claims IT") {
        //ref.Group == Group( "group:10007" /* Claims IT */ )) {
        restoreProGroup = true
      }else
        restoreProGroup = false
      }
        return restoreProGroup
   }  //end enablePro
  
     static function enablePRO(lossType: String) : boolean {
        if(lossType != null and (lossType.equals("AGRIAUTO") or lossType.equals("FIDCRIME") or lossType.equals("PIMINMARINE") or lossType.equals("COMMBONDS")
        or lossType.equals("EXECLIABDIV") or lossType.equals("PROFLIABDIV") or lossType.equals("SPECIALTYES") or lossType.equals("KIDNAPRANSOM")
        or lossType.equals("ENVLIAB") or lossType.equals("OMAVALON") or lossType.equals("PERSONALAUTO")or lossType.equals("MERGACQU") or lossType.equals("AVIATION"))) 
        {
          return false;
        }
        return true;
    }  //end enablePro
  
  static function getPrimaryPhoneNumber(contact : Contact) : String {
    //Pertains to defect 3291
    //Return Cellphone number if the primary phone is null or if the value is mobile "and" the work and home phone value is empty but the mobile has a value
    //it should also return the cellphone value if the phone type is mobile and if there is a cellphone number value is present
    //if both conditions are not met then get primaryphonevalue
    if((contact.PrimaryPhone == null || contact.PrimaryPhone == "mobile") && (contact.WorkPhone == null && contact.HomePhone == null && contact.CellPhoneExt != null) || 
      (contact.PrimaryPhone == "mobile" && contact.CellPhoneExt != null)) {
        return contact.CellPhoneExt
      }
  
    return contact.getPrimaryPhoneValue()
  }
  
    //Pertains to defect 3291
  //If the contact is a PersonVendor or a CompanyVendor  and if any  Contact specific Contact  Work, home, or mobile has a value
  //then put the phone number values on the Phone number in the list view on parties involved
  //the number that gets put in parties involved is either the work, or the home, or the mobile number in that specific order
  //the getPrimaryPhoneNumber function will only be called if the csc work, csc home, or csc mobile are empty or if
  //the claim contact is not a Person Vendor or CompanyVendor
  static function getPeopleInvolvedPhoneNumber(cc : ClaimContact) : String {
    var phoneNumber : String

    if(cc.Contact typeis PersonVendor || cc.Contact typeis CompanyVendor ) {
     if(cc.cscHomePhoneExt != null || cc.cscWorkPhoneExt != null || cc.cscCellPhoneExt != null) {
       //if the cscPrimaryPhoneType is null and the WorkPhone is not null then get the WorkPone number
       //if the cscPrimaryPhoneType is work and the WorkPhone is not null then get the WorkPhone number
       if((cc.cscPrimaryPhoneExt == null || cc.cscPrimaryPhoneExt == "work") && cc.cscWorkPhoneExt != null) {
         phoneNumber = cc.cscWorkPhoneExt 
       //if the cscPrimaryPhoneType is null and the home Phone is not null then get the Home Phone number
       //if the cscPrimaryPhoneType is home and the home Phone is not null then get the Home Phone number
       } else if (((cc.cscPrimaryPhoneExt == null || cc.cscPrimaryPhoneExt == "home") && cc.cscHomePhoneExt!= null)) {
         phoneNumber = cc.cscHomePhoneExt
       //if the cscPrimaryPhoneType is null and the mobile is not null then get the mobile phone number
       //if the cscPrimaryPhoneType is mobile and the mobile is not null then get the mobile phone number
       } else if (((cc.cscPrimaryPhoneExt == null || cc.cscPrimaryPhoneExt == "mobile") && cc.cscCellPhoneExt!= null)) {
         phoneNumber = cc.cscCellPhoneExt
       }
     } else {
       //if the ClaimContactSpecific work, mobile, cell are not filled then call the getPrimaryPhoneNumber function
        phoneNumber = getPrimaryPhoneNumber(cc.Contact)
     }
    } else {
      //If the ClaimContact is not a PersonVendor or a CompanyVendor then call the getPrimaryPhoneNumber function 
      phoneNumber = getPrimaryPhoneNumber(cc.Contact)
    }
    
    return phoneNumber
  }
  
  //Contact Function Added for Primary Phone Value -AddressBookSearchLV
   static function getPrimaryContactNumber(cc : Contact) : String {
    var phoneNumber : String

    if(cc typeis PersonVendor || cc typeis CompanyVendor ) {
     if(cc.HomePhone!= null || cc.WorkPhone != null || cc.CellPhoneExt != null) {
       if((cc.PrimaryPhone == null || cc.PrimaryPhone == "work") && cc.WorkPhone != null) {
         phoneNumber = cc.WorkPhone 
       } else if (((cc.PrimaryPhone == null || cc.PrimaryPhone == "home") && cc.HomePhone!= null)) {
         phoneNumber = cc.HomePhone
       } else if (((cc.PrimaryPhone == null || cc.PrimaryPhone == "mobile") && cc.CellPhoneExt!= null)) {
         if(cc typeis PersonVendor){
             phoneNumber = (cc as Person).CellPhoneExt
         } else{
             phoneNumber = cc.CellPhoneExt
         }
       }
     } else {
        phoneNumber = cc.PrimaryPhoneValue
     }
    } else {
      phoneNumber = cc.PrimaryPhoneValue
    }    
    return phoneNumber
  }
  
  static function getGroupID( groupName : String) : Group {
    var result : Group
    var query = find( group in Group where group.Name==groupName)
    
    query.getAtMostOneRow();
    
    for (group in query){
      result = group
    }
    
    return result 
  }
  
}
