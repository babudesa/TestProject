<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(theCheck : Check, theAddress : String, checkNumber : String, primInd : boolean, objStatus : String) %>
<%
var addressLine1 = theCheck.getAddressHistoryAddressLine1(theAddress);
var addressLine2 = theCheck.getAddressHistoryAddressLine2(theAddress);
var addressLine3 = "";
var longitude = "";
var latitude = "";
var addressType = theCheck.getAddressHistoryAddressType(theAddress);
var city = theCheck.getAddressHistoryCity(theAddress);
var cityStateZip = theCheck.getAddressHistoryCityStateZip(theAddress);
var state = theCheck.getAddressHistoryState(theAddress);
var country = theCheck.getAddressHistoryCountry(theAddress);
var county = theCheck.getAddressHistoryCounty(theAddress);
var postalCode = theCheck.getAddressHistoryPostalCode(theAddress);
var description = theCheck.getAddressHistoryDescription(theAddress);
var displayName = theCheck.getAddressHistoryDisplayName(theAddress);
%>
<PublicID><%=checkNumber%><%=theCheck.getAddressHistoryPublicID(theAddress)%></PublicID>
<ObjectStatus><%=objStatus%></ObjectStatus>
<% if (addressLine1 != null && (addressLine1 != "null" && !addressLine1.Empty)) {%>
<AddressLine1><%=StringUtils.getXMLValue(addressLine1, false)%></AddressLine1>
<%}%>
<% if (addressLine2 != null && (addressLine2 != "null" && !addressLine2.Empty)) {%>
<AddressLine2><%=StringUtils.getXMLValue(addressLine2, false)%></AddressLine2>
<%}%>
<% if (addressLine3 != null && (addressLine3 != "null" && !addressLine3.Empty)) {%>
<AddressLine3><%=StringUtils.getXMLValue(addressLine3, false)%></AddressLine3>
<%}%>
<% if (longitude != null && (longitude != "null" && !longitude.Empty)) {%>
<Longitude><%=StringUtils.getXMLValue(longitude, false)%></Longitude>
<%}%>
<% if (latitude != null && (latitude != "null" && !latitude.Empty)) {%>
<Latitude><%=StringUtils.getXMLValue(latitude, false)%></Latitude>
<%}%>

<AddressType>
<% if (addressType != null) {%>
  <Code><%=addressType.Code%></Code>
  <Description><%=addressType.Description%></Description>
  <ListName><%=addressType.ListName%></ListName>
<%} else {%>
  <Code>risklocation</Code> 
  <Description>risklocation</Description>
  <ListName>Risk Location</ListName>
<%}%>
</AddressType>

<% if (city != null && (city != "null" && !city.Empty)) {%>
<City><%=city%></City>
<%}%>

<% if (cityStateZip != null && cityStateZip != "null") {%>
<CityStateZip><%=cityStateZip%></CityStateZip>
<%}%>

<State>
<% if (state != null) {%>
  <Code><%=state.Code%></Code>
  <Description><%=state.Description%></Description>
  <ListName><%=state.ListName%></ListName>
<%} else {%>
  <Code>--</Code>
  <Description>Other</Description>
  <ListName>State</ListName>
<%}%>
</State>

<% if (country != null) {%>
<%=TypeListTemplate.renderToString(country, "Country", country.ListName)%>
<%}%>
<% if ((county != null && county != "null") and state != null) {%>
<% var countycd = util.gaic.CommonFunctions.getStateCounty( state, county );  %>
<% if (countycd != "")  { %> 
<County>
  <Code><%=countycd%></Code>
  <Description><%=StringUtils.getXMLValue(county, false)%></Description>
  <ListName>County</ListName>
</County>
<%}%>
<%}%>
<% if (postalCode != null && postalCode != "null") {%>
<PostalCode><%=postalCode%></PostalCode>
<%}%>
<PrimInd><%=primInd%></PrimInd>
<% if (description != null && description != "null") {%>
<Description><%=description%></Description>
<%}%>
<% if (displayName != null && displayName != "null") {%>
<DisplayName><%=StringUtils.getXMLValue(displayName, false)%></DisplayName>
<%}%>