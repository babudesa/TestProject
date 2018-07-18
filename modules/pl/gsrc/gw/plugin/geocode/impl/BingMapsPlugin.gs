package gw.plugin.geocode.impl

uses com.guidewire.pl.system.logging.PLLoggerCategory

uses java.io.BufferedReader
uses java.io.ByteArrayInputStream
uses java.io.InputStreamReader
uses java.io.StringWriter
uses java.lang.Exception
uses java.lang.Integer  
uses java.lang.StringBuilder
uses java.math.BigDecimal
uses java.net.HttpURLConnection
uses java.net.URL
uses java.nio.charset.Charset
uses java.util.Map
uses java.util.regex.Pattern

uses javax.xml.parsers.DocumentBuilderFactory
uses javax.xml.transform.dom.DOMSource
uses javax.xml.transform.OutputKeys
uses javax.xml.transform.stream.StreamResult
uses javax.xml.transform.TransformerFactory

uses org.w3c.dom.Document
uses org.w3c.dom.Element

uses gw.api.contact.MapImageUrl
uses gw.api.contact.DrivingDirections
uses gw.api.geocode.AbstractGeocodePlugin
uses gw.plugin.InitializablePlugin

@Export
class BingMapsPlugin extends AbstractGeocodePlugin implements InitializablePlugin {
  
  // application key
  private static final var APPLICATION_KEY = "applicationKey"
  private static var _applicationKey : String
  
  // charset
  private static final var UTF8_CHARSET = Charset.forName( "UTF-8" )

  // map url
  private static final var MAP_URL_WIDTH = "mapUrlWidth"
  private static var _mapUrlWidth : String = "500"
  private static final var MAP_URL_HEIGHT = "mapUrlHeight"
  private static var _mapUrlHeight : String = "500"

  // regex for markup tags
  private static final var REGEX_MARKUP_TAG = Pattern.compile( "<[^>]*>" )
  
  // common namespaces
  private static final var SOAP_ENVELOPE_NAMESPACE_URI = "http://schemas.xmlsoap.org/soap/envelope/"
  private static final var COMMON_NAMESPACE_URI = "http://dev.virtualearth.net/webservices/v1/common"
  
  // geocode uris
  private static final var GEOCODE_SOAP_ACTION_URI = "http://dev.virtualearth.net/webservices/v1/geocode/contracts/IGeocodeService/Geocode"
  private static final var GEOCODE_CONTRACTS_NAMESPACE_URI = "http://dev.virtualearth.net/webservices/v1/geocode/contracts"
  private static final var GEOCODE_SERVICE_NAMESPACE_URI = "http://dev.virtualearth.net/webservices/v1/geocode"
  private static final var GEOCODE_SERVICE_ENDPOINT_URI = "http://dev.virtualearth.net/webservices/v1/geocodeservice/geocodeservice.svc"
  
  // route uris
  private static final var ROUTE_SOAP_ACTION_URI = "http://dev.virtualearth.net/webservices/v1/route/contracts/IRouteService/CalculateRoute"
  private static final var ROUTE_CONTRACTS_NAMESPACE_URI = "http://dev.virtualearth.net/webservices/v1/route/contracts"
  private static final var ROUTE_SERVICE_NAMESPACE_URI = "http://dev.virtualearth.net/webservices/v1/route"
  private static final var ROUTE_SERVICE_ENDPOINT_URI = "http://dev.virtualearth.net/webservices/v1/routeservice/routeservice.svc"
    
  override public function setParameters( parameters : Map<Object,Object> ) {
    _applicationKey = initParameter( parameters, APPLICATION_KEY, _applicationKey, true )

    _mapUrlWidth = initParameter( parameters, MAP_URL_WIDTH, _mapUrlWidth, false )
    _mapUrlHeight = initParameter( parameters, MAP_URL_HEIGHT, _mapUrlHeight, false )
  }
  
