<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(additionalInfo : String, theofficial : Official, objStatus : String, theClaimPublicID : String) %>
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
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (theofficial.CreateTime  != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theofficial.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theofficial.UpdateTime  != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theofficial.UpdateTime)%></UpdateTime> 
    <%}%>
    <TransactionRelToClaim><%=theofficial.Claim.PublicID%></TransactionRelToClaim>

    <% if (theofficial.Name != null) {%>
    <Name><%=StringUtils.getXMLValue(theofficial.Name, false)%></Name>
    <%}%>

    <Organization>
      <PublicID><%=additionalInfo%><%=theofficial.PublicID%></PublicID>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <% if (theofficial.Name != null) {%>
      <Name><%=StringUtils.getXMLValue(theofficial.Name, false)%></Name>
      <%}%>
    </Organization>

    <%var partyRelTo = "<PartyRelTo><PublicID>"+additionalInfo+theofficial.PublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>"%>
    <Parties>
      <% if (theofficial.CreateUser != null) { %>
      <%=UserTemplate.renderToString(theofficial.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>	

      <% if (theofficial.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(theofficial.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
      <%}%>	
    </Parties>
    
    <% if (theofficial.ReportNumber != null) {%>
    <ReportNumber><%=theofficial.ReportNumber%></ReportNumber>
    <%}%>
  </Party>
</Transaction>
