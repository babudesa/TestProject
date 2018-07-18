<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(locationaddress : Address, objStatus : String, theClaim : Claim) %>
<LossLocation>
  <PublicID><%=theClaim.PublicID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <% if (locationaddress.AddressLine1 != null) {%>
  <AddressLine1><%=StringUtils.getXMLValue(locationaddress.AddressLine1, false)%></AddressLine1>
  <%}%>
  <% if (locationaddress.AddressLine2 != null) {%>
  <AddressLine2><%=StringUtils.getXMLValue(locationaddress.AddressLine2, false)%></AddressLine2>
  <%}%>
  <% if (locationaddress.AddressLine3 != null) {%>
  <AddressLine3><%=StringUtils.getXMLValue(locationaddress.AddressLine3, false)%></AddressLine3>
  <%}%>
  <% if (locationaddress.Longitude != null) {%>
  <Longitude><%=StringUtils.getXMLValue(locationaddress.Longitude as java.lang.String, false)%></Longitude>
  <%}%>
  <% if (locationaddress.Latitude != null) {%>
  <Latitude><%=StringUtils.getXMLValue(locationaddress.Latitude as java.lang.String, false)%></Latitude>
  <%}%>
  <AddressType>
    <Code>losslocation</Code>
    <Description>Loss Location</Description>
    <ListName>Loss Location</ListName>
  </AddressType>
  <% if (locationaddress.City != null) {%>
  <City><%=StringUtils.getXMLValue(locationaddress.City, false)%></City>
  <%}%>
  <% if (locationaddress.CityStateZip != null) {%>
  <CityStateZip><%=StringUtils.getXMLValue(locationaddress.CityStateZip, false)%></CityStateZip>
  <%}%>
  <% if (locationaddress.State != null) {%>
  <%=TypeListTemplate.renderToString(locationaddress.State, "State", locationaddress.State.ListName)%>
  <%} else {%>
  <State>
    <Code>--</Code>
    <Description>Other</Description>
    <ListName>State</ListName>
  </State>
  <%}%>
  <% if (locationaddress.Country != null) {%>
  <%=TypeListTemplate.renderToString(locationaddress.Country, "Country", locationaddress.Country.ListName)%>
  <%}%>
  <% if (locationaddress.County != null and locationaddress.State != null) {%>
  <% var countycd = util.gaic.CommonFunctions.getStateCounty( locationaddress.State, locationaddress.County );  %>
  <% if (countycd != "")  { %> 
  <County>
    <Code><%=countycd%></Code>
    <Description><%=StringUtils.getXMLValue(locationaddress.County, false)%></Description>
    <ListName>County</ListName>
  </County>
  <%}%>
  <%}%>
  <% if (locationaddress.PostalCode != null) {%>
  <PostalCode><%=locationaddress.trimPostalCode()%></PostalCode>
  <%}%>
  <PrimInd>true</PrimInd>
  <% if (locationaddress.Description != null) {%>
  <Description><%=locationaddress.Description%></Description>
  <%}%>
  <% if (locationaddress.DisplayName != null) {%>
  <DisplayName><%=StringUtils.getXMLValue(locationaddress.DisplayName, false)%></DisplayName>
  <%}%>
</LossLocation>