  override protected function _geocodeAddressBestMatch( address : Address ) : Address {
    // make request
    var geocodeSoapMessageRequestDocument = createGeocodeSOAPMessageRequestDocument( address )
    logXmlForDebug( "Geocode Request", geocodeSoapMessageRequestDocument )
    var geocodeSOAPMessageResponseDocument = sendSOAPMessageRequest( geocodeSoapMessageRequestDocument, GEOCODE_SERVICE_ENDPOINT_URI, GEOCODE_SOAP_ACTION_URI )
    logXmlForDebug( "Geocode Response", geocodeSOAPMessageResponseDocument )
    
    // convert response into an address to return
    var geocodeResultElement = getGeocodeResultElement( geocodeSOAPMessageResponseDocument )
    return extractAddressFromBingMapsGeocodeResult( geocodeResultElement )
  }
  
  override protected function _getDrivingDirections( startAddress: Address, finishAddress : Address, unit: UnitOfDistance ) : DrivingDirections {
    var startLatLong = getLatLongFromAddress( startAddress )
    var finishLatLong = getLatLongFromAddress( finishAddress )
    
    // make request
    var routeSOAPMessageRequestDocument = createRouteSOAPMessageRequestDocument( startLatLong, finishLatLong, unit )
    logXmlForDebug( "Route Request", routeSOAPMessageRequestDocument )
    var routeSOAPMessageResponseDocument = sendSOAPMessageRequest( routeSOAPMessageRequestDocument, ROUTE_SERVICE_ENDPOINT_URI, ROUTE_SOAP_ACTION_URI )
    logXmlForDebug( "Route Response", routeSOAPMessageResponseDocument )
    
    // convert response into driving directions to return
    var resultElement = getResultElementForRoute( routeSOAPMessageResponseDocument )
    var drivingDirections = extractDrivingDirectionsFromBingMapsResultForRoute( resultElement, startAddress, finishAddress, unit )
    
    // set driving directions map overview url
    setMapOverviewUrlForDrivingDirections( drivingDirections, startLatLong, finishLatLong )
    
    return drivingDirections
  }
  
  override public function getMapForAddress( address : Address, unit : UnitOfDistance ) : MapImageUrl {
    address = tryGetValidAddress( address )
    if ( !isValidLatLong( address ) ) {
      return null
    }
    
    var centerPoint = getPoint( getLatLongFromAddress( address ) )
    // zoom level is required: 1 - 22 
    var zoomLevel = "15"
    var mapUrl = getBingMapsImageryRESTUrl( centerPoint + "/" + zoomLevel )
    
    // pushpin
    // syntax: pp=latitude,longitude;iconStyle;label
    var iconStyle = "15"
    mapUrl = mapUrl + "&pp=" + centerPoint + ";" + iconStyle
    
    var mapImageUrl = new MapImageUrl()
    mapImageUrl.MapImageUrl = mapUrl
    
    return mapImageUrl
  }

  private function initParameter( parameters : Map<Object,Object>, parameterKey : String, initialParameterValue : String, requiredParameter : boolean ) : String {
    var parameterValue = parameters.get( parameterKey ) as String

    if ( parameterValue == null || parameterValue.trim().equals("") ) {
      if ( requiredParameter ) {
        throw new Exception( "You must supply a value for the \"" + parameterKey + "\" parameter in GeocodePlugin.xml" )
      } else {
        parameterValue = initialParameterValue
      }
    }

    return parameterValue
  }
  
  private function createGeocodeSOAPMessageRequestDocument( address : Address ) : Document {
    var geocodeSoapMessageRequestDocument = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument()
    
    // create message request envelope
    // return body element
    var bodyElement = createSOAPMessageRequestEnvelope( geocodeSoapMessageRequestDocument )
    
    var geocodeElement = addChildElement( geocodeSoapMessageRequestDocument, bodyElement, GEOCODE_CONTRACTS_NAMESPACE_URI, "Geocode" )
    var requestElement = addChildElement( geocodeSoapMessageRequestDocument, geocodeElement, GEOCODE_CONTRACTS_NAMESPACE_URI, "request" )
    
    addCredentialsElement( geocodeSoapMessageRequestDocument, requestElement )
    
    // add query element
    var query = createQuery( address )
    addChildTextNode( geocodeSoapMessageRequestDocument, requestElement, GEOCODE_SERVICE_NAMESPACE_URI, "Query", query )
    
    return geocodeSoapMessageRequestDocument
  }
  
