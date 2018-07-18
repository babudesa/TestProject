<%@ params(theclaim : Claim, thepolicy : Policy, objStatus : String, eventName : String) %>
<%
uses java.util.SortedMap;
uses java.util.TreeMap;
uses templates.messaging.edw.RiskEquineTemplate
uses templates.messaging.edw.RiskCommonTemplate
var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper();

var polCoverageTypes : SortedMap<String, String> = new TreeMap<String, String>();
for(pc in thepolicy.Coverages) {
  var typeCode = typecodeMapper.getInternalCodeByAlias( "EDWRiskType", "CoverageRisk", pc.Type.Code);
  if (typeCode != null and typeCode != "NONE") {
    if (theclaim.BusinessLineExt != null and theclaim.BusinessLineExt == "AGRIPROPERTY" and typeCode != "FPOPS") {
      polCoverageTypes.put(pc.PublicID, typeCode);
    } else {
      polCoverageTypes.put(typeCode, typeCode);
    }
  }
}
%>
<%if (thepolicy.PolicyType.Code == PolicyType.TC_AMP or thepolicy.PolicyType.Code == PolicyType.TC_AMO) {%>
<%=RiskEquineTemplate.renderToString(theclaim, thepolicy, objStatus, polCoverageTypes, eventName)%>
<%} else {%>
<%=RiskCommonTemplate.renderToString(theclaim, thepolicy, objStatus, polCoverageTypes, eventName)%>
<%}%>
