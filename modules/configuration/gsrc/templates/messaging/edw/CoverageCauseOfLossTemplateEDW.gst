<% uses templates.messaging.edw.ChildCoverageCauseOfLossTemplateEDW %>
<%@ params(thecoverage : Coverage, objStatus : String) %>
<%
var parentCode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "CoverageType", "EDWParentBusinessCoverageCode", thecoverage.Type.Code);
var childCode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "CoverageType", "EDWChildBusinessCoverageCode", thecoverage.Type.Code);
var risktypecode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getInternalCodeByAlias( "EDWRiskType", "CoverageRisk", thecoverage.Type.Code);
var businessCoverageCode = (parentCode != null) ? parentCode : childCode;

if (thecoverage != null and thecoverage.CauseOfLossExt != null) {
  if (businessCoverageCode != null) {
    var theparentpublicid = thecoverage.PublicID + ":" + businessCoverageCode;
%>
<%=ChildCoverageCauseOfLossTemplateEDW.renderToString(thecoverage, thecoverage.CauseOfLossExt, risktypecode, objStatus, theparentpublicid)%>
<%}%>
<%}%>
