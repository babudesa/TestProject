<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.ClaimOtherCovTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(theclaim : Claim, objStatus : String) %>
<%var partyRelTo = "<PartyRelTo><PublicID>"+theclaim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>"%>
<%var origClaim = theclaim.OriginalVersion as Claim %>
<%var obStatus = (origClaim.BrokerPolicyNumberExt != null and theclaim.BrokerPolicyNumberExt == null) ? "D" : objStatus %>
<% if (theclaim.BrokerPolicyNumberExt != null or (origClaim.BrokerPolicyNumberExt != null and theclaim.BrokerPolicyNumberExt == null)) {%>
  <OtherCoverage>
    <PublicID>cothbp:<%=theclaim.PublicID%></PublicID>
    <ObjectStatus><%=obStatus%></ObjectStatus> 
    <% if (theclaim.CreateTime != null) {%>
      <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theclaim.UpdateTime != null) {%>
      <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.UpdateTime)%></UpdateTime> 
    <%}%>
    <OtherCovCategory>
      <Code>brokerpolicy</Code>
      <Description>brokerpolicy</Description>
      <ListName>ClaimOtherInsuranceType</ListName>
    </OtherCovCategory>
    <% if (theclaim.BrokerPolicyNumberExt != null) {%>
       <PolicyNumberExt><%=theclaim.BrokerPolicyNumberExt%></PolicyNumberExt> 
    <%}%>
    <Parties>
    <% if (theclaim.CreateUser != null ) { %>
        <%=UserTemplate.renderToString(theclaim.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
    <%}%>

    <% if (theclaim.UpdateUser != null) { %>
        <%=UserTemplate.renderToString(theclaim.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
    <%}%>	
    </Parties>
  </OtherCoverage>
<%}%>