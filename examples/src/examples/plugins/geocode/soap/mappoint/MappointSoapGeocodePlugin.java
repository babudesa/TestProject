package examples.plugins.geocode.soap.mappoint;

import com.guidewire.pl.plugin.InitializablePlugin;
import examples.plugins.geocode.AbstractGeocodePlugin;
import org.apache.axis.EngineConfiguration;
import org.apache.axis.AxisFault;
import org.apache.axis.client.Stub;
import org.apache.axis.configuration.XMLStringProvider;
import org.apache.axis.message.SOAPHeaderElement;
import org.apache.axis.transport.http.CommonsHTTPSender;
import org.apache.axis.transport.local.LocalSender;
import org.apache.commons.lang.math.NumberUtils;

import javax.xml.rpc.ServiceException;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Former "out of the box" Mappoint Geocoding Plugin, current as of 4.0.5 (except for this note and deprecation marks);
 * this does NOT include any 5.0 bugfixes, nor does it support any of the new 5.0 features.  This is included for
 * reference only and should NOT be considered to be production-quality when running on 5.0.  Customers using Mappoint
 * are strongly encouraged to upgrade to the Gosu-based 5.0 production plug-in.
 *
 * @deprecated
 */
@Deprecated
public class MappointSoapGeocodePlugin extends AbstractGeocodePlugin implements InitializablePlugin {

  //==========PRIVATE STATIC FINAL FIELDS==========//
  private static final String MAPPOINT_AP = "MapPoint.AP";
  private static final String MAPPOINT_BR = "MapPoint.BR";
  private static final String MAPPOINT_EU = "MapPoint.EU";
  private static final String MAPPOINT_NA = "MapPoint.NA";

  // It's a good idea to test that the password and username are valid on the "Verify Credentials"
  // page at the Microsoft Web Services Extranet.
  private static final String[] supportedCountriesInAsiaPacific =
          {"Australia, Commonwealth of", "Hong Kong", "New Zealand", "Singapore", "Taiwan", "Malaysia",};
  private static final String[] supportedCountriesInNorthAmerica =
          {"United States of America", "Puerto Rico", "Canada", "Mexico",};
  private static final String[] supportedCountriesInSouthAmerica = {"Brazil",};
  private static final int DEFAULT_MAX_RESULTS = 50;
  private static final int DRIVING_DIRECTION_TEXT_MAX_LENGTH = 100;
  private static final String DEFAULT_FindServiceURL = "http://findv3.staging.mappoint.net/Find-30/FindService.asmx";
  private static final String DEFAULT_RenderServiceURL ="http://renderv3.staging.mappoint.net/Render-30/RenderService.asmx";
  private static final String DEFAULT_RouteServiceURL ="http://routev3.staging.mappoint.net/Route-30/RouteService.asmx";
  private static final String DEFAULT_CommonServiceURL ="http://findv3.staging.mappoint.net/Find-30/Common.asmx";

  //==========PRIVATE STATIC METHODS==========//
  private static EngineConfiguration getAxisConfigForMappoint() {
    XMLStringProvider xmlStringProvider = new XMLStringProvider(
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<deployment name=\"defaultClientConfig\" xmlns=\"http://xml.apache.org/axis/wsdd/\"\n" +
            "xmlns:java=\"http://xml.apache.org/axis/wsdd/providers/java\" >\n" +
            "<transport name=\"http\" pivot=\"java:" +
            CommonsHTTPSender.class.getName() + "\"/>\n" +
            "<transport name=\"local\" pivot=\"java:" +
            LocalSender.class.getName() + " \"/>\n" +
            "</deployment> "
    );
    return xmlStringProvider;
  }

  //==========PRIVATE FIELDS==========//
  private FindOptions _findOptions;
  private Set _setOfSupportedCountriesInAsiaPacific;
  private Set _setOfSupportedCountriesInNorthAmerica;
  private Set _setOfSupportedCountriesInSouthAmerica;
  private static String _password = null;
  private static String _userName = null;

