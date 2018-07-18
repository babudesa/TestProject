<% uses templates.messaging.LDM.commons.MatterString %>
<% uses templates.messaging.LDM.commons.MatterDate %>
<% uses templates.messaging.LDM.commons.MatterBit %>
<% uses org.apache.commons.lang.StringEscapeUtils %>

<%@ params(ae : AssignmentExposureExt, actionDescription : String) %>

<LawFeature>
  <ActionDesc><%=actionDescription%></ActionDesc>
  <%=MatterString.renderToString(ae.Exposure.PublicID,"ID")%>
  <%=MatterString.renderToString(ae.Exposure.Claimant.PublicID,"ClaimantID")%>
  <%if(ae.Exposure.Closed){%>
    <FeatureStatus>Closed</FeatureStatus>
  <%}else{%>
    <FeatureStatus>Open</FeatureStatus>
  <%}%>
  <MatterID><%=ae.Assignment.PublicID%></MatterID>
  <%if(ae.Assignment.LSSMatterID != null){%>
    <%=MatterString.renderToString(ae.Assignment.LSSMatterID.toString(), "MatterNumber")%>
  <% } else { %>
    <%=MatterString.renderToString(ae.Assignment.AssignmentIDNumber, "MatterNumber")%>
  <% } %>
  <% if(ae.OpposingCounselFirmExt != null) { %>
    <OpposingCounselFirmID><%=ae.OpposingCounselFirmExt.PublicID%></OpposingCounselFirmID>
  <% } %>
  <% if(ae.OpposingLeadCounselExt != null) { %>
    <OpposingLeadCounselID><%=ae.OpposingLeadCounselExt.PublicID%></OpposingLeadCounselID>
  <% } %>
  <% if(ae.DispositionTypeExt != null) { %>
    <DispositionDesc><%=StringEscapeUtils.escapeXml(ae.DispositionTypeExt.Description)%></DispositionDesc>
  <% } %>  
  <%=MatterDate.renderToString(ae.DispositionDateExt,"DispositionDate")%>
  <%=MatterBit.renderToString(ae.PrimaryClaimantExt, "PrimaryClaimantInd")%>
  <AdjusterID><%=ae.Exposure.AssignedUser.Contact.PublicID%></AdjusterID>
  <%=MatterDate.renderToString(ae.Assignment.Matter.ClaimantRepDateExt, "ClaimantRepresentationDate")%>
</LawFeature>