package gw.api.databuilder
uses java.math.BigDecimal
uses gw.transaction.Transaction
uses java.lang.StringBuilder

/**
 * Sample address used for proximity search testing since it contains geocoding result
 */
class SampleAddress
{
  var _addressLine : String as readonly AddressLine
  var _postalCode : String as readonly PostalCode
  var _city : String as readonly City
  var _state : State as readonly State
  var _country : Country as readonly Country 
  
  var _geocodeStatus : GeocodeStatus as readonly GeocodeStatus
  var _longitude : BigDecimal as readonly Longitude
  var _latitude : BigDecimal as readonly Latitude
  

  construct(address: Address)
  {
    _postalCode = address.PostalCode
    _city = address.City
    _state = address.State
    if (address.Country == null) { _country = "US" } 
      else { _country = address.Country }
    _addressLine = address.AddressLine1
    _geocodeStatus = address.GeocodeStatus
    _latitude =address.Latitude
    _longitude = address.Longitude    
  }


  construct(postalCode1:String, city1:String, state1:State)
  {
    this(postalCode1, city1, state1, null)
  }
  
  construct(postalCode1:String, city1:String, state1:State, address1:String) {
    _postalCode = postalCode1
    _city = city1
    _state = state1
    _country = "US"
    _addressLine = address1
  }
  
  public function withGeocode(status:GeocodeStatus, latitude1:String, longitude1:String) : SampleAddress {
    _geocodeStatus = status
    _latitude = (latitude1 == null ? null : new java.math.BigDecimal(latitude1))
    _longitude = (longitude1 == null ? null : new java.math.BigDecimal(longitude1))
    return this
  }
  
  function createAddressGeocoded() : Address {
      var address = create()
      address.Latitude = _latitude
      address.Longitude = _longitude
      if (_latitude != null && _longitude != null) {
        address.calculateHTMID()
      }
      address.GeocodeStatus = _geocodeStatus
      return address
  }
  
  function create() : Address {
    var address = new Address()
      if (_addressLine != null) {
          address.AddressLine1 = _addressLine
      }
      if (_city != null) {
          address.City = _city
      }
      if (_state != null) {
          address.State = _state
      }
      if (_postalCode != null) {
          address.PostalCode = _postalCode
      }
      address.Country = _country
      return address
  }

  
  function updateAddressAndCommit(user:User) {
    Transaction.runWithNewBundle( \ bundle -> {
      bundle.add( user)
      updateAddress(user)
    } )
  }
  
  function updateAddress(user:User) {
    var address = user.Contact.PrimaryAddress
    address.AddressLine1 = AddressLine
    address.City = City
    address.State = State
    address.PostalCode = PostalCode
    address.Country = Country
    address.setGeocodeFieldsFromLatLong( Latitude, Longitude )
    address.GeocodeStatus = GeocodeStatus
  }
  
  static property get Pasadena() : SampleAddress {
    return new SampleAddress("91101", "Pasadena", State.get("CA")).withGeocode(  "postalcode", "34.1425", "-118.1324" )}
  static property get Pasadena_LakeAve() : SampleAddress {
    return new SampleAddress("91101-3009", "Pasadena", State.get("CA"), "225 S. LAKE AVE, STE 300").withGeocode( "exact", "34.1425", "-118.1324")}
  static property get SanDiego() : SampleAddress {
    return new SampleAddress(null, "San Diego", State.get("CA")).withGeocode("city", "32.7823", "-117.0999")}
  static property get SF_BealeSt() : SampleAddress {
    return new SampleAddress("94104", "San Francisco", State.get("CA"), "3220 Beale St").withGeocode("exact", "37.7925", "-122.3972")}
  static property get SanJose() : SampleAddress {
    return new SampleAddress("95126", "San Jose", State.get("CA"), null).withGeocode( "exact", "37.3254", "-121.8991")  }
  static property get PheonixAZ_Perf() : SampleAddress {
    return new SampleAddress("85012", "PHOENIX",State.get("AZ"), "4000 N. CENTRAL AVE.").withGeocode("exact","33.4939","-112.0738")}
  static property get FailureAddress() : SampleAddress {
    return new SampleAddress("99999", null, null, null).withGeocode("failure", null, null)}

  public function getInternalString() : String {
    var sb = new StringBuilder()
    var s = _addressLine
    if (s != null && s.trim().length() > 0) {
        sb.append(s)
    }
    s = _city
    if (s != null && s.trim().length() > 0) {
        if (sb.length() > 0) {
            sb.append(", ")
        }
        sb.append(s)
    }
    var st = _state
    if (st != null) {
        s = st.Code
        if (s != null && s.trim().length() > 0) {
            if (sb.length() > 0) {
                sb.append(", ")
            }
            sb.append(s)
        }
    }
    s = _postalCode
    if (s != null && s.trim().length() > 0) {
        if (sb.length() > 0) {
            sb.append(" ")
        }
        sb.append(s)
    }
    var c = _country
    if (c != null) {
        s = c.Code
        if (s != null && s.trim().length() > 0) {
            if (sb.length() > 0) {
                sb.append(", ")
            }
            sb.append(s)
        }
    }
    return sb.toString()
  }
}

