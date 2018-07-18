<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(negotiation : Negotiation, objStatus : String) %>
<Transaction>
  <CCTransactionTime><%=util.custom_Ext.DateTime.getTimeStamp()%></CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>

  <% if (ConversionStatusChecker.isCurrentlyConverting(negotiation.LoadCommandID, negotiation.CreateUser, negotiation.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <%} else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <%}%>		   

  <%if (negotiation.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=negotiation.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  
  <%if (negotiation.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=negotiation.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  
  <%if (negotiation.Claim.LossType != null) {%>
  <TransactionLossType><%=negotiation.Claim.LossType%></TransactionLossType>
  <%}%>

  <Negotiation>
    <PublicID><%=negotiation.PublicID%></PublicID>		
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(negotiation.CreateTime)%></CreateTime>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(negotiation.UpdateTime)%></UpdateTime>
    
    <%var partyRelTo = "<PartyRelTo><PublicID>"+negotiation.PublicID+"</PublicID><RelToType>Negotiation</RelToType></PartyRelTo>"%>
    <Parties>
      <% if ((negotiation.CreateUser != null) ) { %>
      <%=UserTemplate.renderToString(negotiation.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>

      <% if ((negotiation.UpdateUser != null) ) { %>
      <%=UserTemplate.renderToString(negotiation.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
      <%}%>
    </Parties>

    <% if (negotiation.Claim != null && negotiation.Claim.PublicID != null) {%>
    <RelToClaim><%=negotiation.Claim.PublicID%></RelToClaim>
    <%}%>

    <% if (negotiation.Exposure != null && negotiation.Exposure.PublicID != null) {%>
    <RelToFeature><%=negotiation.Exposure.PublicID%></RelToFeature>
    <%}%>

    <% if (negotiation.ex_InitialDemand != null) {%>
    <ex_InitialDemand><%=StringUtils.getXMLValue(negotiation.ex_InitialDemand as java.lang.String,false)%></ex_InitialDemand> 
    <%}%>


    <% if (negotiation.TargetOffer != null) {%>
    <TargetOffer><%=StringUtils.getXMLValue(negotiation.TargetOffer.Amount as java.lang.String,false)%></TargetOffer>  
    <%}%>

    <% if (negotiation.Name != null) {%>
    <Name><%=StringUtils.getXMLValue(negotiation.Name,false)%></Name> 
    <%}%>

    <% if (negotiation.ex_InitialOffer != null) {%> 
    <ex_InitialOffer><%=StringUtils.getXMLValue(negotiation.ex_InitialOffer as java.lang.String,false)%></ex_InitialOffer> 
    <%}%>
    
    <% if (negotiation.MaxOffer  != null) {%>
    <MaxOffer><%=StringUtils.getXMLValue(negotiation.MaxOffer.Amount as java.lang.String,false)%></MaxOffer> 
    <%}%>

    <% if ( gw.api.util.ArrayUtil.count(negotiation.SettleNegotiation) > 0) {%>
    <NegotiationLines>
      <% for ( negotiationLine in negotiation.SettleNegotiation) {%>
      <NegotiationLine>
        <PublicID><%=negotiationLine.PublicID%></PublicID>		
        <ObjectStatus><%=objStatus%></ObjectStatus>
        <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(negotiationLine.CreateTime)%></CreateTime>
        <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(negotiationLine.UpdateTime)%></UpdateTime>
        
        <% if (negotiationLine.Amount != null) {%>
        <Amount><%=StringUtils.getXMLValue(negotiationLine.Amount.Amount as java.lang.String,false)%></Amount> 
        <%}%>

        <% if (negotiationLine.Note != null) {%>
        <Note><%=StringUtils.getXMLValue(negotiationLine.Note,false)%></Note> 
        <%}%>
        
        <% if (negotiationLine.NegotiationDate  != null) {%>
        <NegotiationDate><%=StringUtils.getXMLValue(negotiationLine.NegotiationDate as java.lang.String,false)%></NegotiationDate> 
        <%}%>

        <% if (negotiationLine.Type != null) {%>
        <%=TypeListTemplate.renderToString(negotiationLine.Type, "Type", negotiationLine.Type.ListName)%>
        <%}%>
      </NegotiationLine>
      <%}%>
    </NegotiationLines>
    <%}%>
  </Negotiation>
</Transaction>