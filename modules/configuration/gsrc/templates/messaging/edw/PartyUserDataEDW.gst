<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PersonTemplate %>
<% uses templates.messaging.edw.AddressTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses templates.messaging.edw.commons.ContactBusinessSpecialtyTemplate %>
<% uses templates.messaging.edw.commons.ContactPanelTemplate %>
<% uses templates.messaging.edw.commons.ContactLicenseTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(theUser : User, objStatus : String, theclaim : Claim) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <%var thecontact = theUser.Contact%>
  <% if (ConversionStatusChecker.isCurrentlyConverting(theUser.LoadCommandID, theUser.CreateUser, theUser.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% }%>
  <%if (theclaim.ClaimNumber != null) {%>
  <ClaimNumber><%=theclaim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (theclaim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=theclaim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (theclaim.LossType != null) {%>
  <TransactionLossType><%=theclaim.LossType%></TransactionLossType>
  <%}%>

  <Party>
    <PublicID><%=thecontact.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (thecontact.CreateTime  != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thecontact.CreateTime)%></CreateTime> 
    <%}%>
    <% if (thecontact.UpdateTime  != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thecontact.UpdateTime)%></UpdateTime> 
    <%}%>
    <TransactionRelToClaim><%=theclaim.PublicID%></TransactionRelToClaim>
    <% if (objStatus != null && (objStatus.equalsIgnoreCase( "A" ))) {%>		
    <EffectiveDate><%=thecontact.UpdateTime%></EffectiveDate> 
    <%}%>	
    <% if (objStatus != null && (objStatus.equalsIgnoreCase( "D" ))) {%>	
    <ExpirationDate><%=thecontact.UpdateTime%></ExpirationDate> 
    <%}%>

    <%-- BESTOR 04032009 - Defect 1669: Use DisplayName for Vendors --%>
    <% if (thecontact.DisplayName != null) {%>
    <Name><%=StringUtils.getXMLValue(thecontact.DisplayName, false)%></Name>
    <%}%>

    <% if (thecontact.TaxID  != null) {%>
    <TaxID><%=thecontact.TaxID%></TaxID> 
    <%}%>
    
    <% if (thecontact.Ex_TaxReportingName != null) {%>
    <ex_TaxReportingName><%=StringUtils.getXMLValue(thecontact.Ex_TaxReportingName, false)%></ex_TaxReportingName> 
    <%}%>

      <%
      var ext = 0;
      var cntr = 0;
      %>
    <% if (thecontact.HomePhone != null || thecontact.WorkPhone != null) {%>
    <Phones>
      <% if (thecontact.HomePhone != null) {%>
      <Phone>
        <%
        ext = thecontact.HomePhone.indexOf( "x") < 0 ? 0 : thecontact.HomePhone.indexOf( "x");
        cntr = ext == 0 ? 0 : 1;
        ext = ext == 0 ? thecontact.HomePhone.length() : ext;
        %>
        <PhoneNumber><%=thecontact.HomePhone.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
        <%=TypeListTemplate.renderToString(PrimaryPhoneType.TC_HOME, "PhoneCat", PrimaryPhoneType.TC_HOME.ListName)%>
        <% if (thecontact.PrimaryPhone.Code == "home") {%>
        <PrimPhoneInd>true</PrimPhoneInd>
        <% } else {%>
        <PrimPhoneInd>false</PrimPhoneInd>
        <%}%>
        <% if (cntr != 0) {%> 
        <ExtensionNumber><%=thecontact.HomePhone.substring( ext + cntr, thecontact.HomePhone.length() )%></ExtensionNumber>
        <%}%>
      </Phone>
      <%}%>
      
      <% if (thecontact.WorkPhone != null) {%>
      <Phone>
        <%
        ext = thecontact.WorkPhone.indexOf( "x") < 0 ? 0 : thecontact.WorkPhone.indexOf( "x");
        cntr = ext == 0 ? 0 : 1;
        ext = ext == 0 ? thecontact.WorkPhone.length() : ext;
        %>
        <PhoneNumber><%=thecontact.WorkPhone.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
        <%=TypeListTemplate.renderToString(PrimaryPhoneType.TC_WORK, "PhoneCat", PrimaryPhoneType.TC_WORK.ListName)%>
        <% if (thecontact.PrimaryPhone.Code == "work") {%>
        <PrimPhoneInd>true</PrimPhoneInd>
        <% } else {%>
        <PrimPhoneInd>false</PrimPhoneInd>
        <%}%>
        <% if (cntr != 0) {%>    
        <ExtensionNumber><%=thecontact.WorkPhone.substring( ext + cntr, thecontact.WorkPhone.length() )%></ExtensionNumber>
        <%}%>
      </Phone>
      <%}%>
      
      <% if (thecontact typeis Person && thecontact.CellPhone != null) {%>
      <Phone>
        <%
        ext = thecontact.CellPhone.indexOf( "x") < 0 ? 0 : thecontact.CellPhone.indexOf( "x");
        cntr = ext == 0 ? 0 : 1;
        ext = ext == 0 ? thecontact.CellPhone.length() : ext;
        %>
        <PhoneNumber><%=thecontact.CellPhone.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
        <%=TypeListTemplate.renderToString(PrimaryPhoneType.TC_MOBILE, "PhoneCat", PrimaryPhoneType.TC_MOBILE.ListName)%>
        <% if (thecontact.PrimaryPhone.Code == "mobile") {%>
        <PrimPhoneInd>true</PrimPhoneInd>
        <% } else {%>
        <PrimPhoneInd>false</PrimPhoneInd>
        <%}%>   
        <% if (cntr != 0) {%>    
        <ExtensionNumber><%=thecontact.CellPhone.substring( ext + 1, thecontact.CellPhone.length() )%></ExtensionNumber>
        <%}%>
      </Phone>
      <%}%>
    </Phones>
    <%}%>

    <%=ContactBusinessSpecialtyTemplate.renderToString(thecontact)%>

    <% if (thecontact.FaxPhone != null) {%>
    <%
     
			ext = thecontact.FaxPhone.indexOf( "x") < 0 ? 0 : thecontact.FaxPhone.indexOf( "x");
			cntr = ext == 0 ? 0 : 1;
			ext = ext == 0 ? thecontact.FaxPhone.length() : ext;
			%>
			<FaxPhone><%=thecontact.FaxPhone.substring( 0, ext - cntr ).replaceAll("-", "")%></FaxPhone>
			<% if (cntr != 0) {%>    
				<FaxPhoneExtension><%=thecontact.FaxPhone.substring( ext + cntr, thecontact.FaxPhone.length() )%></FaxPhoneExtension>
			<%}%>
	<%}%>
    <% if (thecontact.EmailAddress1 != null) {%>
    <EmailAddress1><%=StringUtils.getXMLValue(thecontact.EmailAddress1, false)%></EmailAddress1>
    <%}%>
    <% if (thecontact.EmailAddress2 != null) {%>
    <EmailAddress2><%=StringUtils.getXMLValue(thecontact.EmailAddress2, false)%></EmailAddress2>
    <%}%>
    <InternetCatType>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>Internet Category</ListName>
    </InternetCatType>

    <% if (thecontact.Subtype != null) {%>
    <%=TypeListTemplate.renderToString(thecontact.Subtype, "BusinessCategory", thecontact.Subtype.ListName)%>
    <%}%>

    <% if (thecontact typeis Person) {%>
    <%=PersonTemplate.renderToString(thecontact, null, null, "", objStatus)%>
    <%}%>

    <% if (thecontact.PrimaryAddress != null) { var thecontactaddress = thecontact.PrimaryAddress;%>
    <PrimaryAddress>
      <%=AddressTemplate.renderToString(thecontactaddress, true, objStatus, "")%>
    </PrimaryAddress>
    <%}%>

    <% if (thecontact.ContactAddresses != null && thecontact.ContactAddresses.length > 0) {%>
    <OtherAddresses>
      <% for (cAddress in thecontact.ContactAddresses) {%>
      <ContactAddress>
        <%=AddressTemplate.renderToString(cAddress.Address, false, objStatus, "")%>
      </ContactAddress>
      <%}%>
    </OtherAddresses>
    <%}%>

    <Parties>

      <% if (theUser.CreateUser != null) { %>
      <%=UserTemplate.renderToString(theUser.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", "")%>
      <%}%>

      <% if (theUser.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(theUser.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", "")%>
      <%}%>
    </Parties>
    
    <% if (thecontact.Ex_TaxStatusCode != null) {%>
       <%=TypeListTemplate.renderToString(thecontact.Ex_TaxStatusCode, "TaxFillingStatus", thecontact.Ex_TaxStatusCode.ListName)%>
    <%}%>
    <% if (theUser.Credential.UserName != null) {%>	        
      <UserName><%=theUser.Credential.UserName%></UserName>
    <%}%>
    <% if (theUser.ignoreACLDenormIndExt != null) {%>	        
      <IgnoreACLDenormIndExt><%=theUser.ignoreACLDenormIndExt%></IgnoreACLDenormIndExt>
    <%}%>
    <% if (theUser.ExternalUser != null) {%>	        
      <ExternalUser><%=theUser.ExternalUser%></ExternalUser>
  <%}%>
  </Party>
</Transaction>