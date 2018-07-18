<% uses java.util.SortedMap %>
<% uses templates.messaging.edw.RiskEquinePropertyTemplate %>
<% uses templates.messaging.edw.RiskCommonTemplate %>
<%@ params(theclaim : Claim, thepolicy : Policy, objStatus : String, polCoverageTypes : SortedMap<String, String>, eventName : String) %>
<%var riskCat = "<RiskCat><Code>ANIMAL</Code><Description>ANIMAL</Description><ListName>EDWRiskType</ListName></RiskCat>"%>
<%=RiskCommonTemplate.renderToString(theclaim, thepolicy, objStatus, polCoverageTypes, eventName)%>

<% if (thepolicy.Properties != null) { %>
<% for (therisk in thepolicy.Properties) { %>
<%=RiskEquinePropertyTemplate.renderToString(theclaim, therisk, null, objStatus, riskCat, eventName, "policy")%>
<%}%>
<%}%>
