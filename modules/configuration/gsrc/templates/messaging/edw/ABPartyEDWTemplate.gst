<% uses util.UniqueNumberGenerators %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.commons.ContactBusinessSpecialtyTemplate %>
<% uses templates.messaging.edw.ABPersonTemplate %>
<% uses templates.messaging.edw.ABAddressTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses templates.messaging.edw.commons.ContactPanelTemplate %>
<% uses templates.messaging.edw.commons.ContactLicenseTemplate %>
<%@ params(thecontact : Contact, additionalInfo : String, objStatus : String, role : String, assignmentStatus : String, partyRelTo : String) %>

<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
    <Party>
      <% if ((thecontact typeis CompanyVendor || thecontact typeis PersonVendor || thecontact typeis NonVendorPayeeCompanyExt || thecontact typeis NonVendorPayeePersonExt) && thecontact.AddressBookUID != null) {%>
      <PublicID><%=additionalInfo%><%=thecontact.AddressBookUID%></PublicID>
      <%} else {%>
      <PublicID><%=additionalInfo%><%=thecontact.PublicID%></PublicID>
      <%} %>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <% if (thecontact.CreateTime  != null) {%>
      <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thecontact.CreateTime)%></CreateTime> 
      <%}%>
      <% if (thecontact.UpdateTime  != null) {%>
      <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thecontact.UpdateTime)%></UpdateTime> 
      <%}%>
      <% if (objStatus != null && (objStatus.equalsIgnoreCase( "A" ))) {%>		
      <EffectiveDate><%=thecontact.UpdateTime%></EffectiveDate> 
      <%}%>	
      <% if (objStatus != null && (objStatus.equalsIgnoreCase( "D" ))) {%>	
      <ExpirationDate><%=thecontact.UpdateTime%></ExpirationDate> 
      <%}%>
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
    
    <% if(thecontact typeis CompanyVendor || thecontact typeis PersonVendor) {%>
    <Vendor>
    
      <VendorCategory>
        <Code>vendorcontact</Code>
        <Description>none</Description>
        <ListName>VendorType</ListName>
      </VendorCategory>


      <% if (thecontact.VendorNumber != null) {%>
      <VendorNumber><%=thecontact.VendorNumber%></VendorNumber>
      <%}%>
      
      <%=ContactPanelTemplate.renderToString(thecontact)%>
      
      <% if (thecontact.Preferred != null) {%>
      <PreferredInd><%=thecontact.Preferred%></PreferredInd>
      <%}%>
      <% if (thecontact typeis CompanyVendor && thecontact.ex_AppointmentDate != null) {%>
      <AppointmentDate><%=thecontact.ex_AppointmentDate%></AppointmentDate> 
      <%} else if (thecontact typeis PersonVendor && thecontact.ex_AppointmentDate != null) {%>
      <AppointmentDate><%=thecontact.ex_AppointmentDate%></AppointmentDate> 
      <%}%>
      <% if (thecontact.WithholdingRate != null) {%>
      <WithholdingRate><%=thecontact.WithholdingRate%></WithholdingRate>
      <%}%>
      <% if (thecontact.W9ValidFrom != null) {%>
      <W9ValidEffDate><%=thecontact.W9ValidFrom%></W9ValidEffDate> 
      <%}%>
      <% if (thecontact.W9ValidTo != null) {%>
      <W9ValidExpDate><%=thecontact.W9ValidTo%></W9ValidExpDate> 
      <%}%>
      <% if (thecontact.CloseDateExt != null) {%>
      <CloseDateExt><%=thecontact.CloseDateExt%></CloseDateExt> 
      <%}%>
      
      <%=ContactLicenseTemplate.renderToString(thecontact)%>

      <% if (thecontact.W9ReceivedDate != null) {%>
        <W9ReceivedDate><%=thecontact.W9ReceivedDate%></W9ReceivedDate> 
      <%}%>
      <% if (thecontact.W9Received != null) {%>
        <W9Received><%=thecontact.W9Received%></W9Received> 
      <%}%>
      
      <% if (thecontact.W9ForwardedExt != null) {%>
        <W9ForwardComAcc><%=thecontact.W9ForwardedExt%></W9ForwardComAcc>   
      <%}%>   
                     
      <% if (thecontact.W8ReceivedDateExt != null) {%>
        <W8ReceivedDate><%=thecontact.W8ReceivedDateExt%></W8ReceivedDate> 
      <%}%>
      <% if (thecontact.W8ReceivedExt != null) {%>
        <W8Received><%=thecontact.W8ReceivedExt%></W8Received>
      <%}%>
      
      <% if ((thecontact typeis CompanyVendor) && (thecontact as CompanyVendor).PayableExt != null) {%>
        <PayableExt><%=(thecontact as CompanyVendor).PayableExt%></PayableExt> 
      <% } else if((thecontact typeis PersonVendor) && (thecontact as PersonVendor).PayableExt != null) {%>
        <PayableExt><%=(thecontact as PersonVendor).PayableExt%></PayableExt> 
      <%}%>
      
      <% if (thecontact.CMFContactExt != null) {%>
        <CMFContactExt><%=thecontact.CMFContactExt%></CMFContactExt>      
      <%}%>

	  <% if (thecontact.Subtype != null) {%>
			<% if (thecontact typeis AutoRepairShop) {%>
				<% if (thecontact.DMVFacilityNumberExt != null) {%>
					<DMVFacilityNumberExt><%=thecontact.DMVFacilityNumberExt%></DMVFacilityNumberExt>
				<%}%>
				<% if (thecontact.SalesTaxNumberExt != null) {%>
					<SalesTaxNumberExt><%=thecontact.SalesTaxNumberExt%></SalesTaxNumberExt>
				<%}%>
			<%}%>
	  <%}%>
    </Vendor>
    <%}%>

    <% if (thecontact.Subtype != null) {%>
    <%=TypeListTemplate.renderToString(thecontact.Subtype, "BusinessCategory", thecontact.Subtype.ListName)%>
    <%}%>

    <% if (thecontact typeis Person) {%>
    <%=ABPersonTemplate.renderToString(thecontact, objStatus)%>
    <%}%>
    
    <% if (thecontact typeis Company) {%>
    <Organization>
      <% if ((thecontact typeis CompanyVendor || thecontact typeis NonVendorPayeeCompanyExt) && thecontact.AddressBookUID != null) {%>
      <PublicID><%=additionalInfo%><%=thecontact.AddressBookUID%></PublicID>
      <%} else {%>
      <PublicID><%=additionalInfo%><%=thecontact.PublicID%></PublicID>
      <%} %>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <% if (thecontact.Name != null) {%>
      <Name><%=StringUtils.getXMLValue(thecontact.Name, false)%></Name>
      <%}%>
    </Organization>
    <%}%>

    <% if (thecontact.PrimaryAddress != null) { var thecontactaddress = thecontact.PrimaryAddress;%>
    <PrimaryAddress>
      <%=ABAddressTemplate.renderToString(thecontactaddress, true, objStatus, "")%>
    </PrimaryAddress>
    <%}%>

    <% if (thecontact.ContactAddresses != null && thecontact.ContactAddresses.length > 0) {%>
    <OtherAddresses>
      <% for (cAddress in thecontact.ContactAddresses) {%>
      <ContactAddress>
        <%=ABAddressTemplate.renderToString(cAddress.Address, false, objStatus, "")%>
      </ContactAddress>
      <%}%>
    </OtherAddresses>
    <%}%>
    
    <Parties>

      <% if (thecontact.CreateUser != null) { %>
      <%=UserTemplate.renderToString(thecontact.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", "")%>
      <%}%>

      <% if (thecontact.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(thecontact.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", "")%>
      <%}%>
      
      <% if (thecontact.DoingBusinessAsExt != null) {%>
      <Party>
        <% if ((thecontact typeis CompanyVendor || thecontact typeis PersonVendor || thecontact typeis NonVendorPayeeCompanyExt || thecontact typeis NonVendorPayeePersonExt) && thecontact.AddressBookUID != null) {%>
        <PublicID>dba:<%=thecontact.AddressBookUID%></PublicID>
        <%} else {%>
        <PublicID>dba:<%=thecontact.PublicID%></PublicID>
        <%}%>
        <ObjectStatus><%=objStatus%></ObjectStatus>
        <% if (thecontact.CreateTime  != null) {%>
        <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thecontact.CreateTime)%></CreateTime> 
        <%}%>
        <% if (thecontact.UpdateTime  != null) {%>
        <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thecontact.UpdateTime)%></UpdateTime> 
        <%}%>
        <Role><Code>doingbusinessas</Code><Description>Doing business as</Description><ListName>ContactRole</ListName></Role>
        <Name><%=StringUtils.getXMLValue(thecontact.DoingBusinessAsExt, false)%></Name>
        <Organization>
          <%  if ((thecontact typeis CompanyVendor || thecontact typeis PersonVendor || thecontact typeis NonVendorPayeeCompanyExt || thecontact typeis NonVendorPayeePersonExt) && thecontact.AddressBookUID != null) {%>
          <PublicID>dba:<%=thecontact.AddressBookUID%></PublicID>
          <%} else {%>
          <PublicID>dba:<%=thecontact.PublicID%></PublicID>
          <%}%>
          <ObjectStatus><%=objStatus%></ObjectStatus>
          <Name><%=StringUtils.getXMLValue(thecontact.DoingBusinessAsExt, false)%></Name>
        </Organization>
      </Party>
      <%}%>
    </Parties>
    
  </Party>
</Transaction>