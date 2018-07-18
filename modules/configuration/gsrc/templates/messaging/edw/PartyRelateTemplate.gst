<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PersonTemplate %>
<% uses templates.messaging.edw.AddressTemplate %>
<% uses templates.messaging.edw.commons.ContactBusinessSpecialtyTemplate %>
<% uses templates.messaging.edw.commons.ContactPanelTemplate %>
<% uses templates.messaging.edw.commons.ContactLicenseTemplate %>
<%@ params(additionalInfo : String, thecontact : Contact, role : String, assignmentStatus : String, objStatus : String, roleobjstatus : String, theUpdateTime : DateTime) %>
<Party>
  <%-- Fix for Defect 1474: For vendors the public id ClaimCenter should send to EDW is the address book Vendor public id not the ClaimCenter public id --%>
  <% if ((thecontact typeis CompanyVendor || thecontact typeis PersonVendor || thecontact typeis NonVendorPayeeCompanyExt || thecontact typeis NonVendorPayeePersonExt) && thecontact.AddressBookUID != null) {%>
  <PublicID><%=additionalInfo%><%=thecontact.AddressBookUID%></PublicID>
  <%} else { %>
  <PublicID><%=additionalInfo%><%=thecontact.PublicID%></PublicID>
  <%}%>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <% if (thecontact.CreateTime  != null) {%>
  <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thecontact.CreateTime)%></CreateTime> 
  <%}%>
  <% if (thecontact.UpdateTime  != null) {%>
  <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thecontact.UpdateTime)%></UpdateTime> 
  <%}%>
  <% if (roleobjstatus != null && !(roleobjstatus.equalsIgnoreCase( "D" ))) {%>		
  <EffectiveDate><%=theUpdateTime%></EffectiveDate> 
  <%}%>	
  <% if (roleobjstatus != null && (roleobjstatus.equalsIgnoreCase( "D" ))) {%>	
  <ExpirationDate><%=theUpdateTime%></ExpirationDate> 
  <%}%>
  
  <%=role%>
  
  <%=assignmentStatus%>

  <%-- BESTOR 04032009 - Defect 1669: Use DisplayName for Vendors --%>
  <% if (thecontact.DisplayName != "") {%>
  <Name><%=StringUtils.getXMLValue(thecontact.DisplayName, false)%></Name>
  <%}%>

  <% if (thecontact.TaxID  != null) {%>
  <TaxID><%=thecontact.TaxID%></TaxID> 
  <%}%>
  <% if (thecontact.Ex_TaxReportingName != null) {%>
  <ex_TaxReportingName><%=StringUtils.getXMLValue(thecontact.Ex_TaxReportingName, false)%></ex_TaxReportingName> 
  <%}%>

  <% if (thecontact.HomePhone != null || thecontact.WorkPhone != null) {%>
  <Phones>
    <%
    var ext = 0;
    var cntr = 0;
    %>
    <% if (thecontact.HomePhone != null) {%>
    <Phone>
      <%
      ext = thecontact.HomePhone.indexOf( "x") < 0 ? 0 : thecontact.HomePhone.indexOf( "x");
      cntr = ext == 0 ? 0 : 1;
      ext = ext == 0 ? thecontact.HomePhone.length() : ext;
      %>
      <PhoneNumber><%=thecontact.HomePhone.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
      <PhoneCat>
        <Code>home</Code>
        <Description>Home</Description>
        <ListName>PrimaryPhoneType</ListName>
      </PhoneCat>
      <% if (thecontact.PrimaryPhone.Code == "home") {%>
      <PrimPhoneInd>true</PrimPhoneInd>
      <% } else { %>
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
      <PhoneCat>
        <Code>work</Code>
        <Description>Work</Description>
        <ListName>PrimaryPhoneType</ListName>
      </PhoneCat>
      <% if (thecontact.PrimaryPhone.Code == "work") {%>
      <PrimPhoneInd>true</PrimPhoneInd>
      <% } else { %>
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
      <PhoneCat>
        <Code>mobile</Code>
        <Description>Mobile</Description>
        <ListName>PrimaryPhoneType</ListName>
      </PhoneCat>
      <% if (thecontact.PrimaryPhone.Code == "mobile") {%>
      <PrimPhoneInd>true</PrimPhoneInd>
      <% } else { %>
      <PrimPhoneInd>false</PrimPhoneInd>
      <%}%>  
      <% if (cntr != 0) {%>    
      <ExtensionNumber><%=thecontact.CellPhone.substring( ext + cntr, thecontact.CellPhone.length() )%></ExtensionNumber>
      <%}%> 
    </Phone>
    <%}%>
  </Phones>
  <%}%>

  <%=ContactBusinessSpecialtyTemplate.renderToString(thecontact)%>
  
  <% if (thecontact.FaxPhone != null) {%>
  <%
        var ext = 0;
        var cntr = 0;
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
    <% if (thecontact.VendorType != null) {%>
    <%=TypeListTemplate.renderToString(thecontact.VendorType, "VendorCategory", thecontact.VendorType.ListName)%>
    <%}%>

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
  <%=PersonTemplate.renderToString(thecontact, null, null, "", objStatus)%>
  <%}%>

  <% if (thecontact typeis Company) {%>
  <Organization>
    <PublicID><%=thecontact.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (thecontact.Name != null) {%>
    <Name><%=StringUtils.getXMLValue(thecontact.Name, false)%></Name>
    <%}%>
  </Organization>
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
  <RoleObjStatus><%=roleobjstatus%></RoleObjStatus>
  <% if (thecontact.Ex_TaxStatusCode != null) {%>
  <%=TypeListTemplate.renderToString(thecontact.Ex_TaxStatusCode, "TaxFillingStatus", thecontact.Ex_TaxStatusCode.ListName)%>
  <%}%>
  <% if (thecontact.TollFreeNumberExt != null and thecontact.isPhoneValidEDW(thecontact.TollFreeNumberExt)) {%>
       <%
       var ext = 0;
       var cntr = 0;
       ext = thecontact.TollFreeNumberExt.indexOf( "x") < 0 ? 0 : thecontact.TollFreeNumberExt.indexOf( "x");
       cntr = ext == 0 ? 0 : 1;
       ext = ext == 0 ? thecontact.TollFreeNumberExt.length() : ext;
       %>
       <TollFreeExt><%=thecontact.TollFreeNumberExt.substring( 0, ext - cntr ).replaceAll("-", "")%></TollFreeExt>
       <% if (cntr != 0) {%>    
          <TollFreeExtension><%=thecontact.TollFreeNumberExt.substring( ext + cntr, thecontact.TollFreeNumberExt.length() )%></TollFreeExtension>
       <%}%>
  <%}%>
  <% if (thecontact.OrganizationType != null) {%>
     <%=TypeListTemplate.renderToString(thecontact.OrganizationType, "OrganizationTypeExt", thecontact.OrganizationType.ListName)%>
  <%}%>
</Party>