  private String _findServiceURL = null;
  private String _renderServiceURL = null;
  private String _routeServiceURL = null;
  private String _commonServiceURL = null;
  private int _timeout = 60000;

  //==========PUBLIC CONSTRUCTORS==========//
  /**
   * @deprecated
   */
  @Deprecated
  public MappointSoapGeocodePlugin() {
    initializeFindOptions();
    initializeSupportedCountries();
  }

  //==========PUBLIC METHODS IMPLEMENTING INTERFACES==========//
  /**
   * @deprecated
   */
  @Deprecated
  public Map/*<String, String>*/ geocodeAddress(Map/*<String, String>*/ addressData) throws RemoteException {
    if (addressData == null) {
      return null;
    }
    Map geocode = new HashMap();
    FindResults results = null;
    try {
      results = getLatLongForAddress(addressData);
    } catch (AxisFault e) {
      if (e.getCause() == null) {
          geocode.put(UTIL.getGEOCODE_STATUS(), STATUS_FAILURE);
          return geocode;
      } else {
          throw new RemoteException("Failed to Geocode ", e.getCause());
      }
    }
    if (results.getNumberFound() == 0) {
      geocode.put(UTIL.getGEOCODE_STATUS(), STATUS_FAILURE);
      return geocode;
    } else {
      FindResult res = results.getResults().getFindResult(0);
      Location loc = res.getFoundLocation();
      LatLong latLong = loc.getLatLong();
      Address resultAddress = loc.getAddress(); //could be used for address correction.
      geocode.put(ADDRESS_LINE1, resultAddress.getAddressLine());
      geocode.put(CITY,  resultAddress.getPrimaryCity());
      geocode.put(POSTAL_CODE, resultAddress.getPostalCode());
      geocode.put(STATE, resultAddress.getSubdivision());
      geocode.put(COUNTRY, resultAddress.getCountryRegion());
      geocode.put(UTIL.getLATITUDE(), latLong.getLatitude().toString());
      geocode.put(UTIL.getLONGITUDE(), latLong.getLongitude().toString());
      double score = res.getScore(); // an index of the reliability of the match.
      String match;
      if (score >= 0.95) {
        match = EXACT_MATCH;
      } else if (score >= 0.85) {
        match = POSTAL_CODE_MATCH;
      } else {
        match = CITY_MATCH; // This is poorly documented by Microsoft.
      }
      geocode.put(UTIL.getGEOCODE_STATUS(), match);
      return postProcessGeocodeData(geocode);
    }
  }

  //==========PUBLIC METHODS==========//
  // This stuff may or may not already geocoded.
  /**
   * @deprecated
   */
  @Deprecated
  public Map/*<String, Object>*/ getTravelInformation(Map/*<String, String>*/ startAddress,
                                                      Map/*<String, String>*/ finishAddress) throws RemoteException {
    LatLong start = getLatLongFromAddress(startAddress);
    LatLong finish = getLatLongFromAddress(finishAddress);
    if (start == null || finish == null) {
      return null;
    }
    ArrayOfLatLong startAndFinish = new ArrayOfLatLong(new LatLong[]{start, finish});
    Map travelInfo = new HashMap(NUM_FIELDS_ON_TRAVEL_INFO);
    String country = (String) startAddress.get(COUNTRY);
    String dataSourceName = findDataSourceForCountry(country);
    Route route = getRoute(startAndFinish, dataSourceName);
    setDirectionsOnTravelInfo(route, travelInfo);
    setMapOnTravelInfo(dataSourceName, travelInfo, route); // TODO: skip this step if we are just counting results.
    return travelInfo;
  }

