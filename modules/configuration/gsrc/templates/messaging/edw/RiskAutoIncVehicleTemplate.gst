<% uses templates.messaging.edw.RiskVehicleTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(theclaim : Claim, thevehicle : Vehicle, objStatus : String, riskCat : String, eventName : String, edwrisktypecode : String, vehcategory : String) %>
<% if (thevehicle != null) { %>
<Risk>
  <PublicID><%=thevehicle.PublicID%>:<%=theclaim.ClaimNumber%>:<%=edwrisktypecode%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>

  <UnVerifiedRisk>
    <Auto>
      <%=RiskVehicleTemplate.renderToString(thevehicle, vehcategory)%>
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