  // note: this returns the body element
  private function createSOAPMessageRequestEnvelope( serviceSoapMessageRequestDocument : Document ) : Element {
    // add root envelope element
    var envelopeElement = serviceSoapMessageRequestDocument.createElementNS( SOAP_ENVELOPE_NAMESPACE_URI, "Envelope" )
    serviceSoapMessageRequestDocument.appendChild( envelopeElement )
 
    return addChildElement( serviceSoapMessageRequestDocument, envelopeElement, SOAP_ENVELOPE_NAMESPACE_URI, "Body" )
  }
  
  private function addChildElement( document : Document, parentElement : Element, namespaceUri : String, qualifiedName : String ) : Element {
    var childElement = document.createElementNS( namespaceUri, qualifiedName )
    parentElement.appendChild( childElement )
    return childElement
  }

  private function addCredentialsElement( serviceSoapMessageRequestDocument : Document, requestElement : Element ) {
    var credentialsElement = addChildElement( serviceSoapMessageRequestDocument, requestElement, COMMON_NAMESPACE_URI, "Credentials" )
    addChildTextNode( serviceSoapMessageRequestDocument, credentialsElement, COMMON_NAMESPACE_URI, "ApplicationId", _applicationKey )
  }
  
  private function addChildTextNode( document : Document, parentElement : Element, namespaceUri : String, qualifiedName : String, text : String ) {
    var childElement = addChildElement( document, parentElement, namespaceUri, qualifiedName )
    childElement.setTextContent( text )
  }
  
  private function createQuery( address : Address ) : String {
    var query = new StringBuilder()
    
    appendtoQuery( query, address.AddressLine1, false )
    appendtoQuery( query, address.AddressLine2, true )
    appendtoQuery( query, address.AddressLine3, true )
    
    appendtoQuery( query, address.City, true )
    appendtoQuery( query, address.County, true )
    appendtoQuery( query, address.State.Code, true )
    appendtoQuery( query, address.PostalCode, false )
    appendtoQuery( query, address.Country.Code, true )
    
    return query.toString()
  }
  
  private function appendtoQuery( query : StringBuilder, addressAttribute : String, prependComma : boolean ) { 
    if ( addressAttribute != null ) {
      addressAttribute = addressAttribute.trim()
      if ( addressAttribute.length > 0 ) {
        if ( query.length() > 0 && prependComma ) {
          query.append( "," )
        }
        addressAttribute = ( query.length() > 0 ? " " : "" ) + addressAttribute
        
        query.append( addressAttribute )
      }
    }
  }
  
  private function logXmlForDebug( label : String, document : Document ) {
    PLLoggerCategory.GEODATA.debug( "\n" + label + ":\n" + transformXml( document, true ) )
  }
  
  private function transformXml( document : Document, debug : boolean ) : String {
    // set up transformer
    var transformerFactory = TransformerFactory.newInstance()
    if ( debug ) {
      transformerFactory.setAttribute( "indent-number", 2 )
    }
    
    var transformer = transformerFactory.newTransformer()
    if ( debug ) {
      transformer.setOutputProperty( OutputKeys.INDENT, "yes" )
    }
    
    // create xml string from tree
    var stringWriter = new StringWriter()
    var streamResult = new StreamResult( stringWriter )
    var domSource = new DOMSource( document )
    transformer.transform( domSource, streamResult )
    
    return stringWriter.toString()
  }
  
  private function sendSOAPMessageRequest( serviceSoapMessageRequestDocument : Document, serviceEndpointUri : String, soapAction : String ) : Document {
    // set up connection
    var serviceEndpointUrl = new URL( serviceEndpointUri )
    var httpUrlConnection = serviceEndpointUrl.openConnection() as HttpURLConnection
    
    httpUrlConnection.setDoOutput( true )
    httpUrlConnection.setRequestMethod( "POST" )
    httpUrlConnection.setRequestProperty( "Content-type", "text/xml; charset=utf-8" )
    httpUrlConnection.setRequestProperty( "SOAPAction", soapAction )
    
    var outputStream = httpUrlConnection.getOutputStream()
    outputStream.write( transformXml( serviceSoapMessageRequestDocument, false ).getBytes( UTF8_CHARSET ) )
    outputStream.flush()
    
    // make connection
    var inputStream = httpUrlConnection.getInputStream()
    
    // convert response to string
    var bufferedReader = new BufferedReader( new InputStreamReader( inputStream ) )
    var response = new StringBuilder()
    var line : String = null
    while ( true ) {
      line = bufferedReader.readLine()
      if (line == null ) {
        break
      }
      
      response.append( line )
    }
    var xmlResponse = response.toString()
    
    // convert response to document
    var xmlResponseBytesArrayInputStream = new ByteArrayInputStream( xmlResponse.getBytes() )
    return DocumentBuilderFactory.newInstance().newDocumentBuilder().parse( xmlResponseBytesArrayInputStream )
  }
  
