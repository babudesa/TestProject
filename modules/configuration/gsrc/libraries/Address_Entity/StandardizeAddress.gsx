package libraries.Address_Entity
uses com.gaic.integration.cc.addressverification.GAddressVerification;
uses gw.api.util.Logger //Added for logging in Debug - SR


enhancement StandardizeAddress : entity.Address {
  
  public function standardizeAnAddress(inputtedAddress:Address): util.custom_Ext.StandardizeAddress
  {
    //var addressArray : Address[]; //Will hold returned array from Standardization service.  
    //var returnCode1 session:String
    var standardizeAddress:util.custom_Ext.StandardizeAddress = new util.custom_Ext.StandardizeAddress()
    var ga = new GAddressVerification (); //Needed to run Standardization method. 
    //var i = 0;
    try
    {
      if(inputtedAddress.Country == "FR" || inputtedAddress.Country == "AU"
          || inputtedAddress.Country == "GB" || inputtedAddress.Country == "BE"
          || inputtedAddress.Country == "DE" || inputtedAddress.Country == "NZ"
          || inputtedAddress.Country == "US" || inputtedAddress.Country == "CA")
      {
            standardizeAddress.StandardizedAddresses = ga.searchAddresses(inputtedAddress);
           //this will have to change if/when we move to multiple address LV for the Standardization GUI.  
            gw.api.util.Logger.logInfo("length: " + standardizeAddress.StandardizedAddresses.length)
            gw.api.util.Logger.logInfo(standardizeAddress.StandardizedAddresses == null ? "null true" : "false" );
            //var stdAddress:Address[] = new Address[addressArray.length]
           //need to assigned value by value because stdAddress = adderessArray[0] is only a memory reference assignment, and will go out of context when returning to the PCF file.  

           standardizeAddress.StandardizeAddressReturnCode = ga.ReturnCode; 
           gw.api.util.Logger.logDebug("Standardization Return code = " + standardizeAddress.StandardizeAddressReturnCode); 
  
           standardizeAddress.StandardizeAddressReturnCode=ga.ReturnMessage;
           gw.api.util.Logger.logDebug("Stardardization Return Message = " + standardizeAddress.StandardizeAddressReturnCode);
                  
           //stdAddressReturn = stdAddress;
      }  
      else
      {
            standardizeAddress.StandardizeAddressReturnCode = "Address Verification not implemented for the country chosen.";
      }
    }
    catch (e)
    {
           //changed to logging in Debug - SR
           Logger.logDebug("Caught exception while calling address standardization: ");
           e.printStackTrace()
           standardizeAddress.StandardizeAddressReturnCode = " ";
    }
    // Don't return in the finally statement
    return standardizeAddress;
    
  //stub out information for testing. 
  //  stdAddress.AddressLine1 = "1223 First St";
  //  stdAddress.City = "New York";
   // stdAddress.State = "NY";
  //  stdAddress.PostalCode = "11101-2234"
  //  stdAddress.StandardizedExt = true;
  
  }//end standardizeAddress
}
