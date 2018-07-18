<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PartyTemplate %>
<% uses templates.messaging.edw.PartyRoleTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(theactivity : Activity, objStatus : String, eventName : String) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(theactivity.LoadCommandID, theactivity.CreateUser, theactivity.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>
  <%if (theactivity.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=theactivity.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (theactivity.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=theactivity.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (theactivity.Claim.LossType != null) {%>
  <TransactionLossType><%=theactivity.Claim.LossType%></TransactionLossType>
  <%}%>
  <Activity>
    <PublicID><%=theactivity.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (theactivity.RptCreateDateExt != null and theactivity.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(theactivity.LoadCommandID, theactivity.CreateUser, theactivity.UpdateUser)) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theactivity.RptCreateDateExt)%></CreateTime> 
    <%} else if (theactivity.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theactivity.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theactivity.RptUpdateDateExt != null and theactivity.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(theactivity.LoadCommandID, theactivity.CreateUser, theactivity.UpdateUser)) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theactivity.RptUpdateDateExt)%></UpdateTime> 
    <%} else if (theactivity.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theactivity.UpdateTime)%></UpdateTime> 
    <%}%>
    <% if (theactivity.Claim != null && theactivity.Claim.PublicID != null) {%>
    <RelToClaim><%=theactivity.Claim.PublicID%></RelToClaim>								
    <%}%>
    <% if (theactivity.Exposure != null && theactivity.Exposure.PublicID != null) {%>
    <RelToFeature><%=theactivity.Exposure.PublicID%></RelToFeature>
    <%}%> 
    <% if (theactivity.TargetDate != null) {%>
    <TargetDate><%=theactivity.TargetDate%></TargetDate> 
    <%}%>
    <% if (theactivity.EscalationDate != null) {%>
    <EscalationDate><%=theactivity.EscalationDate%></EscalationDate> 
    <%}%>
    <% if (theactivity.Subject != null) {%>
    <Subject><%=StringUtils.getXMLValue(theactivity.Subject, false)%></Subject>
    <%}%>
    <% if (theactivity.Description != null) {%>
    <Description><%=StringUtils.getXMLValue(theactivity.Description, false)%></Description>
    <%}%>
    <% if (theactivity.Mandatory != null) {%>
    <Mandatory><%=StringUtils.getXMLValue(theactivity.Mandatory as java.lang.String, false)%></Mandatory>
    <%}%>
    <% if (theactivity.Recurring != null) {%>
    <Recurring><%=StringUtils.getXMLValue(theactivity.Recurring as java.lang.String, false)%></Recurring>
    <%}%>
    <% if (theactivity.ExternallyOwned != null) {%>
    <ExternallyOwned><%=StringUtils.getXMLValue(theactivity.ExternallyOwned as java.lang.String, false)%></ExternallyOwned>
    <%}%>
    <% if (theactivity.Priority != null) {%>
    <%=TypeListTemplate.renderToString(theactivity.Priority, "Priority", theactivity.Priority.ListName)%>
    <%}%>
    <% if (theactivity.Status != null) {%>
    <%=TypeListTemplate.renderToString(theactivity.Status, "Status", theactivity.Status.ListName)%>
    <%}%>

    <%var partyRelTo = "<PartyRelTo><PublicID>"+theactivity.PublicID+"</PublicID><RelToType>Activity</RelToType></PartyRelTo>"%>
    <Parties>
      <% if (theactivity.CreateUser != null) { %>
	      <%=UserTemplate.renderToString(theactivity.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>
      <% if (theactivity.UpdateUser != null) { %>
	      <%=UserTemplate.renderToString(theactivity.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
      <%}%>

      <% if (theactivity.AssignedUser != null) { var theassigneduser = theactivity.AssignedUser;%>
      <%var arole = "<Role><Code>assigneduser</Code><Description>AssignedUser</Description><ListName>AssignedUser</ListName></Role>"%>
      <%=UserTemplate.renderToString(theassigneduser, "", objStatus, arole, "", partyRelTo)%>
      <%}%>

      <% if (theactivity.AssignedByUser != null) { var theassignedbyuser = theactivity.AssignedByUser;%>
      <%var abrole = "<Role><Code>assignedbyuser</Code><Description>AssignedByUser</Description><ListName>AssignedByUser</ListName></Role>"%>
      <%=UserTemplate.renderToString(theassignedbyuser, "", objStatus, abrole, "", partyRelTo)%>
      <%}%>

      <% if (theactivity.AssignedGroup != null) { var thegroup = theactivity.AssignedGroup;%>
      <Party>
        <PublicID>grp:<%=thegroup.PublicID%></PublicID>
        <ObjectStatus><%=objStatus%></ObjectStatus>
        <% if (thegroup.CreateTime != null) {%>
        <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thegroup.CreateTime)%></CreateTime> 
        <%}%>
        <% if (thegroup.UpdateTime != null) {%>
        <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thegroup.UpdateTime)%></UpdateTime> 
        <%}%>
        <Role>
          <Code>assignedgroup</Code>
          <Description>Assigned Group</Description>
          <ListName>Assigned Group</ListName>
        </Role> 
        <% if (thegroup.Name != null) {%>
        <Name><%=StringUtils.getXMLValue(thegroup.Name.replaceAll("\\xae", ""), false)%></Name>
        <%} else {%>
        <Name><%=StringUtils.getXMLValue(thegroup.DisplayName.replaceAll("\\xae", ""), false)%></Name>
        <%}%>
        <Management>  
        <% if (thegroup.Name != null) {%>
        <Name><%=StringUtils.getXMLValue(thegroup.Name.replaceAll("\\xae", ""), false)%></Name>
        <%}%>
        </Management>
      </Party>
      <%}%>

      <%--  KOtteson - defect 1768 - added business unit party --%>
      <% if (theactivity.getClaimOfficeBranchGroup() != null) { var thegroup = theactivity.getClaimOfficeBranchGroup();%>
      <Party>
        <PublicID>grp:<%=thegroup.PublicID%></PublicID>
        <ObjectStatus><%=objStatus%></ObjectStatus>
        <% if (thegroup.CreateTime != null) {%>
        <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thegroup.CreateTime)%></CreateTime> 
        <%}%>
        <% if (thegroup.UpdateTime != null) {%>
        <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thegroup.UpdateTime)%></UpdateTime> 
        <%}%>
        <Role>
          <Code>businessunit</Code>
          <Description>Business Unit</Description>
          <ListName>Business Unit</ListName>
        </Role> 
        <%=TypeListTemplate.renderToString(theactivity.AssignmentStatus, "AssignmentStatus", theactivity.AssignmentStatus.ListName)%>
        <% if (thegroup.Name != null) {%>
        <Name><%=StringUtils.getXMLValue(thegroup.Name.replaceAll("\\xae", ""), false)%></Name>
        <%}%>
        <Management>  
        <% if (thegroup.Name != null) {%>
        <Name><%=StringUtils.getXMLValue(thegroup.Name.replaceAll("\\xae", ""), false)%></Name>
        <%}%>
        </Management>
      </Party>
      <%}%>

      <% if (theactivity.RelatedTo typeis Contact)  { var therelatedto = theactivity.RelatedTo;%>
      <%var rprole = "<Role><Code>relatedparty</Code><Description>RelatedParty</Description><ListName>Related Party</ListName></Role>"%>
      <%=PartyTemplate.renderToString(therelatedto, "", objStatus, rprole, "", partyRelTo, theactivity.Claim, "", "")%>
      <%}%>

      <% if ((theactivity.ExternalOwnerCC != null)
      && ((theactivity.ExternallyOwned != null)
      && (theactivity.ExternallyOwned == true)))  { var theexternalowner = theactivity.ExternalOwnerCC.Contact;%>
      <%var eorole = "<Role><Code>activityowner</Code><Description>ActivityOwner</Description><ListName>ContactRole</ListName></Role>"%>
      <%=PartyTemplate.renderToString(theexternalowner, "", objStatus, eorole, "", partyRelTo, theactivity.Claim, "", "")%>
      <%}%>

      <%if (objStatus == "C") {%>
      <%if (theactivity.ExternallyOwned == true && theactivity.getOriginalValue( "ExternalOwnerCC" ) != null) {%>
      <%var aorole = "<Role><Code>activityowner</Code><Description>ActivityOwner</Description><ListName>ContactRole</ListName></Role>"%>
      <%var theexternalowner : ClaimContact = ClaimContact(theactivity.getOriginalValue( "ExternalOwnerCC" ))%>
      <%if ((theactivity.getOriginalValue("ExternallyOwned"))
      && (theactivity.getOriginalValue( "ExternalOwnerCC" ) != theactivity.ExternalOwnerCC.getFieldValue( "ID" ))) {%>
      <%=PartyRoleTemplate.renderToString(theexternalowner.Contact, "", aorole, "", "E", partyRelTo, "D")%>
      <%} else if (theactivity.getOriginalValue("ExternallyOwned") as java.lang.String == "true") {%>
      <%=PartyRoleTemplate.renderToString(theexternalowner.Contact, "", aorole, "", "E", partyRelTo, "D")%>
      <%}%>
      <%}%>
      <%}%>
    </Parties>
  </Activity>
</Transaction>