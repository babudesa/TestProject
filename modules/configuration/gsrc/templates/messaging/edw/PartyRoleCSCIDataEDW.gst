<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(additionalInfo : String, theClmContact : ClaimContact, role : String, partyrelto : String, objStatus : String, theClaimPublicID : String) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(theClmContact.LoadCommandID, theClmContact.CreateUser, theClmContact.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>
  <%if (theClmContact.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=theClmContact.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (theClmContact.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=theClmContact.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (theClmContact.Claim.LossType != null) {%>
  <TransactionLossType><%=theClmContact.Claim.LossType%></TransactionLossType>
  <%}%>
  <%
    var parentPublicID = "";
    if ((theClmContact.Contact typeis CompanyVendor || theClmContact.Contact typeis PersonVendor || theClmContact.Contact typeis NonVendorPayeeCompanyExt || theClmContact.Contact typeis NonVendorPayeePersonExt) && theClmContact.Contact.AddressBookUID != null) {
       parentPublicID = theClmContact.Contact.AddressBookUID;
    } else {
       parentPublicID = theClmContact.Contact.PublicID;
    }
  %>
  <Party>
    <PublicID><%=additionalInfo%><%=parentPublicID%></PublicID>
    <ObjectStatus>E</ObjectStatus>
    <% if (theClmContact.CreateTime  != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theClmContact.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theClmContact.UpdateTime  != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theClmContact.UpdateTime)%></UpdateTime> 
    <%}%>
    <TransactionRelToClaim><%=theClmContact.Claim.PublicID%></TransactionRelToClaim>
    <% if (objStatus != null && (objStatus.equalsIgnoreCase( "A" ))) {%>		
    <EffectiveDate><%=theClmContact.UpdateTime%></EffectiveDate> 
    <%}%>	
    <% if (objStatus != null && (objStatus.equalsIgnoreCase( "D" ))) {%>	
    <ExpirationDate><%=theClmContact.UpdateTime%></ExpirationDate> 
    <%}%>

    <%=role%>
    
    <Parties>
      <%

      var ppartyRelTo = "<PartyRelTo><PublicID>"+parentPublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>";
      %>

      <% if (theClmContact.CreateUser != null) { %>
         <%=UserTemplate.renderToString(theClmContact.CreateUser, "", "E", displaykey.EDW.Templates.CreateUserRole, "", ppartyRelTo)%>
      <%}%>

      <% if (theClmContact.UpdateUser != null) { %>
         <%=UserTemplate.renderToString(theClmContact.UpdateUser, "", "E", displaykey.EDW.Templates.UpdateUserRole, "", ppartyRelTo)%>
      <%}%>
    </Parties>
    <%=partyrelto%>
    
    <RoleObjStatus><%=objStatus%></RoleObjStatus>

</Party>
</Transaction>