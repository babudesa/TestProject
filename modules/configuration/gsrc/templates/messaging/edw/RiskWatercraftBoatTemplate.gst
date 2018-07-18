<% uses templates.messaging.edw.RiskVehicleTemplate %>
<% uses templates.messaging.edw.CoverageTemplateEDW %>
<% uses templates.messaging.edw.CoverageCauseOfLossTemplateEDW %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(theclaim : Claim, exposure : Exposure, thevehicleRU : VehicleRU, objStatus : String, riskCat : String, eventName : String, edwrisktypecode : String) %>
<%var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()%>
<% if (thevehicleRU != null && thevehicleRU.Vehicle != null) { %>
<Risk>
  <PublicID><%=thevehicleRU.Vehicle.PublicID%>:<%=theclaim.ClaimNumber%>:<%=edwrisktypecode%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>

  <UnVerifiedRisk>
    <Watercraft>
      <Boat>
        <%=RiskVehicleTemplate.renderToString(thevehicleRU.Vehicle, "")%>
      </Boat>
    </Watercraft>
  </UnVerifiedRisk>

  <%=riskCat%>

  <%
  var hasVehicleCoverage : boolean = false;
  for (temp in thevehicleRU.Coverages) {
    if (temp typeis VehicleCoverage && temp.EngineExt == null and temp.TrailerExt == null) {
      hasVehicleCoverage = true;
    }
  }
  %>
  <% if (hasVehicleCoverage) {%>
  <Coverages>
    <% for(thecoverage in thevehicleRU.Coverages ) {%>
    <%
    var typeCode = typecodeMapper.getInternalCodeByAlias( "EDWRiskType", "CoverageRisk", thecoverage.Type.Code);
    if (thecoverage typeis VehicleCoverage && thecoverage.EngineExt == null
    && thecoverage.TrailerExt == null and typeCode != null) {
      var oStatus = objStatus;
      if (objStatus == "D") {
        oStatus = "E";
      } else if (thecoverage.New and eventName != "CoverageRemoved") {
        oStatus = "A";
      }
    %>
    <%=CoverageTemplateEDW.renderToString(thecoverage.Policy, thecoverage, oStatus, displaykey.EDW.Templates.CVRG, typeCode)%>
    <%if (thecoverage.CauseOfLossExt != null) {%>
    <%=CoverageCauseOfLossTemplateEDW.renderToString(thecoverage, oStatus)%>
    <%}%>
    <%}%>
    <%}%>
  </Coverages>
  <%}%>

  <%var partyRelTo = "<PartyRelTo><PublicID>"+thevehicleRU.Vehicle.PublicID+":"+theclaim.ClaimNumber+":"+edwrisktypecode+"</PublicID><RelToType>Risk</RelToType></PartyRelTo>"%>
  <% if (thevehicleRU.CreateUser != null || thevehicleRU.UpdateUser != null) {%>
  <Parties>
    <% if (thevehicleRU.CreateUser != null) { %>
    <%=UserTemplate.renderToString(thevehicleRU.CreateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
    <%}%>
    <% if (thevehicleRU.UpdateUser != null) { %>
    <%=UserTemplate.renderToString(thevehicleRU.UpdateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
    <%}%>
  </Parties>
  <%}%>
</Risk>
<%}%>