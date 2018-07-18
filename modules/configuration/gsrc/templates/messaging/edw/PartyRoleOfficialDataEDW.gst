<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(additionalInfo : String, theofficial : Official, role : String, partyrelto : String, objStatus : String, theClaimPublicID : String) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(theofficial.LoadCommandID, theofficial.CreateUser, theofficial.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>
  <%if (theofficial.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=theofficial.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (theofficial.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=theofficial.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (theofficial.Claim.LossType != null) {%>
  <TransactionLossType><%=theofficial.Claim.LossType%></TransactionLossType>
  <%}%>
  <Party>
    <PublicID><%=additionalInfo%><%=theofficial.PublicID%></PublicID>
    <ObjectStatus>E</ObjectStatus>
    <% if (theofficial.CreateTime  != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theofficial.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theofficial.UpdateTime  != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theofficial.UpdateTime)%></UpdateTime> 
    <%}%>
    <TransactionRelToClaim><%=theClaimPublicID%></TransactionRelToClaim>
    <% if (objStatus != null && (objStatus.equalsIgnoreCase( "A" ))) {%>		
    <EffectiveDate><%=theofficial.UpdateTime%></EffectiveDate> 
    <%}%>	
    <% if (objStatus != null && (objStatus.equalsIgnoreCase( "D" ))) {%>	
    <ExpirationDate><%=theofficial.UpdateTime%></ExpirationDate> 
    <%}%>

    <%=role%>
    
    <% if (theofficial.Name != null) {%>
    <Name><%=StringUtils.getXMLValue(theofficial.Name, false)%></Name>
    <%}%>
    <Organization>
      <PublicID><%=additionalInfo%><%=theofficial.PublicID%></PublicID>
      <ObjectStatus>E</ObjectStatus>
      <% if (theofficial.Name != null) {%>
      <Name><%=StringUtils.getXMLValue(theofficial.Name, false)%></Name>
      <%}%>
    </Organization>	
    <Parties>
      <%var apartyRelTo = "<PartyRelTo><PublicID>"+additionalInfo+theofficial.PublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>"%>
      <% if (theofficial.CreateUser != null) { %>
      <%=UserTemplate.renderToString(theofficial.CreateUser, "", "E", displaykey.EDW.Templates.CreateUserRole, "", apartyRelTo)%>
      <%}%>
      <% if (theofficial.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(theofficial.UpdateUser, "", "E", displaykey.EDW.Templates.UpdateUserRole, "", apartyRelTo)%>
      <%}%>
    </Parties>
    
    <%=partyrelto%>
    
    <RoleObjStatus><%=objStatus%></RoleObjStatus>
    <% if (theofficial.ReportNumber != null) {%>
    <ReportNumber><%=theofficial.ReportNumber%></ReportNumber>
    <%}%>
</Party>
</Transaction>