  private function getGeocodeResultElement( geocodeSoapMessageRequestDocument : Document ) : Element {
    var bodyElement = getBodyElement( geocodeSoapMessageRequestDocument )
    
    var geocodeResponseElement = getFirstMatchingImmediateChildElement( bodyElement, "GeocodeResponse", true )
    var contractGeocodeResultElement = getFirstMatchingImmediateChildElement( geocodeResponseElement, "GeocodeResult", true )
    var resultsElement = getFirstMatchingImmediateChildElement( contractGeocodeResultElement, "Results", true )
    
    return getFirstMatchingImmediateChildElement( resultsElement, "GeocodeResult", false )
  }
  
  // note: an assumption is being made that the first child of the document will be the envelope element
  // since this is a soap message
  private function getBodyElement( soapDocument : Document ) : Element {
    var envelopeElement = soapDocument.getFirstChild() as Element
    return getFirstMatchingImmediateChildElement( envelopeElement, "Body", true )
  }
  
  // note: this method does not search through all child nodes in the manner Element::getElementsByTagNameNS() will
  // retrieve all matching child nodes at all depths below the parent to find the first matching element.  instead, this
  // method will only retrieve matching nodes that are immediate children of the parent parameter to find the first
  // matching element.
  private function getFirstMatchingImmediateChildElement( parentElement : Element, qualifiedName : String, requiredElement : Boolean ) : Element {
    var firstMatchingImmediateChildElement : Element = null
    
    var childNodes = parentElement.ChildNodes
    for ( var i in childNodes.Length ) {
      var childElement = childNodes.item( i ) as Element
      if ( getQualifiedName( childElement ).compareToIgnoreCase( qualifiedName ) == 0 ) {
        firstMatchingImmediateChildElement = childElement
        break
      }
    }
    
    if ( requiredElement && firstMatchingImmediateChildElement == null ) {
      throw new Exception( "No matching \"" + qualifiedName + "\" child element found in \"" + getQualifiedName( parentElement ) + "\"" )
    }
    
    return firstMatchingImmediateChildElement
  }
  
  // note: this method removes the prefix and colon from the tag name
  private function getQualifiedName( element : Element ) : String {
    var qualifiedName = element.TagName
    
    var colonIndex = qualifiedName.indexOf( ":" ) + 1
    if ( colonIndex > 0 ) {
      qualifiedName = qualifiedName.substring( colonIndex )
    }
    
    return qualifiedName
  }
  
  private function extractAddressFromBingMapsGeocodeResult( geocodeResultElement : Element ) : Address {
    var address = new Address()
    
    if ( geocodeResultElement == null ) {
      address.GeocodeStatus = GeocodeStatus.TC_FAILURE
    } else {
      var addressElement = getFirstMatchingImmediateChildElement( geocodeResultElement, "Address", true )
      address.AddressLine1 = getFirstMatchingImmediateChildElementValue( addressElement, "AddressLine" )
      address.City = getFirstMatchingImmediateChildElementValue( addressElement, "Locality" )
      address.State = getStateByNameOrCode( getFirstMatchingImmediateChildElementValue( addressElement, "AdminDistrict" ) )
      address.PostalCode = getFirstMatchingImmediateChildElementValue( addressElement, "PostalCode" )
      address.Country = getCountryTypeCodeByName( getFirstMatchingImmediateChildElementValue( addressElement, "CountryRegion" ) )
    
      // get the first location from the list
      var locationsElement = getFirstMatchingImmediateChildElement( geocodeResultElement, "Locations", true )
      var geocodeLocationElement = getFirstMatchingImmediateChildElement( locationsElement, "GeocodeLocation", true )
      address.Latitude = getFirstMatchingImmediateChildElementValue( geocodeLocationElement, "Latitude" ) as BigDecimal
      address.Longitude = getFirstMatchingImmediateChildElementValue( geocodeLocationElement, "Longitude" ) as BigDecimal
    
      // confidence can be "High", "Medium". or "Low"
      var confidence = getFirstMatchingImmediateChildElementValue( geocodeResultElement, "Confidence" )
      if ( confidence == "High" ) {
        address.GeocodeStatus = GeocodeStatus.TC_EXACT
      } else if ( confidence == "Medium" ) {
        address.GeocodeStatus = GeocodeStatus.TC_POSTALCODE
      } else {
        address.GeocodeStatus = GeocodeStatus.TC_CITY      
      }
    }
    
    return address
  }
  
