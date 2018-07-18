<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(additionalInfo : String, role : String, partyrelto : String,  objStatus : String, theClaim : Claim, theName : String) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(theClaim.LoadCommandID, theClaim.CreateUser, theClaim.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>
  <%if (theClaim.ClaimNumber != null) {%>
  <ClaimNumber><%=theClaim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (theClaim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=theClaim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (theClaim.LossType != null) {%>
  <TransactionLossType><%=theClaim.LossType%></TransactionLossType>
  <%}%>
  
  <Party>
    <PublicID><%=additionalInfo%><%=theClaim.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (theClaim.CreateTime  != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theClaim.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theClaim.UpdateTime  != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theClaim.UpdateTime)%></UpdateTime> 
    <%}%>
    <TransactionRelToClaim><%=theClaim.PublicID%></TransactionRelToClaim>
    <% if (objStatus != null && (objStatus.equalsIgnoreCase( "A" ))) {%>		
    <EffectiveDate><%=theClaim.UpdateTime%></EffectiveDate> 
    <%}%>	
    <% if (objStatus != null && (objStatus.equalsIgnoreCase( "D" ))) {%>	
    <ExpirationDate><%=theClaim.UpdateTime%></ExpirationDate> 
    <%}%>

    <%=role%>
    <% if (theName != null) {%>
    <Name><%=StringUtils.getXMLValue(theName, false)%></Name>
    <%}%>

    <Parties>
      <%
    	var oStatus = objStatus;
    	if (objStatus == "D") {
     		oStatus = "C";
    	}
      %>

      <% if (theClaim.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(theClaim.UpdateUser, "", oStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyrelto)%>
      <%}%>	
    </Parties>
       
    <%=partyrelto%>
    <RoleObjStatus><%=objStatus%></RoleObjStatus>
    
  </Party>
</Transaction>