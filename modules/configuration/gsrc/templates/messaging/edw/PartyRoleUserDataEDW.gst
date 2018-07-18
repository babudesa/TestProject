<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(theUserRole : UserRoleAssignment, role : String, roleobjectstatus : String) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(theUserRole.LoadCommandID, theUserRole.CreateUser, theUserRole.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>
  <%if (theUserRole.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=theUserRole.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (theUserRole.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=theUserRole.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (theUserRole.Claim.LossType != null) {%>
  <TransactionLossType><%=theUserRole.Claim.LossType%></TransactionLossType>
  <%}%>
  <Party>
    <PublicID><%=theUserRole.AssignedUser.Contact.PublicID%></PublicID>
    <ObjectStatus>E</ObjectStatus>
    <% if (theUserRole.AssignedUser.Contact.CreateTime  != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theUserRole.AssignedUser.Contact.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theUserRole.AssignedUser.Contact.UpdateTime  != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theUserRole.AssignedUser.Contact.UpdateTime)%></UpdateTime> 
    <%}%>
    <TransactionRelToClaim><%=theUserRole.Claim.PublicID%></TransactionRelToClaim>
    <% if (theUserRole.RptActiveDateExt != null) {%>		
    <EffectiveDate><%=theUserRole.RptActiveDateExt%></EffectiveDate> 
    <%}%>	
    <% if (theUserRole.RptInactiveDateExt != null) {%>	
    <ExpirationDate><%=theUserRole.RptInactiveDateExt%></ExpirationDate> 
    <%} else {%>
       <% if (roleobjectstatus != null and roleobjectstatus.equalsIgnoreCase( "D" ) ) {%>		
          <ExpirationDate><%=theUserRole.UpdateTime%></ExpirationDate> 
       <%}%>
    <%}%>

    <%=role%>
    
    <Parties>
      <%var apartyRelTo = "<PartyRelTo><PublicID>"+theUserRole.AssignedUser.Contact.PublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>"%>
      <% if (theUserRole.AssignedUser.CreateUser != null) { %>
      <%=UserTemplate.renderToString(theUserRole.AssignedUser.CreateUser, "", "E", displaykey.EDW.Templates.CreateUserRole, "", apartyRelTo)%>
      <%}%>
      <% if (theUserRole.AssignedUser.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(theUserRole.AssignedUser.UpdateUser, "", "E", displaykey.EDW.Templates.UpdateUserRole, "", apartyRelTo)%>
      <%}%>
    </Parties>

      <%var partyrelto = ""%>    
      <% if (theUserRole.Exposure != null) { %>
            <% partyrelto = "<PartyRelTo><PublicID>"+theUserRole.Exposure.PublicID+"</PublicID><RelToType>Feature</RelToType></PartyRelTo>"%>    
      <%} else {%>
            <% partyrelto = "<PartyRelTo><PublicID>"+theUserRole.Claim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>"%>    
      <%} %>
      
    <%=partyrelto%>
    <% var roleobjstatus = ""%>
    <% if (!(roleobjectstatus == null or roleobjectstatus == "") ) {%>		
         <% roleobjstatus = roleobjectstatus %>
    <%}  else {%> 
         <% roleobjstatus = (theUserRole.Active != null and theUserRole.Active) == true ? "A":"D" %>
    <%} %>
    <RoleObjStatus><%=roleobjstatus%></RoleObjStatus>
</Party>
</Transaction>