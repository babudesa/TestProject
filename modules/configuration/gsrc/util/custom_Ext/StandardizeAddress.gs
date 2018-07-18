package util.custom_Ext

class StandardizeAddress {

  private var _addressArray : Address[];
  private var _returnCode : String;
    
  construct(){}

  public property set StandardizedAddresses(addressArray : Address[]){
    _addressArray = addressArray;
  }
  
  public property get StandardizedAddresses() : Address[] { 
    return _addressArray;
  }
    
  public property set StandardizeAddressReturnCode(returnCode : String){
    _returnCode = returnCode;
  }
    
  public property get StandardizeAddressReturnCode() : String {
    return _returnCode
  }

}
