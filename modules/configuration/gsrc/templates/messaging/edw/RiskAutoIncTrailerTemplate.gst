<% uses templates.messaging.edw.UserTemplate %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.commons.StringParseTemplate %>
<%@ params(exposure : Exposure, theclaim : Claim, thevehicle : Vehicle, objStatus : String, riskCat : String, eventName : String, edwrisktypecode : String, vehcategory : String) %>
<% if (thevehicle != null) { %>
<Risk>
  <PublicID><%=thevehicle.PublicID%>:<%=theclaim.ClaimNumber%>:<%=edwrisktypecode%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>

  <UnVerifiedRisk>
    <Auto>
      <% if (thevehicle.CreateTime != null) {%>
      <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thevehicle.CreateTime)%></CreateTime>
      <%}%>
      <% if (thevehicle.UpdateTime != null) {%>
      <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thevehicle.UpdateTime)%></UpdateTime>
      <%}%>
      <% if (thevehicle.TrailerMakeExt != null) {%>
      <Make><%= thevehicle.TrailerMakeExt %></Make> 
      <%}%>
      <% if (thevehicle.TrailerYearExt != null) {%>
      <Year><%=thevehicle.TrailerYearExt%></Year> 
      <%}%>
      <% if (thevehicle.RefrigerationExt != null) {%>
      <RefrigerationExt><%= thevehicle.RefrigerationExt %></RefrigerationExt> 
      <%}%>
      <% if (thevehicle.ModelYearExt != null) {%>
      <RefrigModelYearExt><%= thevehicle.ModelYearExt%></RefrigModelYearExt>
      <%}%>
      <% if (thevehicle.HoursExt != null) {%>
      <RefrigHoursExt><%= thevehicle.HoursExt%></RefrigHoursExt>
      <%}%>
      <% if (exposure.CargoExt != null && exposure.CargoExt.length > 0) { %> 
      <Cargo>
        <% for(k in exposure.CargoExt) {%>
	  <CargoExt>
	    <% if (k.CargoType != null) {%>
	    <%=TypeListTemplate.renderToString(k.CargoType, "CargoType", k.CargoType.ListName)%>
	    <%}%>
	    <%=StringParseTemplate.renderToString(k.Details, "Details")%>  
	  </CargoExt>
	  <%}%>
      </Cargo>
      <%}%>
      <% if (vehcategory != null and vehcategory != "") {%>
      <VehicleCategory><%=vehcategory%></VehicleCategory>
      <%}%>   
    </Auto>
  </UnVerifiedRisk>

  <%=riskCat%>

  <%if (thevehicle.CreateUser != null || thevehicle.UpdateUser != null) {%>
  <%var partyRelTo = "<PartyRelTo><PublicID>"+thevehicle.PublicID+":"+theclaim.ClaimNumber+":"+edwrisktypecode+"</PublicID><RelToType>Risk</RelToType></PartyRelTo>"%>
  <Parties>
    <%if (thevehicle.CreateUser != null) { %>
    <%=UserTemplate.renderToString(thevehicle.CreateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
    <%}%>
    <%if (thevehicle.UpdateUser != null) { %>
    <%=UserTemplate.renderToString(thevehicle.UpdateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
    <%}%>
  </Parties>
  <%}%>
</Risk>
<%}%>