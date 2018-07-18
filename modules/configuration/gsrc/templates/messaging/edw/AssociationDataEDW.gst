<% uses util.UniqueNumberGenerators %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses util.StringUtils %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(theassociation : ClaimAssociation, objStatus : String, eventName : String) %>
<Transaction>
  <CCTransactionTime><%=util.custom_Ext.DateTime.getTimeStamp()%></CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  
  <% if (ConversionStatusChecker.isCurrentlyConverting(theassociation.LoadCommandID, theassociation.CreateUser, theassociation.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <%} else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <%}%>		  

  <Association>
    <PublicID><%=theassociation.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>

    <% if (theassociation.ClaimAssocType != null) {%>
    <%=TypeListTemplate.renderToString(theassociation.ClaimAssocType, "ClaimAssocType", theassociation.ClaimAssocType.ListName)%>
    <%}%>
    
    <%var partyRelTo = "<PartyRelTo><PublicID>"+theassociation.PublicID+"</PublicID><RelToType>theassociation</RelToType></PartyRelTo>"%>
    <Parties>
      <% if (theassociation.CreateUser != null) { %>
	      <%=UserTemplate.renderToString(theassociation.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>
      <% if (theassociation.UpdateUser != null) { %>
	      <%=UserTemplate.renderToString(theassociation.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
      <%}%>
    </Parties>

    <% if (theassociation.Title != null) {%>
    <Title><%=StringUtils.getXMLValue(theassociation.Title, false)%></Title>
    <%}%>
    
    <% if (theassociation.Description != null) {%>
    <Description><%=StringUtils.getXMLValue(theassociation.Description, false)%></Description>
    <%}%>
    
    <% if (theassociation.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theassociation.CreateTime)%></CreateTime> 
    <%}%>
    
    <% if (theassociation.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theassociation.UpdateTime)%></UpdateTime> 
    <%}%>
    
    <% if (theassociation.ClaimsInAssoc != null) {%>
    <%for (var theclaim in theassociation.ClaimsInAssoc) {  %>
    <ClaimInAssoc>
      <PublicID><%=theclaim.Claim.PublicID%></PublicID> 					
      <PrimaryClaim><%=theclaim.PrimaryClaim%></PrimaryClaim>
    </ClaimInAssoc>
    <%}%>
    <%}%>
  </Association>
</Transaction>