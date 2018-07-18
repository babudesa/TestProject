package libraries.Address_Entity

enhancement AddressFunctions : entity.Address {
  /**
  This is used for adding new addresses to preferred contacts. Sets the address type to "Mailing" if they are and its a new address
  **/
  function newPreferredMailingAddress(contact : Contact) : boolean{
    if(contact.Preferred and !User.util.getCurrentUser().hasCreatePreferred()){
      if(this.New and this.AddressBookUID == null){
        this.AddressType = "Mailing"
      }
        return true;
      }else{
        return false;
    }
  }


  /**
  Prevent postal codes from being larger than 11 characters for EDW purposes - This is used in the EDW templates only currently. kmboyd - 6/24/2009
  **/

  function trimPostalCode() : String {
    var retString : String = ""
    if(this.PostalCode.length() <= 11){
      retString = this.PostalCode
    }else{
      retString = this.PostalCode.substring( 0, 10 )
    }
    return retString;
  }

  // Hack to change a space to a hyphen to fix AutoFill and Standardized, without having to pass a defect to integration
  function zipFix(): boolean
  {
  	if (this != null and this.PostalCode != null and this.Country != null and this.Country.Code == "US") { 
  		this.PostalCode = this.PostalCode.replace(" ", "-");
  	}
  	return true;
  }

  function clearCityStateZipCounty()
{
      this.AddressLine1 = null;
      this.AddressLine2 = null;
      this.City = null;
      this.State = null;
      this.PostalCode = null;
      this.County = null;
  }

  function requireState() : Boolean
  {
        if (this.Country=="US" || this.Country=="CA"){
          return true 
        } else {
          return false        
        }
  }
}
