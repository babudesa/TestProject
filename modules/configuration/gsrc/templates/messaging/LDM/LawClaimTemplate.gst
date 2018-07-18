<% uses templates.messaging.LDM.commons.MatterDate %>
<% uses templates.messaging.LDM.commons.MatterString %>
<% uses templates.messaging.LDM.commons.MatterBit %>
<% uses org.apache.commons.lang.StringEscapeUtils %>

<%@ params(ma : MatterAssignmentExt, ActionDescription : String) %>

<LawClaim>
  <MatterID><%=ma.PublicID%></MatterID>
  <ActionDesc><%=ActionDescription%></ActionDesc>
  <ClaimID><%=ma.Matter.Claim.PublicID%></ClaimID>
  <%=MatterString.renderToString(ma.Matter.Claim.ClaimNumber, "ClaimNumber")%>
  <%=MatterDate.renderToString(ma.Matter.Claim.ReportedDate, "ClaimReportedDate")%>
  <%=MatterDate.renderToString(ma.Matter.Claim.LossDate, "LossDate")%>  
  <%=MatterString.renderToString(StringEscapeUtils.escapeXml(ma.Matter.Claim.Description), "IncidentDescription")%>
  <%if(ma.LSSMatterID != null){%>
    <%=MatterString.renderToString(ma.LSSMatterID.toString(), "MatterNumber")%>
  <% } else { %>
    <%=MatterString.renderToString(ma.AssignmentIDNumber, "MatterNumber")%>
  <% } %>
  <%=MatterString.renderToString(ma.Matter.Claim.JurisClaimNumberExt, "JurisdictionCaseNumber")%>
</LawClaim>