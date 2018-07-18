<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(additionalInfo : String, theClmContact : ClaimContact, objStatus : String) %>
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
       parentPublicID = additionalInfo + theClmContact.Contact.AddressBookUID;
    } else {
       parentPublicID = additionalInfo + theClmContact.Contact.PublicID;
    } 
  %>
  <Party>
    <PublicID><%=parentPublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (theClmContact.CreateTime  != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theClmContact.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theClmContact.UpdateTime  != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theClmContact.UpdateTime)%></UpdateTime> 
    <%}%>
    <TransactionRelToClaim><%=theClmContact.Claim.PublicID%></TransactionRelToClaim>

    <% if (theClmContact.claimSpecificContactExt != null) {%>
    <Name><%=StringUtils.getXMLValue(theClmContact.claimSpecificContactExt, false)%></Name>
    <%} else if (theClmContact.Contact.DisplayName != null) {%>
    <Name><%=StringUtils.getXMLValue(theClmContact.Contact.DisplayName, false)%></Name>
    <%}%>

      <%
      var ext = 0;
      var cntr = 0;
      %>
    <% if (theClmContact.cscHomePhoneExt != null || theClmContact.cscWorkPhoneExt != null || theClmContact.cscCellPhoneExt != null) {%>
    <Phones>
      <% if (theClmContact.cscHomePhoneExt != null) {%>
      <Phone>
        <%
        ext = theClmContact.cscHomePhoneExt.indexOf( "x") < 0 ? 0 : theClmContact.cscHomePhoneExt.indexOf( "x");
        cntr = ext == 0 ? 0 : 1;
        ext = ext == 0 ? theClmContact.cscHomePhoneExt.length() : ext;
        %>
        <PhoneNumber><%=theClmContact.cscHomePhoneExt.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
        <%=TypeListTemplate.renderToString(PrimaryPhoneType.TC_HOME, "PhoneCat", PrimaryPhoneType.TC_HOME.ListName)%>
        <% if (theClmContact.cscPrimaryPhoneExt.Code == "home") {%>
        <PrimPhoneInd>true</PrimPhoneInd>
        <% } else {%>
        <PrimPhoneInd>false</PrimPhoneInd>
        <%}%>
        <% if (cntr != 0) {%> 
        <ExtensionNumber><%=theClmContact.cscHomePhoneExt.substring( ext + cntr, theClmContact.cscHomePhoneExt.length() )%></ExtensionNumber>
        <%}%>
      </Phone>
      <%}%>
      
      <% if (theClmContact.cscWorkPhoneExt != null) {%>
      <Phone>
        <%
        ext = theClmContact.cscWorkPhoneExt.indexOf( "x") < 0 ? 0 : theClmContact.cscWorkPhoneExt.indexOf( "x");
        cntr = ext == 0 ? 0 : 1;
        ext = ext == 0 ? theClmContact.cscWorkPhoneExt.length() : ext;
        %>
        <PhoneNumber><%=theClmContact.cscWorkPhoneExt.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
        <%=TypeListTemplate.renderToString(PrimaryPhoneType.TC_WORK, "PhoneCat", PrimaryPhoneType.TC_WORK.ListName)%>
        <% if (theClmContact.cscPrimaryPhoneExt.Code == "work") {%>
        <PrimPhoneInd>true</PrimPhoneInd>
        <% } else {%>
        <PrimPhoneInd>false</PrimPhoneInd>
        <%}%>
        <% if (cntr != 0) {%>    
        <ExtensionNumber><%=theClmContact.cscWorkPhoneExt.substring( ext + cntr, theClmContact.cscWorkPhoneExt.length() )%></ExtensionNumber>
        <%}%>
      </Phone>
      <%}%>
      
      <% if (theClmContact.cscCellPhoneExt != null) {%>
      <Phone>
        <%
        ext = theClmContact.cscCellPhoneExt.indexOf( "x") < 0 ? 0 : theClmContact.cscCellPhoneExt.indexOf( "x");
        cntr = ext == 0 ? 0 : 1;
        ext = ext == 0 ? theClmContact.cscCellPhoneExt.length() : ext;
        %>
        <PhoneNumber><%=theClmContact.cscCellPhoneExt.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
        <%=TypeListTemplate.renderToString(PrimaryPhoneType.TC_MOBILE, "PhoneCat", PrimaryPhoneType.TC_MOBILE.ListName)%>
        <% if (theClmContact.cscPrimaryPhoneExt.Code == "mobile") {%>
        <PrimPhoneInd>true</PrimPhoneInd>
        <% } else {%>
        <PrimPhoneInd>false</PrimPhoneInd>
        <%}%>   
        <% if (cntr != 0) {%>    
        <ExtensionNumber><%=theClmContact.cscCellPhoneExt.substring( ext + 1, theClmContact.cscCellPhoneExt.length() )%></ExtensionNumber>
        <%}%>
      </Phone>
      <%}%>
    </Phones>
    <%}%>

    <% if (theClmContact.cscFaxPhoneExt != null) {%>
          <%
	  ext = theClmContact.cscFaxPhoneExt.indexOf( "x") < 0 ? 0 : theClmContact.cscFaxPhoneExt.indexOf( "x");
	  cntr = ext == 0 ? 0 : 1;
	  ext = ext == 0 ? theClmContact.cscFaxPhoneExt.length() : ext;
	  %>
	  <FaxPhone><%=theClmContact.cscFaxPhoneExt.substring( 0, ext - cntr ).replaceAll("-", "")%></FaxPhone>
	  <% if (cntr != 0) {%>    
		<FaxPhoneExtension><%=theClmContact.cscFaxPhoneExt.substring( ext + cntr, theClmContact.cscFaxPhoneExt.length() )%></FaxPhoneExtension>
	  <%}%>
    <%}%>
    <% if (theClmContact.cscEmail1Ext != null) {%>
    <EmailAddress1><%=StringUtils.getXMLValue(theClmContact.cscEmail1Ext, false)%></EmailAddress1>
    <%}%>
    <% if (theClmContact.cscEmail2Ext != null) {%>
    <EmailAddress2><%=StringUtils.getXMLValue(theClmContact.cscEmail2Ext, false)%></EmailAddress2>
    <%}%>
    <InternetCatType>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>Internet Category</ListName>
    </InternetCatType>
    <%var partyRelTo = "<PartyRelTo><PublicID>"+additionalInfo+theClmContact.PublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>"%>
    <Parties>
      <%
    	var oStatus = objStatus;
    	if (objStatus == "D") {
     		oStatus = "C";
    	}
      %>
      <% if (theClmContact.CreateUser != null) { %>
      <%=UserTemplate.renderToString(theClmContact.CreateUser, "", oStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>	

      <% if (theClmContact.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(theClmContact.UpdateUser, "", oStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
      <%}%>	
    </Parties>
    
    <% if (theClmContact.cscTollFreeNumberExt != null) {%>
          <%
	  ext = theClmContact.cscTollFreeNumberExt.indexOf( "x") < 0 ? 0 : theClmContact.cscTollFreeNumberExt.indexOf( "x");
	  cntr = ext == 0 ? 0 : 1;
	  ext = ext == 0 ? theClmContact.cscTollFreeNumberExt.length() : ext;
	  %>
	  <TollFreeExt><%=theClmContact.cscTollFreeNumberExt.substring( 0, ext - cntr ).replaceAll("-", "")%></TollFreeExt>
	  <% if (cntr != 0) {%>    
		<TollFreeExtension><%=theClmContact.cscTollFreeNumberExt.substring( ext + cntr, theClmContact.cscTollFreeNumberExt.length() )%></TollFreeExtension>
	  <%}%>
    <%}%>

  </Party>
</Transaction>