  /**
   * @deprecated
   */
  @Deprecated
  public String getVersion() throws RemoteException {
    EngineConfiguration axisConfig = getAxisConfigForMappoint();
    CommonServiceLocator locator = new CommonServiceLocator(axisConfig);
    locator.setCommonServiceSoapEndpointAddress(_commonServiceURL);
    CommonServiceSoap port;
    try {
      port = locator.getCommonServiceSoap();
      ((Stub) port).setTimeout(_timeout);
    } catch (ServiceException e) {
      throw new RemoteException(e.toString());
    }
    setCredentials((Stub) port);
    ArrayOfVersionInfo versionInfo = port.getVersionInfo();
    VersionInfo[] versionInfos = versionInfo.getVersionInfo();
    StringBuffer sb = new StringBuffer();
    for (int i = 0; i < versionInfos.length; i++) {
      VersionInfo info = versionInfos[i];
      sb.append("Component " + info.getComponent() + " is version " + info.getVersion());
    }
    return sb.toString();
  }

  //==========PRIVATE METHODS==========//
  private String findDataSourceForCountry(String country) {
    if (country == null) {
      return MAPPOINT_NA;
    }
    if (_setOfSupportedCountriesInNorthAmerica.contains(country)) {
      return MAPPOINT_NA;
    }
    if (_setOfSupportedCountriesInSouthAmerica.contains(country)) {
      return MAPPOINT_BR;
    }
    if (_setOfSupportedCountriesInAsiaPacific.contains(country)) {
      return MAPPOINT_AP;
    }
    return MAPPOINT_EU;
  }

  private FindResults getLatLongForAddress(Map addressData) throws RemoteException {
    EngineConfiguration axisConfig = getAxisConfigForMappoint();
    FindServiceLocator locator = new FindServiceLocator(axisConfig);
    locator.setFindServiceSoapEndpointAddress(_findServiceURL);
    FindServiceSoap port;
    try {
      port = locator.getFindServiceSoap();
      ((Stub) port).setTimeout(_timeout);
    } catch (ServiceException e) {
      throw new RemoteException(e.toString());
    }
    setCredentials((Stub) port);
    Address address = initializeAddress(addressData);
    String dataSourceName = findDataSourceForCountry((String) addressData.get(COUNTRY));
    FindAddressSpecification spec = new FindAddressSpecification(dataSourceName, address, _findOptions);
    FindResults results = port.findAddress(spec);
    return results;
  }

  private LatLong getLatLongFromAddress(Map startAddress) throws RemoteException {
    String lat = (String) startAddress.get(UTIL.getLATITUDE());
    String lon = (String) startAddress.get(UTIL.getLONGITUDE());
    Map geocodedAddress = startAddress;

    if (lat == null || lon == null) {
      geocodedAddress = geocodeAddress(startAddress);
    }
    lat = (String) geocodedAddress.get(UTIL.getLATITUDE());
    lon = (String) geocodedAddress.get(UTIL.getLONGITUDE());
    if (lat == null || lon == null) {
      return null;
    }
    Double v = new Double(lat);
    Double x = new Double(lon);
    LatLong latLong = new LatLong(v, x);
    return latLong;
  }

  private Route getRoute(ArrayOfLatLong startAndFinish, String dataSourceName) throws RemoteException {
    EngineConfiguration axisConfig = getAxisConfigForMappoint();
    RouteServiceLocator locator = new RouteServiceLocator(axisConfig);
    locator.setRouteServiceSoapEndpointAddress(_routeServiceURL);
    RouteServiceSoap port;
    try {
      port = locator.getRouteServiceSoap();
      ((Stub) port).setTimeout(_timeout);
    } catch (ServiceException e) {
      throw new RemoteException(e.toString());
    }
    setCredentials((Stub) port);
    Route route = port
            .calculateSimpleRoute(startAndFinish, dataSourceName, new SegmentPreference(SegmentPreference._Quickest));
    return route;
  }

  private Address initializeAddress(Map addressData) {
    Address address = new Address();
    address.setAddressLine((String) addressData.get(ADDRESS_LINE1));
    address.setPostalCode((String) addressData.get(POSTAL_CODE));
    address.setPrimaryCity((String) addressData.get(CITY));
    address.setSubdivision((String) addressData.get(STATE));
    {
      String country = (String) addressData.get(COUNTRY);
      address.setCountryRegion(getUsefulCountryName(country));
    }
    doFixupForZipPlus4(address);
    return address;
  }

