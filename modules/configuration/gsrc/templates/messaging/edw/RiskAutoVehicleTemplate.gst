<% uses templates.messaging.edw.RiskVehicleTemplate %>
<% uses templates.messaging.edw.CoverageTemplateEDW %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(theclaim : Claim, thevehicleRU : VehicleRU, objStatus : String, riskCat : String, eventName : String, edwrisktypecode : String) %>
<% if (thevehicleRU != null && thevehicleRU.Vehicle != null) { %>
<Risk>
  <PublicID><%=thevehicleRU.Vehicle.PublicID%>:<%=theclaim.ClaimNumber%>:<%=edwrisktypecode%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>

  <UnVerifiedRisk>
    <Auto>
      <%=RiskVehicleTemplate.renderToString(thevehicleRU.Vehicle, "")%>
    </Auto>
  </UnVerifiedRisk>

  <%=riskCat%>

  <%if (thevehicleRU.Coverages != null && thevehicleRU.Coverages.length > 0 && eventName != "") {%>
  <Coverages>
    <% for(thecoverage in thevehicleRU.Coverages ) {%>
    <%
    var thetypecode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getInternalCodeByAlias( "EDWRiskType", "CoverageRisk", thecoverage.Type.Code);
    if (thetypecode != null) {
      var oStatus = objStatus;
      if (objStatus == "D") {
        oStatus = "E";
      } else if (thecoverage.New and eventName != "CoverageRemoved") {
        oStatus = "A";
      }
    %>
    <%=CoverageTemplateEDW.renderToString(thecoverage.Policy, thecoverage, oStatus,  displaykey.EDW.Templates.CVRG, thetypecode)%>
    <%}%>
    <%}%>
  </Coverages>
  <%}%>

  <%if (thevehicleRU.CreateUser != null || thevehicleRU.UpdateUser != null) {%>
  <%var partyRelTo = "<PartyRelTo><PublicID>"+thevehicleRU.Vehicle.PublicID+":"+theclaim.ClaimNumber+":"+edwrisktypecode+"</PublicID><RelToType>Risk</RelToType></PartyRelTo>"%>
  <Parties>
    <%if (thevehicleRU.CreateUser != null) { %>
    <%=UserTemplate.renderToString(thevehicleRU.CreateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
    <%}%>
    <%if (thevehicleRU.UpdateUser != null) { %>
    <%=UserTemplate.renderToString(thevehicleRU.UpdateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
    <%}%>
  </Parties>
  <%}%>
</Risk>
<%}%>