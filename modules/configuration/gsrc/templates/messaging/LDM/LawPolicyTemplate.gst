<%@ params(ma : MatterAssignmentExt, actionDescription : String) %>
<% uses templates.messaging.LDM.commons.MatterString %>
<% uses org.apache.commons.lang.StringEscapeUtils %>
<% var policy = ma.Matter.Claim.Policy %>

<LawPolicy>
  <ActionDesc><%=actionDescription%></ActionDesc>
  <MatterID><%=ma.PublicID%></MatterID>
  <%if(ma.LSSMatterID != null ){%>
    <%=MatterString.renderToString(ma.LSSMatterID.toString(), "MatterNumber")%>
  <%}else{%>
    <%=MatterString.renderToString(ma.AssignmentIDNumber, "MatterNumber")%>
  <% } %>
  <PolicyID><%=ma.Matter.Claim.Policy.PublicID%></PolicyID>
  <PolicyNumber><%=ma.Matter.Claim.Policy.PolicyNumber%></PolicyNumber>
  <PolicyEffectiveDate><%=ma.Matter.Claim.Policy.EffectiveDate%></PolicyEffectiveDate>
  <PolicyExpirationDate><%=ma.Matter.Claim.Policy.ExpirationDate%></PolicyExpirationDate>
  <PolicyVersion><%=policy.ex_PolicyVersion%></PolicyVersion>
  <PolicyMod><%=policy.PolicySuffix%></PolicyMod>
  <PolicySymbol><%=policy.PolicyType%></PolicySymbol>
  <DivisionName/>
  <DivisionOffice/>
  <InsuredNameID><%=policy.insured.PublicID%></InsuredNameID>
  <%if(policy.insured.Name typeis Person){%>
    <InsuredName><%=StringEscapeUtils.escapeXml(policy.insured.Name)%></InsuredName>
  <%} else {%>
    <InsuredName><%=StringEscapeUtils.escapeXml(policy.insured.DisplayName)%></InsuredName>
  <%}%>
</LawPolicy>