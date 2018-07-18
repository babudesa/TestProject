<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PartyTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(thenote : Note, objStatus : String, eventName : String) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(thenote.LoadCommandID, thenote.CreateUser, thenote.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>		 
  <%if (thenote.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=thenote.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (thenote.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=thenote.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (thenote.Claim.LossType != null) {%>
  <TransactionLossType><%=thenote.Claim.LossType%></TransactionLossType>
  <%}%>

  <Note>
    <PublicID><%=thenote.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (thenote.AuthoringDate != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thenote.AuthoringDate)%></CreateTime> 
    <%} else if(thenote.CreateTime != null) { %>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thenote.CreateTime)%></CreateTime> 
    <%}%>
    <% if (thenote.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thenote.UpdateTime)%></UpdateTime> 
    <%}%>
    <% if (thenote.Claim != null && thenote.Claim.PublicID != null) {%>
    <RelToClaim><%=thenote.Claim.PublicID%></RelToClaim> 
    <%}%>
    <% if (thenote.Exposure != null && thenote.Exposure.PublicID != null) {%>
    <RelToFeature><%=thenote.Exposure.PublicID%></RelToFeature> 
    <%}%>
    <%-- def 1975.  No longer need.  Will send as a party down below
    <% if (thenote.ClaimContact != null && thenote.ClaimContact.PublicID != null) {%>
    <RelToParty><%=thenote.ClaimContact.PublicID%></RelToParty>  --%>
    <%-- Commented as EDW changes have not yet been deployed
    <RelPartyRole>
      <Code>relatedparty</Code>
      <Description>Related Party</Description>
      <ListName>Related Party</ListName>
    </RelPartyRole>
    --%>
    <%--    <%}%>    --%>
    <%=TypeListTemplate.renderToString(thenote.Topic, "Topic", thenote.Topic.ListName)%>
    
    <% if (thenote.Subject != null) {%>
    <Subject><%=StringUtils.getXMLValue(thenote.Subject, false)%></Subject>
    <%}%>
    
    <% if (thenote.Body != null) {%>
    <Body><%=StringUtils.getXMLValue(thenote.Body, false)%></Body>
    <%}%>
    
    <% if (thenote.AllowExternalViewing != null) {%>
    <AllowExternalViewing><%=thenote.AllowExternalViewing%></AllowExternalViewing>
    <%}%>
    
    <%var partyRelTo = "<PartyRelTo><PublicID>"+thenote.PublicID+"</PublicID><RelToType>Note</RelToType></PartyRelTo>"%>
    <Parties>
      <% if (thenote.CreateUser != null) { %>
      <%=UserTemplate.renderToString(thenote.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>

      <% if (thenote.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(thenote.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
      <%}%>

      <% if (thenote.RelatedTo typeis Contact)  { var therelatedto = thenote.RelatedTo;%>
      <%var rtrole = "<Role><Code>relatedparty</Code><Description>RelatedParty</Description><ListName>Related Party</ListName></Role>"%>
      <%=PartyTemplate.renderToString(therelatedto, "", objStatus, rtrole, "", partyRelTo, thenote.Claim, "", "")%>
      <%}%>
    </Parties>
  </Note>
</Transaction>