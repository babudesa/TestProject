<% uses templates.messaging.edw.RiskVehicleEngineTemplate %>
<% uses templates.messaging.edw.CoverageTemplateEDW %>
<% uses templates.messaging.edw.CoverageCauseOfLossTemplateEDW %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(theclaim : Claim, thevehicleRU : VehicleRU, theengine : EngineExt, objStatus : String, riskCat : String, eventName : String, edwrisktypecode : String) %>
<% if (theengine != null) {%>
<Risk>
  <PublicID><%=theengine.PublicID%>:<%=theclaim.ClaimNumber%>:<%=edwrisktypecode%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>

  <UnVerifiedRisk>
    <Watercraft>
      <%=RiskVehicleEngineTemplate.renderToString(theengine)%>
    </Watercraft>
  </UnVerifiedRisk>

  <%=riskCat%>

  <%
  var hasEngineCoverage : boolean = false;
  for (temp in thevehicleRU.Coverages) {
    if (temp typeis VehicleCoverage && temp.EngineExt != null && temp.EngineExt == theengine) {
      hasEngineCoverage = true;
    }
  }
  %>
<% if (hasEngineCoverage) {%>
  <Coverages>
    <% for(thecoverage in thevehicleRU.Coverages ) {%>
    <%
    var typeCode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getInternalCodeByAlias( "EDWRiskType", "CoverageRisk", thecoverage.Type.Code);
    if (thecoverage typeis VehicleCoverage && thecoverage.EngineExt != null
    && thecoverage.EngineExt == theengine && typeCode != null) {
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

  <%var partyRelTo = "<PartyRelTo><PublicID>"+theengine.PublicID+":"+theclaim.ClaimNumber+":"+edwrisktypecode+"</PublicID><RelToType>Risk</RelToType></PartyRelTo>"%>
  <% if (theengine.CreateUser != null || theengine.UpdateUser != null) {%>
  <Parties>
    <% if (theengine.CreateUser != null) { %>
    <%=UserTemplate.renderToString(theengine.CreateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
    <%}%>
    <% if (theengine.UpdateUser != null) { %>
    <%=UserTemplate.renderToString(theengine.UpdateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
    <%}%>
  </Parties>
  <%}%>
  <% if (theengine.Vehicle != null && theengine.Vehicle.PublicID != null) {%>
  <RelToRisk><%=theengine.Vehicle.PublicID%>:<%=theclaim.ClaimNumber%>:BOAT</RelToRisk> 
  <%}%>
</Risk>
<%}%>
<%}%>
