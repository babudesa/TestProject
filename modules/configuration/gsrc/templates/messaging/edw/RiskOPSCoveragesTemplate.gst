<% uses templates.messaging.edw.CoverageTemplateEDW %>
<% uses templates.messaging.edw.CoverageCauseOfLossTemplateEDW %>
<%@ params(theclaim : Claim, thepolicy : Policy, objStatus : String, riskOpsType : String, riskType : String, eventName : String) %>
<% if (thepolicy.Coverages != null and thepolicy.Coverages.length > 0) {%>
<Coverages>
  <%
  var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper();
  var tempRiskOpsType = "";
  if (thepolicy.PolicyType.Code == PolicyType.TC_AMP or thepolicy.PolicyType.Code == PolicyType.TC_AMO) {
    tempRiskOpsType = "POLICY";
  } else {
    tempRiskOpsType = riskOpsType;
  }
  for (var pc in thepolicy.Coverages) {
    if (tempRiskOpsType == typecodeMapper.getInternalCodeByAlias( "EDWRiskType", "CoverageRisk", pc.Type.Code)) {
      if (!pc.isSPP() and (!pc.isAGBPol())) {
        if (pc.New and eventName != "CoverageRemoved") {
          objStatus = "A";
        }
  %>
  <%=CoverageTemplateEDW.renderToString(thepolicy, pc, objStatus, displaykey.EDW.Templates.CVRG, riskOpsType)%>
  <%} else if (riskType == pc.PublicID) {
    if (pc.New and eventName != "CoverageRemoved") {
      objStatus = "A";
    }
  %>
  <%=CoverageTemplateEDW.renderToString(thepolicy, pc, objStatus, displaykey.EDW.Templates.CVRG, riskOpsType)%>
  <%}%>
  <%if (pc.CauseOfLossExt != null) {%>
  <%=CoverageCauseOfLossTemplateEDW.renderToString(pc, objStatus)%>
  <%}%>
  <%}%>
  <%}%>
</Coverages>
<%}%>