  private function getFirstMatchingImmediateChildElementValue( parentElement : Element, qualifiedName : String ) : String {
    var childElementValue = ""
  
    var childElement = getFirstMatchingImmediateChildElement( parentElement, qualifiedName, true )
    
    var childElementNode = childElement.FirstChild
    if ( childElementNode != null ) {
        childElementValue = childElementNode.NodeValue
    }
    
    return childElementValue
  }
  
  private function createRouteSOAPMessageRequestDocument( startLatLong : AbstractGeocodePlugin.LatLong, finishLatLong : AbstractGeocodePlugin.LatLong, unit : UnitOfDistance ) : Document {
    var routeSoapMessageRequestDocument = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument()
    
    // create message request envelope
    // return body element
    var bodyElement = createSOAPMessageRequestEnvelope( routeSoapMessageRequestDocument )
    
    var calculateRouteElement = addChildElement( routeSoapMessageRequestDocument, bodyElement, ROUTE_CONTRACTS_NAMESPACE_URI, "CalculateRoute" )
    var requestElement = addChildElement( routeSoapMessageRequestDocument, calculateRouteElement, ROUTE_CONTRACTS_NAMESPACE_URI, "request" )
    
    addCredentialsElement( routeSoapMessageRequestDocument, requestElement )
    addUserProfileElement( routeSoapMessageRequestDocument, requestElement, unit )
    
    // add waypoints element
    var waypointsElement = addChildElement( routeSoapMessageRequestDocument, requestElement, ROUTE_SERVICE_NAMESPACE_URI, "Waypoints" )
    
    // add start waypoint
    addWaypointElement( routeSoapMessageRequestDocument, waypointsElement, startLatLong._latitude as String, startLatLong._longitude as String )
    // add end waypoint
    addWaypointElement( routeSoapMessageRequestDocument, waypointsElement, finishLatLong._latitude as String, finishLatLong._longitude as String )
    
    return routeSoapMessageRequestDocument
  }
  
  private function addUserProfileElement( routeSoapMessageRequestDocument : Document, requestElement : Element, unit : UnitOfDistance ) {
    var userProfileElement = addChildElement( routeSoapMessageRequestDocument, requestElement, COMMON_NAMESPACE_URI, "UserProfile" )
    
    var userProfileUnit = unit == UnitOfDistance.TC_MILE ? "Mile" : "Kilometer"
    addChildTextNode( routeSoapMessageRequestDocument, userProfileElement, COMMON_NAMESPACE_URI, "DistanceUnit", userProfileUnit )
  }
  
  private function addWaypointElement( routeSoapMessageRequestDocument : Document, waypointsElement : Element, latitude : String, longitude : String ) {
    var waypointElement = addChildElement( routeSoapMessageRequestDocument, waypointsElement, ROUTE_SERVICE_NAMESPACE_URI, "Waypoint" )
    var locationElement = addChildElement( routeSoapMessageRequestDocument, waypointElement, ROUTE_SERVICE_NAMESPACE_URI, "Location" )
    
    addChildTextNode( routeSoapMessageRequestDocument, locationElement, COMMON_NAMESPACE_URI, "Latitude", latitude )
    addChildTextNode( routeSoapMessageRequestDocument, locationElement, COMMON_NAMESPACE_URI, "Longitude", longitude )
  }
  
