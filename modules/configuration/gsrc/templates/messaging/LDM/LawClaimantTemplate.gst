<% uses templates.messaging.LDM.commons.MatterDate %>
<% uses templates.messaging.LDM.commons.MatterString %>
<% uses templates.messaging.LDM.commons.MatterBit %>
<% uses org.apache.commons.lang.StringEscapeUtils %>

<%@ params(claimant : Contact, ActionDescription : String) %>
<%--  params(assignmentExpo : AssignmentExposureExt, claimant : Contact, ActionDescription : String) %> --%>

<Law_Claimant>
  <ActionDesc><%=ActionDescription%></ActionDesc>
  <ID><%=claimant.PublicID%></ID>
  <%if(claimant typeis Person) {%>
    <ClaimantName><%=StringEscapeUtils.escapeXml(claimant.FirstName)%></ClaimantName>
    <ClaimantSurname><%=StringEscapeUtils.escapeXml(claimant.LastName)%></ClaimantSurname>
  <%} else if(claimant typeis Company) { %>
    <ClaimantName><%=StringEscapeUtils.escapeXml(claimant.DisplayName)%></ClaimantName>
    <ClaimantSurname><%=StringEscapeUtils.escapeXml(claimant.DisplayName)%></ClaimantSurname>
  <%}%>
</Law_Claimant>
