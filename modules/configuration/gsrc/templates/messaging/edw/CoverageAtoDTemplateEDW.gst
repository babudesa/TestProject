<% uses templates.messaging.edw.ChildCoverageAtoDTemplateEDW %>
<%@ params(thecoveragesublimit : CoverageBasisLimitExt, objStatus : String) %>
<%
var thecoverage = thecoveragesublimit.CoverageExt;
var parentCode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "CoverageType", "EDWParentBusinessCoverageCode", thecoverage.Type.Code);
var childCode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "CoverageType", "EDWChildBusinessCoverageCode", thecoverage.Type.Code);
var businessCoverageCode = (parentCode != null) ? parentCode : childCode;
if (businessCoverageCode != null) {
    var theparentpublicid = thecoverage.PublicID + ":" + businessCoverageCode;
%>
<%=ChildCoverageAtoDTemplateEDW.renderToString(thecoveragesublimit, objStatus, theparentpublicid)%>
<%}%>
