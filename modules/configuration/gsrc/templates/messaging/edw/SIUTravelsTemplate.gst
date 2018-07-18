<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PartyTemplate %>
<%@ params(thesiutravel : SIUTravelInfoExt, objStatus : String) %>
<SIUTravels>
  <PublicID><%=thesiutravel.PublicID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <% if (thesiutravel.TravelAddress != null) {%>
  <SIUPlace>
    <PublicID><%=thesiutravel.PublicID%></PublicID>
    <% if (thesiutravel.TravelAddress.City != null) {%>
    <City><%=thesiutravel.TravelAddress.City%></City>
    <%}%>
    <% if (thesiutravel.TravelAddress.State != null) {%>
    <%=TypeListTemplate.renderToString(thesiutravel.TravelAddress.State, "State", thesiutravel.TravelAddress.State.ListName)%>
    <%}%>
    <% if (thesiutravel.TravelAddress.Country != null) {%>
    <%=TypeListTemplate.renderToString(thesiutravel.TravelAddress.Country, "Country", thesiutravel.TravelAddress.Country.ListName)%>
    <%}%>
  </SIUPlace>
  <%}%>
  <% if (thesiutravel.TravelDt != null) {%>
  <%
  var items : String[] = thesiutravel.TravelDt.split("/");
  var themonth = items[0];
  var theyear = items[1];
  %>
  <TravelDt>
    <Month><%=themonth%></Month>
    <Year><%=theyear%></Year>
  </TravelDt> 
  <%}%>
  <% if (thesiutravel.SIUInvestigator != null) { var theinvestigator = thesiutravel.SIUInvestigator.Contact;%>
  <Parties>
    <%=PartyTemplate.renderToString(theinvestigator, "", objStatus, "", "", "", null, "", "")%>
  </Parties>
  <%}%>
</SIUTravels>