  private void doFixupForZipPlus4(Address address) {
    if (address.getAddressLine() == null && address.getPrimaryCity() == null &&
            address.getSubdivision() == null && address.getCountryRegion() == null &&
            lookslikeZipPlus4(address.getPostalCode())) {
      address.setCountryRegion(USA_SHORT);
    }
  }

  private boolean lookslikeZipPlus4(String postalCode) {
    int l = postalCode.length();
    if (l < 9 || l > 10) return false;
    if (l == 10 && postalCode.charAt(5) != '-') return false;
    if (!Character.isDigit(postalCode.charAt(0)) || !Character.isDigit(postalCode.charAt(l - 1))) return false;
    return true;
  }

  private void initializeFindOptions() {
    _findOptions = new FindOptions();
    FindRange findRange = new FindRange();
    findRange.setCount(new Integer(DEFAULT_MAX_RESULTS));
    _findOptions.setResultMask(new String[0]);
    _findOptions.setRange(findRange);
  }

  private void initializeSupportedCountries() {
    _setOfSupportedCountriesInAsiaPacific = new HashSet(supportedCountriesInAsiaPacific.length);
    _setOfSupportedCountriesInNorthAmerica = new HashSet(supportedCountriesInNorthAmerica.length);
    _setOfSupportedCountriesInSouthAmerica = new HashSet(supportedCountriesInSouthAmerica.length);
    for (int i = 0; i < supportedCountriesInAsiaPacific.length; i++) {
      String s = supportedCountriesInAsiaPacific[i];
      _setOfSupportedCountriesInAsiaPacific.add(s);
    }
    for (int i = 0; i < supportedCountriesInNorthAmerica.length; i++) {
      String s = supportedCountriesInNorthAmerica[i];
      _setOfSupportedCountriesInNorthAmerica.add(s);
    }
    for (int i = 0; i < supportedCountriesInSouthAmerica.length; i++) {
      String s = supportedCountriesInSouthAmerica[i];
      _setOfSupportedCountriesInSouthAmerica.add(s);
    }
  }

  private void setCredentials(Stub port) {
    port.setUsername(_userName);
    port.setPassword(_password);

    // voodoo that I copied from the Microsoft Java SDK.
    port.setHeader(new SOAPHeaderElement("", "UserInfoFindHeader"));
  }

  private void setDirectionsOnTravelInfo(Route route, Map travelInfo) throws RemoteException {
    RouteItinerary itinerary = route.getItinerary();
    ArrayOfSegment segments = itinerary.getSegments();
    double distance = itinerary.getDistance();
    long drivingTime = itinerary.getDrivingTime();
    List directionList = new ArrayList();
    List distanceList = new ArrayList();
    List timeList = new ArrayList();
    Segment[] segmentArray = segments.getSegment();
    for (int i = 0; i < segmentArray.length; i++) {
      Segment segment = segmentArray[i];
      ArrayOfDirection directions = segment.getDirections();
      Direction[] directionArray = directions.getDirection();
      for (int j = 0; j < directionArray.length; j++) {
        Direction direction = directionArray[j];
        String formattedInstruction = direction.getFormattedInstruction();
        String truncatedFormattedInstruction = (formattedInstruction.length() > DRIVING_DIRECTION_TEXT_MAX_LENGTH) ?
                                               formattedInstruction.substring(0, DRIVING_DIRECTION_TEXT_MAX_LENGTH) :
                                               formattedInstruction;
        directionList.add(truncatedFormattedInstruction);
        distanceList.add(((long) (direction.getDistance() * 1000000L))+ "");
        timeList.add(direction.getDuration() + "");
      }
    }
    String[] hopTimes = (String[]) timeList.toArray(new String[timeList.size()]);
    String[] hopDirections = (String[]) directionList.toArray(new String[directionList.size()]);
    String[] hopDistances = (String[]) distanceList.toArray(new String[distanceList.size()]);
    travelInfo.put(UTIL.getNUM_HOPS(), hopDirections.length + "");
    travelInfo.put(UTIL.getTOTAL_DRIVING_DISTANCE(), ((long) (distance * 1000000L)) + "");
    travelInfo.put(UTIL.getTOTAL_DRIVING_TIME(), drivingTime + "");
    travelInfo.put(UTIL.getHOP_DRIVING_DISTANCE(), hopDistances);
    travelInfo.put(UTIL.getHOP_DRIVING_TIME(), hopTimes);
    travelInfo.put(UTIL.getHOP_TEXT(), hopDirections);
  }

