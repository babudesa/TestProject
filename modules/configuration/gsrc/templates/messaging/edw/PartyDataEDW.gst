<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PersonTemplate %>
<% uses templates.messaging.edw.AddressTemplate %>
<% uses templates.messaging.edw.PartyWithoutGuardianTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses templates.messaging.edw.PartyFeatureTemplate %>
<% uses templates.messaging.edw.commons.ContactBusinessSpecialtyTemplate %>
<% uses templates.messaging.edw.commons.ContactPanelTemplate %>
<% uses templates.messaging.edw.commons.ContactLicenseTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(additionalInfo : String, thecontact : Contact, objStatus : String, theclaim : Claim) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(thecontact.LoadCommandID, thecontact.CreateUser, thecontact.UpdateUser)) {%>
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
    <%-- Fix for Defect 1474: For vendors the public id ClaimCenter should send to EDW is the address book Vendor public id not the ClaimCenter public id --%>
    <% if (( thecontact typeis CompanyVendor || thecontact typeis PersonVendor || thecontact typeis NonVendorPayeeCompanyExt || thecontact typeis NonVendorPayeePersonExt) && thecontact.AddressBookUID != null) { %>
    <PublicID><%=additionalInfo%><%=thecontact.AddressBookUID%></PublicID>
    <%} else {%>
    <PublicID><%=additionalInfo%><%=thecontact.PublicID%></PublicID>
    <%}%>
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
    <%-- Otteson 01282016 - WC defect 8261 --%>
    <% if (thecontact typeis Person and !theclaim.IncidentReport) {
         if (thecontact == theclaim.InjuredWorker) { %>
            <%=PartyFeatureTemplate.renderToString(thecontact, theclaim)%>
        <% } %>
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
	  
	  <% if (thecontact.ABPartyIndExt != null) {%>
        <ABPartyIndExt><%=thecontact.ABPartyIndExt%></ABPartyIndExt>      
      <%}%>
      
    </Vendor>
    <%}%>

    <% if (thecontact.Subtype != null) {%>
    <%=TypeListTemplate.renderToString(thecontact.Subtype, "BusinessCategory", thecontact.Subtype.ListName)%>
    <%}%>
    
    <% var persondata = ""; %>
    <% var personfeatdata = false;%>
    <% if (thecontact typeis Person) {
         var persontest = "";
         if (thecontact == theclaim.InjuredWorker) {
           persontest = "injwrkr";
         } %>
         <%persondata = PersonTemplate.renderToString(thecontact, theclaim, null, persontest, objStatus)%>
         <%=persondata%>
    <%}%>
    <% if (persondata != "" and (persondata.contains("<TPOCPayments") or persondata.contains("<INJWFeatures>"))) {
       personfeatdata = true;
    }%>

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

    <Parties>
        <%-- Defect 6193: Remove Guardian generation from template --%>
      <%
      var parentPublicID = "";
      var childobjstatus = objStatus;
      var childroleobjstatus = "";
      if (childobjstatus == "D" ) {
      	childobjstatus = "C";
      }
      if ((thecontact typeis CompanyVendor || thecontact typeis PersonVendor|| thecontact typeis NonVendorPayeeCompanyExt || thecontact typeis NonVendorPayeePersonExt) && thecontact.AddressBookUID != null) {
      parentPublicID = additionalInfo + thecontact.AddressBookUID;
      } else {
      parentPublicID = additionalInfo + thecontact.PublicID;
      }
      %>
      <%var partyRelTo = "<PartyRelTo><PublicID>"+parentPublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>"%>

      <% if (thecontact.AllContactContacts != null && thecontact.AllContactContacts.length > 0) {
           for (allc in thecontact.AllContactContacts)  {
             
             if (allc.ChangedFields.contains("RelatedContact") or allc.ChangedFields.contains("Relationship")) {
                var origtarget = allc.OriginalVersion as ContactContact 
                if (origtarget.SourceContact.PublicID == thecontact.PublicID) { %>
                    <%var oBeninfo : String = ""; %>
                    <%if (origtarget.BeneficiaryDepndExt != null) {
                        oBeninfo = "<BeneficiaryDependency><Code>"+origtarget.BeneficiaryDepndExt.Code+"</Code><Description>"+origtarget.BeneficiaryDepndExt.Description+"</Description><ListName>"+origtarget.BeneficiaryDepndExt.ListName+"</ListName></BeneficiaryDependency>";
                      } 
                      if (origtarget.BeneficiaryRelatnExt   != null) {
                        oBeninfo = oBeninfo + "<BeneficiaryRelation><Code>"+origtarget.BeneficiaryRelatnExt.Code+"</Code><Description>"+origtarget.BeneficiaryRelatnExt.Description+"</Description><ListName>"+origtarget.BeneficiaryRelatnExt.ListName+"</ListName></BeneficiaryRelation>";
                      } %>
                    <%var crole = "<Role><Code>"+origtarget.Relationship.Code+"</Code><Description>"+origtarget.Relationship.Description+"</Description><ListName>ContactBidiRel</ListName></Role>"+ oBeninfo;%>
                    <%=PartyWithoutGuardianTemplate.renderToString(origtarget.RelatedContact, "", childobjstatus, crole, "", partyRelTo, "D", theclaim)%>                 
            <%  }            
             }
             
             if (allc.SourceContact.PublicID == thecontact.PublicID) {   %>
                <%var aStatus = childobjstatus;
                if (objStatus == "C" && allc.New) {
                  aStatus = "A"; 
                }%>
                <%var beninfo : String = ""; %>
                <%if (allc.BeneficiaryDepndExt != null) {
                    beninfo = "<BeneficiaryDependency><Code>"+allc.BeneficiaryDepndExt.Code+"</Code><Description>"+allc.BeneficiaryDepndExt.Description+"</Description><ListName>"+allc.BeneficiaryDepndExt.ListName+"</ListName></BeneficiaryDependency>";
                  } 
                  if (allc.BeneficiaryRelatnExt   != null) {
                    beninfo = beninfo + "<BeneficiaryRelation><Code>"+allc.BeneficiaryRelatnExt.Code+"</Code><Description>"+allc.BeneficiaryRelatnExt.Description+"</Description><ListName>"+allc.BeneficiaryRelatnExt.ListName+"</ListName></BeneficiaryRelation>";
                  } %>
                <%var hrole = "<Role><Code>"+allc.Relationship.Code+"</Code><Description>"+allc.Relationship.Description+"</Description><ListName>ContactBidiRel</ListName></Role>" + beninfo%>
                <%=PartyWithoutGuardianTemplate.renderToString(allc.RelatedContact, "", childobjstatus, hrole, "", partyRelTo, aStatus, theclaim)%>             
       <%    }  %>

      <%   }
        } %> 
        
      <% if (gw.api.util.ArrayUtil.count(thecontact.getRemovedArrayElements("TargetRelatedContacts")) > 0) {
            for (deltrc in thecontact.getRemovedArrayElements("TargetRelatedContacts") ) {   %>
              <%  if ((deltrc as ContactContact).SourceContact.PublicID == thecontact.PublicID ) {   %>
                    <%var dBeninfo : String = ""; %>
                    <%if ((deltrc as ContactContact).BeneficiaryDepndExt != null) {
                        dBeninfo = "<BeneficiaryDependency><Code>"+(deltrc as ContactContact).BeneficiaryDepndExt.Code+"</Code><Description>"+(deltrc as ContactContact).BeneficiaryDepndExt.Description+"</Description><ListName>"+(deltrc as ContactContact).BeneficiaryDepndExt.ListName+"</ListName></BeneficiaryDependency>";
                      } 
                      if ((deltrc as ContactContact).BeneficiaryRelatnExt   != null) {
                        dBeninfo = dBeninfo + "<BeneficiaryRelation><Code>"+(deltrc as ContactContact).BeneficiaryRelatnExt.Code+"</Code><Description>"+(deltrc as ContactContact).BeneficiaryRelatnExt.Description+"</Description><ListName>"+(deltrc as ContactContact).BeneficiaryRelatnExt.ListName+"</ListName></BeneficiaryRelation>";
                      } %>             
                     <%var drole = "<Role><Code>"+(deltrc as ContactContact).Relationship.Code+"</Code><Description>"+(deltrc as ContactContact).Relationship.Description+"</Description><ListName>ContactBidiRel</ListName></Role>" + dBeninfo%>
                     <%=PartyWithoutGuardianTemplate.renderToString((deltrc as ContactContact).RelatedContact, "", childobjstatus, drole, "", partyRelTo, "D", theclaim)%>         
              <% }  
             }
        } %>

      <% if (thecontact.CreateUser != null) { %>
      <%=UserTemplate.renderToString(thecontact.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>

      <% if (thecontact.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(thecontact.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
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
    
    <% if (thecontact.Ex_TaxStatusCode != null) {%>
    <%=TypeListTemplate.renderToString(thecontact.Ex_TaxStatusCode, "TaxFillingStatus", thecontact.Ex_TaxStatusCode.ListName)%>
    <%}%>

    <% if (thecontact.TollFreeNumberExt != null and thecontact.isPhoneValidEDW(thecontact.TollFreeNumberExt)) {%>
         <%
         ext = thecontact.TollFreeNumberExt.indexOf( "x") < 0 ? 0 : thecontact.TollFreeNumberExt.indexOf( "x");
         cntr = ext == 0 ? 0 : 1;
         ext = ext == 0 ? thecontact.TollFreeNumberExt.length() : ext;
         %>
         <TollFreeExt><%=thecontact.TollFreeNumberExt.substring( 0, ext - cntr ).replaceAll("-", "")%></TollFreeExt>
         <% if (cntr != 0) {%>    
            <TollFreeExtension><%=thecontact.TollFreeNumberExt.substring( ext + cntr, thecontact.TollFreeNumberExt.length() )%></TollFreeExtension>
         <%}%>
    <%}%>

    <% if (thecontact typeis Person and thecontact == theclaim.InjuredWorker) { %>
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
  <% if (thecontact.OrganizationType != null) {%>
     <%=TypeListTemplate.renderToString(thecontact.OrganizationType, "OrganizationTypeExt", thecontact.OrganizationType.ListName)%>
  <%}%>
  
  <% if (personfeatdata) { 
        if (theclaim.Exposures != null and theclaim.Exposures.length > 0) {
           var pfeaturelist : java.util.Set = new java.util.HashSet();  
           for (featurs in theclaim.Exposures) {
              if (featurs.ClaimantDenorm.PublicID == thecontact.PublicID and featurs.AttorneyRepExt != null) {
                  pfeaturelist.add(featurs.PublicID);
              }
           }
           if (pfeaturelist.HasElements) { %>
             <PartyFeatureData>
             <% for (fPublicID in pfeaturelist) { %>
                <% var exp = find(e in Exposure where e.PublicID == fPublicID as java.lang.String).AtMostOneRow %>
                <PartyFeature>
                  <FeaturePublicID><%=fPublicID%></FeaturePublicID>
                  <% if (exp.New) { %>
                     <FeatureAttribute>new</FeatureAttribute>
                  <% }%>
                  <% if (exp.AttorneyRepExt != null) { %>
                    <AttorneyRepExt><%=exp.AttorneyRepExt%></AttorneyRepExt>
                  <% }%>
                  <PartyFeatureRole><Role><Code>claimant</Code><Description>Claimant</Description><ListName>ContactRole</ListName></Role></PartyFeatureRole>  
                </PartyFeature>
             <% }%>
              </PartyFeatureData>
           <%}%>
        <%}%>
  <%}%>
  
  </Party>
</Transaction>