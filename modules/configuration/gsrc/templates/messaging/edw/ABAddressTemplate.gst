<% uses util.StringUtils %>
<%@ params(theaddress : Address, primInd : Boolean, objStatus : String, checkNumber : String) %>
<PublicID><%=checkNumber%><%=theaddress.AddressBookUID%></PublicID>
<ObjectStatus><%=objStatus%></ObjectStatus>
<% if (theaddress.AddressLine1 != null) {%>
<AddressLine1><%=StringUtils.getXMLValue(theaddress.AddressLine1, false)%></AddressLine1>
<%}%>
<% if (theaddress.AddressLine2 != null) {%>
<AddressLine2><%=StringUtils.getXMLValue(theaddress.AddressLine2, false)%></AddressLine2>
<%}%>
<% if (theaddress.AddressLine3 != null) {%>
<AddressLine3><%=StringUtils.getXMLValue(theaddress.AddressLine3, false)%></AddressLine3>
<%}%>
<% if (theaddress.Longitude != null) {%>
<Longitude><%=StringUtils.getXMLValue(theaddress.Longitude as java.lang.String, false)%></Longitude>
<%}%>
<% if (theaddress.Latitude != null) {%>
<Latitude><%=StringUtils.getXMLValue(theaddress.Latitude as java.lang.String, false)%></Latitude>
<%}%>

<AddressType>
<% if (theaddress.AddressType != null) {%>
  <Code><%=theaddress.AddressType.Code%></Code>
  <Description><%=theaddress.AddressType.Description%></Description>
  <ListName><%=theaddress.AddressType.ListName%></ListName>
<%} else {%>
  <Code>risklocation</Code> 
  <Description>risklocation</Description>
  <ListName>Risk Location</ListName>
<%}%>
</AddressType>
<% if (theaddress.City != null) {%>
<City><%=theaddress.City%></City>
<%}%>

<% if (theaddress.CityStateZip != null) {%>
<CityStateZip><%=theaddress.CityStateZip%></CityStateZip>
<%}%>

<State>
<% if (theaddress.State != null) {%>
  <Code><%=theaddress.State.Code%></Code>
  <Description><%=theaddress.State.Description%></Description>
  <ListName><%=theaddress.State.ListName%></ListName>
<%} else {%>
  <Code>--</Code>
  <Description>Other</Description>
  <ListName>State</ListName>
<%}%>
</State>

<% if (theaddress.Country != null) {%>
<Country>
  <Code><%=StringUtils.getXMLValue(theaddress.Country.Code, false)%></Code>
  <Description><%=StringUtils.getXMLValue(theaddress.Country.Description, false)%></Description>
  <ListName><%=StringUtils.getXMLValue(theaddress.Country.ListName, false)%></ListName>
</Country>
<%}%>
<% if (theaddress.County != null and theaddress.State != null) {%>
<% var countycd = util.gaic.CommonFunctions.getStateCounty( theaddress.State, theaddress.County );  %>
<% if (countycd != "")  { %> 
<County>
  <Code><%=countycd%></Code>
  <Description><%=StringUtils.getXMLValue(theaddress.County, false)%></Description>
  <ListName>County</ListName>
</County>
<%}%>
<%}%>
<% if (theaddress.PostalCode != null) {%>
<PostalCode><%=theaddress.trimPostalCode()%></PostalCode>
<%}%>
<PrimInd><%=primInd%></PrimInd>
<% if (theaddress.Description != null) {%>
<Description><%=StringUtils.getXMLValue(theaddress.Description, false)%></Description>
<%}%>
<% if (theaddress.DisplayName != null) {%>
<DisplayName><%=StringUtils.getXMLValue(theaddress.DisplayName, false)%></DisplayName>
<%}%>