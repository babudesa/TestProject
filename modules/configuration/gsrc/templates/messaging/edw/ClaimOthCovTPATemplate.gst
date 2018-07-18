<% uses templates.messaging.edw.PartyTemplate %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(theclaim : Claim, tpAdmin : ThirdPartyAdminExt, objStatus : String, origStatus : String) %>
<%var partyRelTo = "<PartyRelTo><PublicID>"+theclaim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>"%>
<OtherCoverage>
  <PublicID>cothtp:<%=tpAdmin.PublicID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus> 
  <% if (tpAdmin.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(tpAdmin.CreateTime)%></CreateTime> 
  <%}%>
  <% if (tpAdmin.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(tpAdmin.UpdateTime)%></UpdateTime> 
  <%}%>
  
  <OtherCovCategory>
    <Code>insurertpa</Code>
    <Description>insurertpa</Description>
    <ListName>ClaimOtherInsuranceType</ListName>
  </OtherCovCategory>
  <% if (tpAdmin.PolicyNumber != null) {%>
    <PolicyNumberExt><%=tpAdmin.PolicyNumber%></PolicyNumberExt> 
  <%}%>

  
  <Parties>
  <% if (tpAdmin.CreateUser != null ) { %>
    <%=UserTemplate.renderToString(tpAdmin.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
  <%}%>

  <% if (tpAdmin.UpdateUser != null) { %>
    <%=UserTemplate.renderToString(tpAdmin.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
  <%}%>

  <% if (tpAdmin.InsurerTPA != null) { %>
    <% var oirole = "<Role><Code>InsuranceCarrier</Code><Description>Insurance Carrier</Description><ListName>InsuranceCarrier</ListName></Role>"%>
    <%=PartyTemplate.renderToString(tpAdmin.InsurerTPA, "", objStatus, oirole, "", partyRelTo, theclaim, "", "")%>
  <%}%>
 
  </Parties>
    <% if (tpAdmin.ClaimNumber != null) {%>
    <ClaimNumberExt><%=tpAdmin.ClaimNumber%></ClaimNumberExt> 
  <%}%>
  <% if (tpAdmin.AdditionalDetails != null) {%>
    <AdditionalDetailsExt><%=tpAdmin.AdditionalDetails%></AdditionalDetailsExt> 
  <%}%>
  </OtherCoverage>