  private void setMapOnTravelInfo(String dataSourceName, Map travelInfo, Route route) throws RemoteException {
    EngineConfiguration axisConfig = getAxisConfigForMappoint();
    RenderServiceLocator locator = new RenderServiceLocator(axisConfig);
    locator.setRenderServiceSoapEndpointAddress(_renderServiceURL);
    RenderServiceSoap port;
    try {
      port = locator.getRenderServiceSoap();
      ((Stub) port).setTimeout(_timeout);
    } catch (ServiceException e) {
      throw new RemoteException(e.toString());
    }
    setCredentials((Stub) port);
    LineDriveMapOptions mapOptions = new LineDriveMapOptions();
    mapOptions.setDestinationIconDataSource(dataSourceName);
    mapOptions.setReturnType(MapReturnType.ReturnUrl);
    mapOptions.setPaletteType(PaletteType.Color);
    LineDriveMapSpecification mapSpec = new LineDriveMapSpecification(route, mapOptions);
    ArrayOfLineDriveMapImage lineDriveMap = port.getLineDriveMap(mapSpec);
    LineDriveMapImage[] images = lineDriveMap.getLineDriveMapImage();
    String[] imageUrls = new String[images.length];
    for (int i = 0; i < imageUrls.length; i++) {
      imageUrls[i] = images[i].getUrl();
    }
    travelInfo.put(UTIL.getMAP_URLS(), imageUrls);
  }

  /**
   * @deprecated
   */
  @Deprecated
  public void setParameters(Map params) {
    for (Iterator iterator = params.keySet().iterator(); iterator.hasNext();) {
      String s = (String) iterator.next();
      if (s.equalsIgnoreCase("username")) {
        _userName = (String) params.get(s);
      } else if (s.equalsIgnoreCase("password")) {
        _password = (String) params.get(s);
      } else if (s.equalsIgnoreCase("FindServiceURL")) {
        _findServiceURL = (String) params.get(s);
      } else if (s.equalsIgnoreCase("RenderServiceURL")) {
        _renderServiceURL = (String) params.get(s);
      } else if (s.equalsIgnoreCase("CommonServiceURL")) {
        _commonServiceURL = (String) params.get(s);
      } else if (s.equalsIgnoreCase("RouteServiceURL")) {
        _routeServiceURL = (String) params.get(s);
      } else if (s.equalsIgnoreCase("TimeoutSec")) {
        int i = NumberUtils.toInt((String) params.get(s));
        if (i > 0 && i < 3600)
          _timeout = i * 1000;
      } else {
//  Ignore, unless we can log unknown parameters better than this
//        Object o = params.get(s);
//        if (o != null)
//          System.err.println("Unknown parameter '"+s+"' with value '"+o+"'");
      }
    }
    if (_findServiceURL == null) _findServiceURL = DEFAULT_FindServiceURL;
    if (_commonServiceURL == null) _commonServiceURL = DEFAULT_CommonServiceURL ;
    if (_routeServiceURL == null) _routeServiceURL = DEFAULT_RouteServiceURL;
    if (_renderServiceURL == null) _renderServiceURL = DEFAULT_RenderServiceURL ;
    if (_userName == null || _password == null) throw new RuntimeException("UserName and Password parameters must be set on the Geocode plug-in");
  }
}
