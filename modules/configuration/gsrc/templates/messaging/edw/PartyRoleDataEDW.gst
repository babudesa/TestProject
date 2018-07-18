<% uses util.UniqueNumberGenerators %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(additionalInfo : String, thecontactrole : ClaimContactRole, role : String, partyrelto : String, objStatus : String, theClaimPublicID : String) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(thecontactrole.LoadCommandID, thecontactrole.CreateUser, thecontactrole.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>
  <%if (thecontactrole.ClaimContact.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=thecontactrole.ClaimContact.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (thecontactrole.ClaimContact.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=thecontactrole.ClaimContact.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (thecontactrole.ClaimContact.Claim.LossType != null) {%>
  <TransactionLossType><%=thecontactrole.ClaimContact.Claim.LossType%></TransactionLossType>
  <%}%>
  <Party>
    <%-- Fix for Defect 1474: For vendors the public id ClaimCenter should send to EDW is the address book Vendor public id not the ClaimCenter public id --%>
    <% if ((thecontactrole.Contact typeis CompanyVendor || thecontactrole.Contact typeis PersonVendor || thecontactrole.Contact typeis NonVendorPayeeCompanyExt || thecontactrole.Contact typeis NonVendorPayeePersonExt) && thecontactrole.Contact.AddressBookUID != null) { %>
    <PublicID><%=additionalInfo%><%=thecontactrole.Contact.AddressBookUID%></PublicID>
    <%} else { %>
    <PublicID><%=additionalInfo%><%=thecontactrole.Contact.PublicID%></PublicID>
    <%} %>
    <ObjectStatus>E</ObjectStatus>
    <% if (thecontactrole.Contact.CreateTime  != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thecontactrole.Contact.CreateTime)%></CreateTime> 
    <%}%>
    <% if (thecontactrole.Contact.UpdateTime  != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thecontactrole.Contact.UpdateTime)%></UpdateTime> 
    <%}%>
    <TransactionRelToClaim><%=thecontactrole.ClaimContact.Claim.PublicID%></TransactionRelToClaim>
    <% if (objStatus != null && (objStatus.equalsIgnoreCase( "A" ))) {%>		
    <EffectiveDate><%=thecontactrole.UpdateTime%></EffectiveDate> 
    <%}%>	
    <% if (objStatus != null && (objStatus.equalsIgnoreCase( "D" ))) {%>	
    <ExpirationDate><%=thecontactrole.UpdateTime%></ExpirationDate> 
    <%}%>

    <%=role%>

    <Parties>
      <%
      var parentPublicID = "";
      if ((thecontactrole.Contact typeis CompanyVendor || thecontactrole.Contact typeis PersonVendor || thecontactrole.Contact typeis NonVendorPayeeCompanyExt || thecontactrole.Contact typeis NonVendorPayeePersonExt ) && thecontactrole.Contact.AddressBookUID != null) {
        parentPublicID = additionalInfo + thecontactrole.Contact.AddressBookUID;
      } else {
        parentPublicID = additionalInfo + thecontactrole.Contact.PublicID;
      }
      var ppartyRelTo = "<PartyRelTo><PublicID>"+parentPublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>";
      %>

      <% if (thecontactrole.CreateUser != null) { %>
      <%=UserTemplate.renderToString(thecontactrole.CreateUser, "", "E", displaykey.EDW.Templates.CreateUserRole, "", ppartyRelTo)%>
      <%}%>

      <% if (thecontactrole.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(thecontactrole.UpdateUser, "", "E", displaykey.EDW.Templates.UpdateUserRole, "", ppartyRelTo)%>
      <%}%>
    </Parties>
    <%=partyrelto%>
    <RoleObjStatus><%=objStatus%></RoleObjStatus>
  </Party>
</Transaction>