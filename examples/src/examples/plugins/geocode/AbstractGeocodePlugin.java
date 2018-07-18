package examples.plugins.geocode;

import com.guidewire.pl.plugin.geocode.IGeocodePlugin;

import java.rmi.RemoteException;
import java.util.Map;

/**
 * @deprecated
 */
@Deprecated
public abstract class AbstractGeocodePlugin implements IGeocodePlugin {

  //==========PUBLIC STATIC FINAL FIELDS==========//
  public static final String ADDRESS_LINE1 = "AddressLine1";
  public static final String ADDRESS_LINE2 = "AddressLine2";
  public static final String ADDRESS_LINE3 = "AddressLine3";
  public static final String AUSTRALIA_TYPECODE = "AU";
  public static final String AUSTRALIA_LONG = "Australia, Commonwealth of";
  public static final String AUSTRALIA_SHORT = "Australia";
  public static final String CITY = "City";
  public static final String CITY_MATCH = "city";
  public static final String COUNTRY = "Country";
  public static final String COUNTY = "County";
  public static final String CSV_SEPARATOR = ", ";
  public static final String EXACT_MATCH = "exact";
  public static final String NEVER_GEOCODED = "none";
  public static final String POSTAL_CODE = "PostalCode";
  public static final String POSTAL_CODE_MATCH = "postalcode";
  public static final String STATE = "State";
  public static final String STATUS_FAILURE = "failure";
  public static final String STREET_MATCH = "street";
  public static final String UK_LONG = "United Kingdom of Great Britain and N. Ireland";
  public static final String UK_SHORT = "UK";
  public static final String UK_TYPECODE = "GB";
  public static final String USA_LONG = "United States of America";
  public static final String USA_SHORT = "USA";
  public static final String USA_TYPECODE = "US";
  public static final String CANADA_TYPECODE = "CA";

  public static final String[] EDITABLE_FIELD_NAMES = {ADDRESS_LINE1, ADDRESS_LINE2, ADDRESS_LINE3, CITY, COUNTRY,
          COUNTY, POSTAL_CODE, STATE};

  public static final String[] FIELD_NAMES = {ADDRESS_LINE1, ADDRESS_LINE2, ADDRESS_LINE3, CITY, COUNTRY, COUNTY,
          POSTAL_CODE, STATE, UTIL.getLONGITUDE(), UTIL.getLATITUDE(), UTIL.getGEOCODE_STATUS()};

  //==========PROTECTED STATIC FINAL FIELDS==========//
  protected static final int HTTP_RESPONSE_OK = 200;
  protected int NUM_FIELDS_ON_TRAVEL_INFO = 6;

  //==========PUBLIC STATIC METHODS==========//

  /**
   * @param addressData    a Map containing the data from one ABAddress as a map from field names to values
   * @param includeCountry Whether to include the country in the output String
   * @return The address, converted into a String.
   * @deprecated
   */
  @Deprecated
  public static String getAddressAsString(Map/*<String, String>*/ addressData, boolean includeCountry) {
    if (addressData == null) {
      return null;
    }
    StringBuffer addressAsStringBuffer = new StringBuffer();
    String addressLine1 = (String) addressData.get(ADDRESS_LINE1);
    String addressLine2 = (String) addressData.get(ADDRESS_LINE2);
    String addressLine3 = (String) addressData.get(ADDRESS_LINE3);
    String city = (String) addressData.get(CITY);
    String county = (String) addressData.get(COUNTY);
    String country = (String) addressData.get(COUNTRY);
    String state = (String) addressData.get(STATE);
    String postalCode = (String) addressData.get(POSTAL_CODE);
    if (addressLine1 != null) {
      addressAsStringBuffer.append(addressLine1).append(CSV_SEPARATOR);
    }
    if (addressLine2 != null) {
      addressAsStringBuffer.append(addressLine2).append(CSV_SEPARATOR);
    }
    if (addressLine3 != null) {
      addressAsStringBuffer.append(addressLine3).append(CSV_SEPARATOR);
    }
    if (city != null) {
      addressAsStringBuffer.append(city).append(CSV_SEPARATOR);
    }
    if (county != null) {
      addressAsStringBuffer.append(county).append(CSV_SEPARATOR);
    }
    if (state != null) {
      addressAsStringBuffer.append(state.toString()).append(" ");
    }
    if (postalCode != null) {
      addressAsStringBuffer.append(postalCode).append(CSV_SEPARATOR);
    }
    if (includeCountry && country != null) {
      addressAsStringBuffer.append(getUsefulCountryName(country));
    }
    String addressAsString = addressAsStringBuffer.toString();
    return addressAsString;
  }

  /**
   * @deprecated
   */
  @Deprecated
  public static String getUsefulCountryName(String country) {
    if (country == null) {
      return null;
    }
    if (country.equals(USA_LONG)) {
      return USA_SHORT;
    }
    if (country.equals(UK_LONG)) {
      return UK_SHORT;
    }
    if (country.equals(AUSTRALIA_LONG)) {
      return AUSTRALIA_SHORT;
    }
    return country;
  }

  //==========PUBLIC METHODS IMPLEMENTING INTERFACES==========//

  /**
   * Null implementation, to be overridden in subclasses.
   *
   * @param startAddress
   * @param finishAddress
   * @return
   * @throws RemoteException
   * @deprecated
   */
  @Deprecated
  public Map/*<String, Object>*/ getTravelInformation(Map/*<String, String>*/ startAddress,
                                                      Map/*<String, String>*/ finishAddress) throws RemoteException {
    return null;
  }

  //==========PROTECTED METHODS==========//

  /**
   * Creates an array of Maps representing geocodes containing no data and with a "pending" status.
   *
   * @deprecated
   */
  @Deprecated
  protected Map/*<String, String>*/[] createArrayOfNullGeocodes(int length) {
    Map/*<String, String>*/[] geocodes = new Map[length];
    return geocodes;
  }

  /**
   * @param addressData a Map containing the data from one ABAddress as a map from field names to values
   * @return The address, converted into a String.
   * @deprecated
   */
  @Deprecated
  protected String getAddressAsString(Map/*<String, String>*/ addressData) {
    return getAddressAsString(addressData, true);
  }

  /**
   * @deprecated
   */
  @Deprecated
  protected String postProcessField(String fieldName, String rawData) throws RemoteException {
    return rawData;
  }

  /**
   * @deprecated
   */
  @Deprecated
  protected Map/*<String, String>*/ postProcessGeocodeData(Map geocodeData) throws RemoteException {
    for (int i = 0; i < FIELD_NAMES.length; i++) {
      String fieldName = FIELD_NAMES[i];
      String rawData = (String) geocodeData.get(fieldName);
      if (rawData != null) {
        geocodeData.put(fieldName, postProcessField(fieldName, rawData));
      } else if (UTIL.getGEOCODE_STATUS().equals(fieldName)) {
        geocodeData.put(UTIL.getGEOCODE_STATUS(), STATUS_FAILURE);
      }
    }
    return geocodeData;
  }

  /**
   * @deprecated
   */
  @Deprecated
  protected Map/*<String, String>*/ postProcessTravelInfo(Map travelInfoData) throws RemoteException {
    return travelInfoData;
  }
}



