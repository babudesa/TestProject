<% uses templates.messaging.edw.RiskVehicleTrailerTemplate %>
<% uses templates.messaging.edw.CoverageTemplateEDW %>
<% uses templates.messaging.edw.CoverageCauseOfLossTemplateEDW %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(theclaim : Claim, thevehicleRU : VehicleRU, thetrailer : TrailerExt, objStatus : String, riskCat : String, eventName : String, edwrisktypecode : String) %>
<%var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()%>
<% if (thetrailer != null && thevehicleRU != null && thevehicleRU.Vehicle != null) {%>
<Risk>
  <PublicID><%=thetrailer.PublicID%>:<%=theclaim.ClaimNumber%>:<%=edwrisktypecode%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>

  <UnVerifiedRisk>
    <Watercraft>
      <%=RiskVehicleTrailerTemplate.renderToString(thetrailer)%>
    </Watercraft>
  </UnVerifiedRisk>

  <%=riskCat%>

  <%
  var hasTrailerCoverage : boolean = false;
  for (temp in thevehicleRU.Coverages) {
    if (temp typeis VehicleCoverage && temp.TrailerExt != null and temp.TrailerExt == thetrailer) {
      hasTrailerCoverage = true;
    }
  }
  %>
  <% if (hasTrailerCoverage) { %>
  <Coverages>
    <% for(thecoverage in thevehicleRU.Coverages ) {%>
    <%
    var typeCode = typecodeMapper.getInternalCodeByAlias( "EDWRiskType", "CoverageRisk", thecoverage.Type.Code);
    if (thecoverage typeis VehicleCoverage && thecoverage.TrailerExt != null
    && thecoverage.TrailerExt == thetrailer && typeCode != null) {
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

  <%var partyRelTo = "<PartyRelTo><PublicID>"+thetrailer.PublicID+":"+theclaim.ClaimNumber+":"+edwrisktypecode+"</PublicID><RelToType>Risk</RelToType></PartyRelTo>"%>
  <% if (thetrailer.CreateUser != null || thetrailer.UpdateUser != null) {%>
  <Parties>
    <% if (thetrailer.CreateUser != null) { %>
    <%=UserTemplate.renderToString(thetrailer.CreateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
    <%}%>
    <% if (thetrailer.UpdateUser != null) { %>
    <%=UserTemplate.renderToString(thetrailer.UpdateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
    <%}%>
  </Parties>
  <%}%>
  <% if (thevehicleRU.Vehicle.PublicID != null) {%>
  <RelToRisk><%=thevehicleRU.Vehicle.PublicID%>:<%=theclaim.ClaimNumber%>:BOAT</RelToRisk>
  <%}%>
</Risk>
<%}%>
