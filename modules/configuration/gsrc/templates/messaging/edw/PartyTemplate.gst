<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PersonTemplate %>
<% uses templates.messaging.edw.AddressTemplate %>
<% uses templates.messaging.edw.PartyWithinPartyTemplate %>
<% uses templates.messaging.edw.commons.ContactPanelTemplate %>
<% uses templates.messaging.edw.commons.ContactLicenseTemplate %>
<% uses templates.messaging.edw.commons.ContactBusinessSpecialtyTemplate %>
<%@ params(theContact : Contact, additionalInfo : String, objStatus : String, role : String, assignmentStatus : String, partyRelTo : String, theclaim : Claim, contacttype : String, featuredata : String) %>
<Party>
  <%-- Fix for Defect 1474: For vendors the public id ClaimCenter should send to EDW is the address book Vendor public id not the ClaimCenter public id --%>
  <% if ((theContact typeis CompanyVendor || theContact typeis PersonVendor || theContact typeis NonVendorPayeeCompanyExt || theContact typeis NonVendorPayeePersonExt) && theContact.AddressBookUID != null) {%>
  <PublicID><%=additionalInfo%><%=theContact.AddressBookUID%></PublicID>
  <%} else {%>
  <PublicID><%=additionalInfo%><%=theContact.PublicID%></PublicID>
  <%} %>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <% if (theContact.CreateTime  != null) {%>
  <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theContact.CreateTime)%></CreateTime> 
  <%}%>
  <% if (theContact.UpdateTime  != null) {%>
  <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theContact.UpdateTime)%></UpdateTime> 
  <%}%>

  <%=role%>
  <%=assignmentStatus%>

  <%-- BESTOR 04032009 - Defect 1669: Use DisplayName for Vendors --%>
  <Name><%=StringUtils.getXMLValue(theContact.DisplayName, false)%></Name>

  <% if (theContact.TaxID  != null) {%>
  <TaxID><%=theContact.TaxID%></TaxID> 
  <%}%>
  <% if (theContact.Ex_TaxReportingName != null) {%>
  <ex_TaxReportingName><%=StringUtils.getXMLValue(theContact.Ex_TaxReportingName, false)%></ex_TaxReportingName> 
  <%}%>

  <% if (theContact.HomePhone != null || theContact.WorkPhone != null) {%>
  <Phones>
    <%
    var ext = 0;
    var cntr = 0;
    %>
    <% if (theContact.HomePhone != null) {%>
    <Phone>
      <%
      ext = theContact.HomePhone.indexOf( "x") < 0 ? 0 : theContact.HomePhone.indexOf( "x");
      cntr = ext == 0 ? 0 : 1;
      ext = ext == 0 ? theContact.HomePhone.length() : ext;
      %>
      <PhoneNumber><%=theContact.HomePhone.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
      <%=TypeListTemplate.renderToString(PrimaryPhoneType.TC_HOME, "PhoneCat", PrimaryPhoneType.TC_HOME.ListName)%>
      <% if (theContact.PrimaryPhone == PrimaryPhoneType.TC_HOME) {%>
      <PrimPhoneInd>true</PrimPhoneInd>
      <% } else { %>
      <PrimPhoneInd>false</PrimPhoneInd>
      <%}%>
      <% if (cntr != 0) {%> 
      <ExtensionNumber><%=theContact.HomePhone.substring( ext + cntr, theContact.HomePhone.length() )%></ExtensionNumber>
      <%}%>
    </Phone>
    <%}%>
    <% if (theContact.WorkPhone != null) {%>
    <Phone>
      <%
      ext = theContact.WorkPhone.indexOf( "x") < 0 ? 0 : theContact.WorkPhone.indexOf( "x");
      cntr = ext == 0 ? 0 : 1;
      ext = ext == 0 ? theContact.WorkPhone.length() : ext;
      %>
      <PhoneNumber><%=theContact.WorkPhone.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
      <%=TypeListTemplate.renderToString(PrimaryPhoneType.TC_WORK, "PhoneCat", PrimaryPhoneType.TC_WORK.ListName)%>
      <% if (theContact.PrimaryPhone == PrimaryPhoneType.TC_WORK) {%>
      <PrimPhoneInd>true</PrimPhoneInd>
      <% } else { %>
      <PrimPhoneInd>false</PrimPhoneInd>
      <%}%> 
      <% if (cntr != 0) {%>   
      <ExtensionNumber><%=theContact.WorkPhone.substring( ext + cntr, theContact.WorkPhone.length() )%></ExtensionNumber>
      <%}%> 
    </Phone>
    <%}%>
    <% if (theContact typeis Person && theContact.CellPhone != null) {%>
    <Phone>
      <%
      ext = theContact.CellPhone.indexOf( "x") < 0 ? 0 : theContact.CellPhone.indexOf( "x");
      cntr = ext == 0 ? 0 : 1;
      ext = ext == 0 ? theContact.CellPhone.length() : ext;
      %>
      <PhoneNumber><%=theContact.CellPhone.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
      <%=TypeListTemplate.renderToString(PrimaryPhoneType.TC_MOBILE, "PhoneCat", PrimaryPhoneType.TC_MOBILE.ListName)%>
      <% if (theContact.PrimaryPhone == PrimaryPhoneType.TC_MOBILE) {%>
      <PrimPhoneInd>true</PrimPhoneInd>
      <% } else { %>
      <PrimPhoneInd>false</PrimPhoneInd>
      <%}%>  
      <% if (cntr != 0) {%>    
      <ExtensionNumber><%=theContact.CellPhone.substring( ext + cntr, theContact.CellPhone.length() )%></ExtensionNumber>
      <%}%> 
    </Phone>
    <%}%>
  </Phones>
  <%}%>

  <%=ContactBusinessSpecialtyTemplate.renderToString(theContact)%>
  
  <% if (theContact.FaxPhone != null) {%>
  <%
        var ext = 0;
        var cntr = 0;
	ext = theContact.FaxPhone.indexOf( "x") < 0 ? 0 : theContact.FaxPhone.indexOf( "x");
	cntr = ext == 0 ? 0 : 1;
	ext = ext == 0 ? theContact.FaxPhone.length() : ext;
	%>
	<FaxPhone><%=theContact.FaxPhone.substring( 0, ext - cntr ).replaceAll("-", "")%></FaxPhone>
	<% if (cntr != 0) {%>    
		<FaxPhoneExtension><%=theContact.FaxPhone.substring( ext + cntr, theContact.FaxPhone.length() )%></FaxPhoneExtension>
	<%}%>
  <%}%>
  <% if (theContact.EmailAddress1 != null) {%>
  <EmailAddress1><%=StringUtils.getXMLValue(theContact.EmailAddress1, false)%></EmailAddress1>
  <%}%>
  <% if (theContact.EmailAddress2 != null) {%>
  <EmailAddress2><%=StringUtils.getXMLValue(theContact.EmailAddress2, false)%></EmailAddress2>
  <%}%>
  <InternetCatType>
    <Code>0</Code>
    <Description>none</Description>
    <ListName>Internet Category</ListName>
  </InternetCatType>

  <% if(theContact typeis CompanyVendor || theContact typeis PersonVendor) { %>
  <Vendor>
    <% if (theContact.VendorType != null) {%>
    <%=TypeListTemplate.renderToString(theContact.VendorType, "VendorCategory", theContact.VendorType.ListName)%>
    <%}%>

    <% if (theContact.VendorNumber != null) {%>
    <VendorNumber><%=theContact.VendorNumber%></VendorNumber>
    <%}%>
    
    <%var contactPanelData = ContactPanelTemplate.renderToString(theContact)%>
    <% if (org.apache.commons.lang.StringUtils.deleteSpaces( contactPanelData ) != "") {%>
    <%=contactPanelData%>
    <%}%>
    
    <% if (theContact.Preferred != null) {%>
    <PreferredInd><%=theContact.Preferred%></PreferredInd>
    <%}%>
    <% if (theContact typeis CompanyVendor) {%>
    <% if (theContact.ex_AppointmentDate != null) {%>
    <AppointmentDate><%=theContact.ex_AppointmentDate%></AppointmentDate> 
    <%}%>
    <%} else if (theContact typeis PersonVendor) {%>
    <% if (theContact.ex_AppointmentDate != null) {%>
    <AppointmentDate><%=theContact.ex_AppointmentDate%></AppointmentDate> 
    <%}%>
    <%}%>
    <% if (theContact.WithholdingRate != null) {%>
    <WithholdingRate><%=theContact.WithholdingRate%></WithholdingRate>
    <%}%>
    <% if (theContact.W9ValidFrom != null) {%>
    <W9ValidEffDate><%=theContact.W9ValidFrom%></W9ValidEffDate> 
    <%}%>
    <% if (theContact.W9ValidTo != null) {%>
    <W9ValidExpDate><%=theContact.W9ValidTo%></W9ValidExpDate> 
    <%}%>
    <% if (theContact.CloseDateExt != null) {%>
    <CloseDateExt><%=theContact.CloseDateExt%></CloseDateExt> 
    <%}%>
    
    <%=ContactLicenseTemplate.renderToString(theContact)%>

    <% if (theContact.W9ReceivedDate != null) {%>
    <W9ReceivedDate><%=theContact.W9ReceivedDate%></W9ReceivedDate> 
    <%}%>
    <% if (theContact.W9Received != null) {%>
      <W9Received><%=theContact.W9Received%></W9Received> 
    <%}%>
    <% if (theContact.W9ForwardedExt != null) {%>
      <W9ForwardComAcc><%=theContact.W9ForwardedExt%></W9ForwardComAcc>   
    <%}%>             
    <% if (theContact.W8ReceivedDateExt != null) {%>
      <W8ReceivedDate><%=theContact.W8ReceivedDateExt%></W8ReceivedDate> 
    <%}%>
    <% if (theContact.W8ReceivedExt != null) {%>
      <W8Received><%=theContact.W8ReceivedExt%></W8Received>
    <%}%>
    <% if ((theContact typeis CompanyVendor) && (theContact as CompanyVendor).PayableExt != null) {%>
      <PayableExt><%=(theContact as CompanyVendor).PayableExt%></PayableExt> 
    <% } else if((theContact typeis PersonVendor) && (theContact as PersonVendor).PayableExt != null) {%>
      <PayableExt><%=(theContact as PersonVendor).PayableExt%></PayableExt> 
    <%}%>
    <% if (theContact.CMFContactExt != null) {%>
      <CMFContactExt><%=theContact.CMFContactExt%></CMFContactExt>      
    <%}%>    

	<% if (theContact.Subtype != null) {%>
		<% if (theContact typeis AutoRepairShop) {%>
			<% if (theContact.DMVFacilityNumberExt != null) {%>
				<DMVFacilityNumberExt><%=theContact.DMVFacilityNumberExt%></DMVFacilityNumberExt>
			<%}%>
			<% if (theContact.SalesTaxNumberExt != null) {%>
				<SalesTaxNumberExt><%=theContact.SalesTaxNumberExt%></SalesTaxNumberExt>
			<%}%>
		<%}%>
	<%}%>
      <% if (theContact.ABPartyIndExt != null) {%>
        <ABPartyIndExt><%=theContact.ABPartyIndExt%></ABPartyIndExt>      
      <%}%>
  </Vendor>
  <% } %>

  <% if (theContact.Subtype != null) {%>
  <%=TypeListTemplate.renderToString(theContact.Subtype, "BusinessCategory", theContact.Subtype.ListName)%>
  <%}%>
  
  <% var persondata = "";%>
  <% var personfeatdata = false;%>
  <% if (theContact typeis Person) {%>
     <% persondata = PersonTemplate.renderToString(theContact, theclaim, null, contacttype, objStatus)%>
     <%=persondata%>
  <%}%>
  <% if (persondata != "" and (persondata.contains("<TPOCPayments") or persondata.contains("<INJWFeatures>"))) {
       personfeatdata = true;
  }%>

  <% if (theContact typeis Company) {%>
  <Organization>
  <PublicID><%=theContact.PublicID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <% if (theContact.Name != null) {%>
  <Name><%=StringUtils.getXMLValue(theContact.Name, false)%></Name>
  <%}%>
  </Organization>
  <%}%>

  <% if (theContact.PrimaryAddress != null) {%>
  <PrimaryAddress>
    <%=AddressTemplate.renderToString(theContact.PrimaryAddress, true, objStatus, "")%>
  </PrimaryAddress>
  <%}%>

  <% if (theContact.ContactAddresses != null && theContact.ContactAddresses.length > 0) {%>
  <OtherAddresses>
    <% for (cAddress in theContact.ContactAddresses) {%>
    <ContactAddress>
      <%=AddressTemplate.renderToString(cAddress.Address, false, objStatus, "")%>
    </ContactAddress>
    <%}%>
  </OtherAddresses>
  <%}%>
  <% if (contacttype != "siusubj") { %>
  	 <%=PartyWithinPartyTemplate.renderToString(theContact, objStatus, additionalInfo)%>
  <%}%>
  <% if (theContact.Ex_TaxStatusCode != null) {%>
  <%=TypeListTemplate.renderToString(theContact.Ex_TaxStatusCode, "TaxFillingStatus", theContact.Ex_TaxStatusCode.ListName)%>
  <%}%>
  <% if (theContact.TollFreeNumberExt != null and theContact.isPhoneValidEDW(theContact.TollFreeNumberExt)) {%>
       <%
       var ext = 0;
       var cntr = 0;
       ext = theContact.TollFreeNumberExt.indexOf( "x") < 0 ? 0 : theContact.TollFreeNumberExt.indexOf( "x");
       cntr = ext == 0 ? 0 : 1;
       ext = ext == 0 ? theContact.TollFreeNumberExt.length() : ext;
       %>
       <TollFreeExt><%=theContact.TollFreeNumberExt.substring( 0, ext - cntr ).replaceAll("-", "")%></TollFreeExt>
       <% if (cntr != 0) {%>    
          <TollFreeExtension><%=theContact.TollFreeNumberExt.substring( ext + cntr, theContact.TollFreeNumberExt.length() )%></TollFreeExtension>
       <%}%>
  <%}%>
  <% if (theContact typeis InjuredWorkerExt and contacttype == "injwrkr") { %>
       <% if (theclaim.Incidents != null and theclaim.Incidents.length > 0) {%>
          <% for (cincident in theclaim.Incidents) {%>
              <% if (cincident typeis InjuryIncident and cincident.ClaimIncident) {%>
                  <% if (cincident.GeneralInjuryType != null) {%>
                      <%=TypeListTemplate.renderToString(cincident.GeneralInjuryType, "GeneralInjuryType", cincident.GeneralInjuryType.ListName)%>
                  <%}%>
                  <% if (cincident.DetailedInjuryType != null) {%>
                      <%=TypeListTemplate.renderToString(cincident.DetailedInjuryType, "DetailedInjuryType", cincident.DetailedInjuryType.ListName)%>
                  <%}%>                      
                  <% if (cincident.BodyParts != null and cincident.BodyParts.length > 0) {%>
                      <InjBodyParts>
                         <% for (bodypart in cincident.BodyParts) {%>
                           <InjBodyPart>             
                              <% if (bodypart.PrimaryBodyPart != null) {%>
                              <%=TypeListTemplate.renderToString(bodypart.PrimaryBodyPart, "InjPrimaryBodyPart", bodypart.PrimaryBodyPart.ListName)%>
                              <%}%>  
                              <% if (bodypart.PrimaryExt != null) {%>
                                  <InjPrimaryExt><%=bodypart.PrimaryExt%></InjPrimaryExt>
                              <%}%>                      
                              <% if (bodypart.DetailedBodyPart != null) {%>
                              <%=TypeListTemplate.renderToString(bodypart.DetailedBodyPart, "InjDetailedBodyPart", bodypart.DetailedBodyPart.ListName)%>
                              <%}%>               
                              <% if (bodypart.PriorInjuryExt != null) {%>
                                  <InjPriorInjuryExt><%=bodypart.PriorInjuryExt%></InjPriorInjuryExt>
                              <%}%>
                              <% if (bodypart.PriorInjuryDateExt != null) {%>
                                  <InjPriorInjuryDateExt><%=bodypart.PriorInjuryDateExt%></InjPriorInjuryDateExt>
                              <%}%>                      
                           </InjBodyPart>
                         <%}%> 
                      </InjBodyParts>
                  <%}%> 
              <%}%>
          <%}%>  
       <%}%> 
  <% } %> 
  <% if (theContact.OrganizationType != null) {%>
     <%=TypeListTemplate.renderToString(theContact.OrganizationType, "OrganizationTypeExt", theContact.OrganizationType.ListName)%>
  <%}%>
  <% if (featuredata != null) {%>
     <%=featuredata%>
  <%}%>
</Party>