  private function getResultElementForRoute( routeSoapMessageRequestDocument : Document ) : Element {
    var bodyElement = getBodyElement( routeSoapMessageRequestDocument )
    
    var calculateRouteResponseElement = getFirstMatchingImmediateChildElement( bodyElement, "CalculateRouteResponse", true )
    var calculateRouteResultElement = getFirstMatchingImmediateChildElement( calculateRouteResponseElement, "CalculateRouteResult", true )
    
    return getFirstMatchingImmediateChildElement( calculateRouteResultElement, "Result", true )
  }
  
  private function extractDrivingDirectionsFromBingMapsResultForRoute( resultElement : Element , startAddress : Address, finishAddress : Address, unit : UnitOfDistance ) : DrivingDirections {
    var drivingDirections = DrivingDirections.createPreparedDrivingDirections( startAddress, finishAddress, unit )
    
    var legsElement = getFirstMatchingImmediateChildElement(resultElement, "Legs", true )
    var routeLegElement = getFirstMatchingImmediateChildElement(legsElement, "RouteLeg", true )
    var itineraryElement = getFirstMatchingImmediateChildElement(routeLegElement, "Itinerary", true )
    
    var  childNodes = itineraryElement.ChildNodes
    for ( var i in childNodes.Length ) {
      var itineraryItemElement = childNodes.item( i ) as Element
      var text = getFirstMatchingImmediateChildElementValue( itineraryItemElement, "Text" )
      var instruction = removeVirtualEarthMarkupTags( text )
      
      var summaryElement = getFirstMatchingImmediateChildElement( itineraryItemElement, "Summary", true )
      var distance = getFirstMatchingImmediateChildElementValue( summaryElement, "Distance" ) as BigDecimal
      var timeInSeconds = getFirstMatchingImmediateChildElementValue( summaryElement, "TimeInSeconds" ) as Integer 
      
      drivingDirections.addNewElement( formatDrivingInstruction( instruction ), distance, timeInSeconds )
    }
    
    var summaryElement = getFirstMatchingImmediateChildElement(resultElement, "Summary", true )
    drivingDirections.TotalDistance = getFirstMatchingImmediateChildElementValue(summaryElement, "Distance" ) as BigDecimal
    drivingDirections.TotalTime = getFirstMatchingImmediateChildElementValue(summaryElement, "TimeInSeconds" ) as Integer
    
    return drivingDirections
  }
  
  private function removeVirtualEarthMarkupTags( itineraryItemText : String ) : String {
    final var matcher = REGEX_MARKUP_TAG.matcher( itineraryItemText )
    return matcher.replaceAll("")
  }
  
  private function setMapOverviewUrlForDrivingDirections( drivingDirections : DrivingDirections, startLatLong : AbstractGeocodePlugin.LatLong, finishLatLong : AbstractGeocodePlugin.LatLong ) {
    var mapOverviewUrl = getBingMapsImageryRESTUrl( "Routes" )
    
    // set waypoint params
    mapOverviewUrl = mapOverviewUrl + "&wp.0=" + getPoint( startLatLong )
    mapOverviewUrl = mapOverviewUrl + "&wp.1=" + getPoint( finishLatLong )
    
    drivingDirections.setMapOverviewUrl( mapOverviewUrl )
  }
  
  private function getBingMapsImageryRESTUrl( RESTEntryPoint : String ) : String {
    var bingMapsImageryRESTUrl = "http://dev.virtualearth.net/REST/v1/Imagery/Map/Road/" + RESTEntryPoint + "?"
    
    // set application key
    bingMapsImageryRESTUrl += "key=" + _applicationKey
    // set map size in pixels
    bingMapsImageryRESTUrl += "&mapSize=" + _mapUrlWidth + "," + _mapUrlHeight
    
    return bingMapsImageryRESTUrl
  }
  
  private function getPoint( latLong : AbstractGeocodePlugin.LatLong ) : String {
    return latLong._latitude + "," + latLong._longitude
  }
  
  override public function pluginSupportsDrivingDirections() : boolean {
    return true
  }

  override public function pluginReturnsOverviewMapWithDrivingDirections() : boolean {
    return true
  }

}