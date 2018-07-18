package gw.api.address

/**
 * Provides methods for setting the labels and visibility of 
 * address fields of an an AddressAutofillable entity.
 */
class AddressDisplay
{
  private construct()
  {
  }
  
  static function isCountyVisible(addr : AddressAutofillable) : boolean {
    if (addr != null AND addr.Country != null) {
      return addr.Country.Code == "US";
    }
    return gw.api.admin.BaseAdminUtil.getDefaultCountry().Code == "US";
  }
  
  static function getCountry(addr : AddressAutofillable) : Country {
    if (addr != null AND addr.Country != null) {
      return addr.Country;
    }
    return gw.api.admin.BaseAdminUtil.getDefaultCountry();
  }
  
  static function getPostalCodeTooltip(addr : AddressAutofillable) : String {
    var addrCountry = getCountry(addr);
    if (addrCountry == "US") {
      return displaykey.AutoFill.OverrideUsingZipCode;
    } else {
      return displaykey.AutoFill.OverrideUsingPostalCode;          
    }
  }
    
  static function getCityTooltip(addr : AddressAutofillable) : String {
    var addrCountry = getCountry(addr);
    if (addrCountry == "CA") {
      return displaykey.AutoFill.OverrideUsingCityProvince;          
    } else {
      return displaykey.AutoFill.OverrideUsingCityState;                    
    }
  }
    
  static function getPostalCodeLabel(addr : AddressAutofillable) : String {
    var addrCountry = getCountry(addr);        
    if (addrCountry == "US") {
      return displaykey.Web.AddressDetail.ZipCode;
    } else {
      return displaykey.Web.AddressDetail.PostalCode;          
    }
  }
    
  static function getStateLabel(addr : AddressAutofillable) : String {
    var addrCountry = getCountry(addr);        
    if (addrCountry == "CA") {
      return displaykey.Web.AddressDetail.Province;
    } else {
      return displaykey.Web.AddressDetail.State;          
    }
  }
}
