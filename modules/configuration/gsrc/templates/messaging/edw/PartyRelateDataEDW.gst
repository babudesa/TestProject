<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PersonTemplate %>
<% uses templates.messaging.edw.AddressTemplate %>
<% uses templates.messaging.edw.PartyRelateTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses templates.messaging.edw.commons.ContactBusinessSpecialtyTemplate %>
<% uses templates.messaging.edw.commons.ContactPanelTemplate %>
<% uses templates.messaging.edw.commons.ContactLicenseTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(additionalInfo : String, theclaim : Claim, role : String, childrole : String, partyrelto : String,
childobjstatus : String, objStatus : String, parentrolestatus : String, roleobjstatus : String, theUpdateTime : DateTime,
theClaimPublicID : String, parentcontact : Contact, childcontact : Contact) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(theclaim.LoadCommandID, theclaim.CreateUser, theclaim.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>
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
    <%-- Fix for Defect 1474: For vendors the public id ClaimCenter should send to EDW is the address book Vendor public id not the ClaimCenter public id --%>
    <% if ((parentcontact typeis CompanyVendor || parentcontact typeis PersonVendor || parentcontact typeis NonVendorPayeeCompanyExt || parentcontact typeis NonVendorPayeePersonExt) && parentcontact.AddressBookUID != null) { %>
    <PublicID><%=additionalInfo%><%=parentcontact.AddressBookUID%></PublicID>
    <%} else { %>
    <PublicID><%=additionalInfo%><%=parentcontact.PublicID%></PublicID>
    <%} %>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (parentcontact.CreateTime  != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(parentcontact.CreateTime)%></CreateTime> 
    <%}%>
    <% if (parentcontact.UpdateTime  != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(parentcontact.UpdateTime)%></UpdateTime> 
    <%}%>
    <TransactionRelToClaim><%=theclaim.PublicID%></TransactionRelToClaim>
    <% if (parentrolestatus != null && !(parentrolestatus.equalsIgnoreCase( "D" ))) {%>		
    <EffectiveDate><%=theUpdateTime%></EffectiveDate> 
    <%}%>	
    <% if (parentrolestatus != null && (parentrolestatus.equalsIgnoreCase( "D" ))) {%>	
    <ExpirationDate><%=theUpdateTime%></ExpirationDate> 
    <%}%>

    <%=role%>
    
    <%-- BESTOR 04032009 - Defect 1669: Use DisplayName for Vendors --%>
    <% if (parentcontact.DisplayName != "") {%>
    <Name><%=StringUtils.getXMLValue(parentcontact.DisplayName, false)%></Name>
    <%}%>

    <% if (parentcontact.TaxID  != null) {%>
    <TaxID><%=parentcontact.TaxID%></TaxID> 
    <%}%>
    <% if (parentcontact.Ex_TaxReportingName != null) {%>
    <ex_TaxReportingName><%=StringUtils.getXMLValue(parentcontact.Ex_TaxReportingName, false)%></ex_TaxReportingName> 
    <%}%>

    <% if (parentcontact.HomePhone != null || parentcontact.WorkPhone != null) {%>
    <Phones>
      <%
      var ext = 0;
      var cntr = 0;
      %>
      <% if (parentcontact.HomePhone != null) {%>
      <Phone>
        <%
        ext = parentcontact.HomePhone.indexOf( "x") < 0 ? 0 : parentcontact.HomePhone.indexOf( "x");
        cntr = ext == 0 ? 0 : 1;
        ext = ext == 0 ? parentcontact.HomePhone.length() : ext;
        %>
        <PhoneNumber><%=parentcontact.HomePhone.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
        <PhoneCat>
          <Code>home</Code>
          <Description>Home</Description>
          <ListName>PrimaryPhoneType</ListName>
        </PhoneCat>
        <% if (parentcontact.PrimaryPhone.Code == "home") {%>
        <PrimPhoneInd>true</PrimPhoneInd>
        <% } else { %>
        <PrimPhoneInd>false</PrimPhoneInd>
        <%}%>
        <% if (cntr != 0) {%> 
        <ExtensionNumber><%=parentcontact.HomePhone.substring( ext + cntr, parentcontact.HomePhone.length() )%></ExtensionNumber>
        <%}%>
      </Phone>
      <%}%>
      <% if (parentcontact.WorkPhone != null) {%>
      <Phone>
        <%
        ext = parentcontact.WorkPhone.indexOf( "x") < 0 ? 0 : parentcontact.WorkPhone.indexOf( "x");
        cntr = ext == 0 ? 0 : 1;
        ext = ext == 0 ? parentcontact.WorkPhone.length() : ext;
        %>
        <PhoneNumber><%=parentcontact.WorkPhone.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
        <PhoneCat>
          <Code>work</Code>
          <Description>Work</Description>
          <ListName>PrimaryPhoneType</ListName>
        </PhoneCat>
        <% if (parentcontact.PrimaryPhone.Code == "work") {%>
        <PrimPhoneInd>true</PrimPhoneInd>
        <% } else { %>
        <PrimPhoneInd>false</PrimPhoneInd>
        <%}%>
        <% if (cntr != 0) {%>    
        <ExtensionNumber><%=parentcontact.WorkPhone.substring( ext + cntr, parentcontact.WorkPhone.length() )%></ExtensionNumber>
        <%}%>
      </Phone>
      <%}%>
      <% if (parentcontact typeis Person && parentcontact.CellPhone != null) {%>
      <Phone>
        <%
        ext = parentcontact.CellPhone.indexOf( "x") < 0 ? 0 : parentcontact.CellPhone.indexOf( "x");
        cntr = ext == 0 ? 0 : 1;
        ext = ext == 0 ? parentcontact.CellPhone.length() : ext;
        %>
        <PhoneNumber><%=parentcontact.CellPhone.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
        <PhoneCat>
        <Code>mobile</Code>
        <Description>Mobile</Description>
        <ListName>PrimaryPhoneType</ListName>
        </PhoneCat>
        <% if (parentcontact.PrimaryPhone.Code == "mobile") {%>
        <PrimPhoneInd>true</PrimPhoneInd>
        <% } else { %>
        <PrimPhoneInd>false</PrimPhoneInd>
        <%}%>   
        <% if (cntr != 0) {%>    
        <ExtensionNumber><%=parentcontact.CellPhone.substring( ext + 1, parentcontact.CellPhone.length() )%></ExtensionNumber>
        <%}%>
      </Phone>
      <%}%>
    </Phones>
    <%}%>

    <%=ContactBusinessSpecialtyTemplate.renderToString(parentcontact)%>

    <% if (parentcontact.FaxPhone != null) {%>
    <%
        var ext = 0;
        var cntr = 0;
	ext = parentcontact.FaxPhone.indexOf( "x") < 0 ? 0 : parentcontact.FaxPhone.indexOf( "x");
	cntr = ext == 0 ? 0 : 1;
	ext = ext == 0 ? parentcontact.FaxPhone.length() : ext;
	%>
	<FaxPhone><%=parentcontact.FaxPhone.substring( 0, ext - cntr ).replaceAll("-", "")%></FaxPhone>
	<% if (cntr != 0) {%>    
		<FaxPhoneExtension><%=parentcontact.FaxPhone.substring( ext + cntr, parentcontact.FaxPhone.length() )%></FaxPhoneExtension>
	<%}%>
    <%}%>
    <% if (parentcontact.EmailAddress1 != null) {%>
    <EmailAddress1><%=StringUtils.getXMLValue(parentcontact.EmailAddress1, false)%></EmailAddress1>
    <%}%>
    <% if (parentcontact.EmailAddress2 != null) {%>
    <EmailAddress2><%=StringUtils.getXMLValue(parentcontact.EmailAddress2, false)%></EmailAddress2>
    <%}%>
    <InternetCatType>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>Internet Category</ListName>
    </InternetCatType>

    <% if(parentcontact typeis CompanyVendor || parentcontact typeis PersonVendor) { %>
    <Vendor>
      <% if (parentcontact.VendorType != null) {%>
      <%=TypeListTemplate.renderToString(parentcontact.VendorType, "VendorCategory", parentcontact.VendorType.ListName)%>
      <%}%>

      <% if (parentcontact.VendorNumber != null) {%>
      <VendorNumber><%=parentcontact.VendorNumber%></VendorNumber>
      <%}%>
      
      <%=ContactPanelTemplate.renderToString(parentcontact)%>
      
      <% if (parentcontact.Preferred != null) {%>
      <PreferredInd><%=parentcontact.Preferred%></PreferredInd>
      <%}%>
      <% if (parentcontact typeis CompanyVendor && parentcontact.ex_AppointmentDate != null) {%>
      <AppointmentDate><%=parentcontact.ex_AppointmentDate%></AppointmentDate> 
      <%} else if (parentcontact typeis PersonVendor && parentcontact.ex_AppointmentDate != null) {%>
      <AppointmentDate><%=parentcontact.ex_AppointmentDate%></AppointmentDate> 
      <%}%>
      <% if (parentcontact.WithholdingRate != null) {%>
      <WithholdingRate><%=parentcontact.WithholdingRate%></WithholdingRate>
      <%}%>
      <% if (parentcontact.W9ValidFrom != null) {%>
      <W9ValidEffDate><%=parentcontact.W9ValidFrom%></W9ValidEffDate> 
      <%}%>
      <% if (parentcontact.W9ValidTo != null) {%>
      <W9ValidExpDate><%=parentcontact.W9ValidTo%></W9ValidExpDate> 
      <%}%>
      <% if (parentcontact.CloseDateExt != null) {%>
      <CloseDateExt><%=parentcontact.CloseDateExt%></CloseDateExt> 
      <%}%>
      
      <%=ContactLicenseTemplate.renderToString(parentcontact)%>
      
     <% if (parentcontact.W9ReceivedDate != null) {%>
        <W9ReceivedDate><%=parentcontact.W9ReceivedDate%></W9ReceivedDate> 
      <%}%>
      <% if (parentcontact.W9Received != null) {%>
        <W9Received><%=parentcontact.W9Received%></W9Received> 
      <%}%>
      <% if (parentcontact.W9ForwardedExt != null) {%>
        <W9ForwardComAcc><%=parentcontact.W9ForwardedExt%></W9ForwardComAcc>   
      <%}%>   
      <% if (parentcontact.W8ReceivedDateExt != null) {%>
        <W8ReceivedDate><%=parentcontact.W8ReceivedDateExt%></W8ReceivedDate> 
      <%}%>
      <% if (parentcontact.W8ReceivedExt != null) {%>
        <W8Received><%=parentcontact.W8ReceivedExt%></W8Received>
      <%}%>
      <% if ((parentcontact typeis CompanyVendor) && (parentcontact as CompanyVendor).PayableExt != null) {%>
        <PayableExt><%=(parentcontact as CompanyVendor).PayableExt%></PayableExt> 
      <% } else if((parentcontact typeis PersonVendor) && (parentcontact as PersonVendor).PayableExt != null) {%>
        <PayableExt><%=(parentcontact as PersonVendor).PayableExt%></PayableExt> 
      <%}%>
      <% if (parentcontact.CMFContactExt != null) {%>
        <CMFContactExt><%=parentcontact.CMFContactExt%></CMFContactExt>      
      <%}%> 
	  
      <% if (parentcontact.Subtype != null) {%>
			<% if (parentcontact typeis AutoRepairShop) {%>
				<% if (parentcontact.DMVFacilityNumberExt != null) {%>
					<DMVFacilityNumberExt><%=parentcontact.DMVFacilityNumberExt%></DMVFacilityNumberExt>
				<%}%>
				<% if (parentcontact.SalesTaxNumberExt != null) {%>
					<SalesTaxNumberExt><%=parentcontact.SalesTaxNumberExt%></SalesTaxNumberExt>
				<%}%>
			<%}%>
	  <%}%>
    </Vendor>
    <%}%>

    <% if (parentcontact.Subtype != null) {%>
    <%=TypeListTemplate.renderToString(parentcontact.Subtype, "BusinessCategory", parentcontact.Subtype.ListName)%>
    <%}%>

    <% if (parentcontact typeis Person) {%>
    <%=PersonTemplate.renderToString(parentcontact, theclaim, null, "", objStatus)%>
    <%}%>

    <% if (parentcontact typeis Company) {%>
    <Organization>
      <PublicID><%=parentcontact.PublicID%></PublicID>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <% if (parentcontact.Name != null) {%>
      <Name><%=StringUtils.getXMLValue(parentcontact.Name, false)%></Name>
      <%}%>
    </Organization>
    <%}%>

    <% if (parentcontact.PrimaryAddress != null) { var parentcontactaddress = parentcontact.PrimaryAddress;%>
    <PrimaryAddress>
      <%=AddressTemplate.renderToString(parentcontactaddress, true, objStatus, "")%>
    </PrimaryAddress>
    <%}%>

    <% if (parentcontact.ContactAddresses != null && parentcontact.ContactAddresses.length > 0) {%>
    <OtherAddresses>
      <% for (cAddress in parentcontact.ContactAddresses) {%>
      <ContactAddress>
        <%=AddressTemplate.renderToString(cAddress.Address, false, objStatus, "")%>
      </ContactAddress>
      <%}%>
    </OtherAddresses>
    <%}%>

    <Parties>
      <% var parentPublicID = "";
      if ((parentcontact typeis CompanyVendor || parentcontact typeis PersonVendor || parentcontact typeis NonVendorPayeeCompanyExt || parentcontact typeis NonVendorPayeePersonExt) && parentcontact.AddressBookUID != null) {
      parentPublicID = additionalInfo + parentcontact.AddressBookUID;
      } else {
      parentPublicID = additionalInfo + parentcontact.PublicID;
      }
      var ppartyRelTo = "<PartyRelTo><PublicID>"+parentPublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>";
      %>

      <% if (parentcontact.CreateUser != null) { %>
      <%=UserTemplate.renderToString(parentcontact.CreateUser, "", "E", displaykey.EDW.Templates.CreateUserRole, "", ppartyRelTo)%>
      <%}%>

      <% if (parentcontact.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(parentcontact.UpdateUser, "", "E", displaykey.EDW.Templates.UpdateUserRole, "", ppartyRelTo)%>
      <%}%>

      <% if (childcontact != null) { %>
      <%=PartyRelateTemplate.renderToString("", childcontact, childrole, "", childobjstatus, roleobjstatus, theUpdateTime)%>
      <%}%>
    </Parties>
    
    <%=partyrelto%>
    
    <RoleObjStatus><%=parentrolestatus%></RoleObjStatus>
    <% if (parentcontact.Ex_TaxStatusCode != null) {%>
    <%=TypeListTemplate.renderToString(parentcontact.Ex_TaxStatusCode, "TaxFillingStatus", parentcontact.Ex_TaxStatusCode.ListName)%>
    <%}%>
    <% if (parentcontact.TollFreeNumberExt != null  and parentcontact.isPhoneValidEDW(parentcontact.TollFreeNumberExt)) {%>
         <%
         var ext = 0;
         var cntr = 0;
         ext = parentcontact.TollFreeNumberExt.indexOf( "x") < 0 ? 0 : parentcontact.TollFreeNumberExt.indexOf( "x");
         cntr = ext == 0 ? 0 : 1;
         ext = ext == 0 ? parentcontact.TollFreeNumberExt.length() : ext;
         %>
         <TollFreeExt><%=parentcontact.TollFreeNumberExt.substring( 0, ext - cntr ).replaceAll("-", "")%></TollFreeExt>
         <% if (cntr != 0) {%>    
            <TollFreeExtension><%=parentcontact.TollFreeNumberExt.substring( ext + cntr, parentcontact.TollFreeNumberExt.length() )%></TollFreeExtension>
         <%}%>
    <%}%>
    <% if (parentcontact.OrganizationType != null) {%>
     <%=TypeListTemplate.renderToString(parentcontact.OrganizationType, "OrganizationTypeExt", parentcontact.OrganizationType.ListName)%>
   <%}%>
  </Party>
</Transaction>