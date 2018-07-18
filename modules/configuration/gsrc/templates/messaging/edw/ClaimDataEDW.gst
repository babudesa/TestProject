<%@ params(theclaim : Claim, objStatus : String, incidentStatus : String, eventName : String) %>
<% uses org.apache.commons.lang.StringEscapeUtils %>
<% uses templates.messaging.edw.commons.YesNoTypeListTemplate %>
<% uses templates.messaging.edw.commons.StringParseTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (theclaim.LossType.Code == "PERSONALAUTO" && theclaim.ConvertedClaimIndExt && objStatus == "A") {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <%} else if (ConversionStatusChecker.isCurrentlyConverting(theclaim.LoadCommandID, theclaim.CreateUser, theclaim.UpdateUser)) {%>
   <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
   <% } else {%>
   <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
   <%}%>
  <%if (theclaim.ClaimNumber != null) {%>
  <ClaimNumber><%=theclaim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (theclaim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=theclaim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (theclaim.LossType != null) {%>
  <TransactionLossType><%=theclaim.LossType%></TransactionLossType>
  <%}%>
  <Claim>
    <PublicID><%=theclaim.PublicID%></PublicID>
    <% if (objStatus == "D") {%>
    <ObjectStatus>C</ObjectStatus>
    <%} else {%>
    <ObjectStatus><%=objStatus%></ObjectStatus>  
    <%}%>
    <ClaimNumber><%=theclaim.ClaimNumber%></ClaimNumber>
    <% if (theclaim.RptCreateDateExt != null and theclaim.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(theclaim.LoadCommandID, theclaim.CreateUser, theclaim.UpdateUser)) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.RptCreateDateExt)%></CreateTime> 
    <%} else if (theclaim.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theclaim.RptUpdateDateExt != null and theclaim.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(theclaim.LoadCommandID, theclaim.CreateUser, theclaim.UpdateUser)) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.RptUpdateDateExt)%></UpdateTime> 
    <%} else if (theclaim.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.UpdateTime)%></UpdateTime> 
    <%}%>
    <% if (theclaim.LossDate != null) {%>
    <LossDate><%=theclaim.LossDate%></LossDate> 
    <%}%>
    <% if (theclaim.ReportedDate != null) {%>
    <ReportedDate><%=theclaim.ReportedDate%></ReportedDate> 
    <%}%>
    <% if (theclaim.DateRptdToAgent != null) {%>
    <DateRptdToAgent><%=theclaim.DateRptdToAgent%></DateRptdToAgent> 
    <%}%>
    <% if (theclaim.IncidentReport != null) {%>
    <IncidentReport><%=theclaim.IncidentReport%></IncidentReport>
    <%}%>
    <% if (theclaim.FirstNoticeSuit != null) {%> 
    <FirstNoticeSuit><%=theclaim.FirstNoticeSuit%></FirstNoticeSuit>
    <%}%>
    <% if (theclaim.Description != null) {%> 
    <Description><%=StringEscapeUtils.escapeXml(theclaim.Description)%></Description>
    <%}%>
    <% if (theclaim.WeatherRelated_Ext != null) {%> 
    <WeatherRelated_Ext><%=theclaim.WeatherRelated_Ext%></WeatherRelated_Ext>
    <%}%>
    <% if (theclaim.EstimatedDamage_Ext != null) {%> 
    <EstimatedDamage_Ext><%=theclaim.EstimatedDamage_Ext%></EstimatedDamage_Ext>
    <%}%>
    <% if (theclaim.Catastrophe.PublicID != null) {%> 
    <Catastrophe><%=theclaim.Catastrophe.PublicID %></Catastrophe>
    <%}%>		
    <% if (theclaim.LossCause != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.LossCause, "LossCause", theclaim.LossCause.ListName)%>
    <%}%>
    <% if (theclaim.ex_DetailLossCause != null) {%> 
    <%=TypeListTemplate.renderToString(theclaim.ex_DetailLossCause, "ex_DetailLossCause", theclaim.ex_DetailLossCause.ListName)%>
    <%}%>
    <% if (theclaim.LossType != null) {%> 
    <%=TypeListTemplate.renderToString(theclaim.LossType, "LossType", theclaim.LossType.ListName)%>
    <%}%>
    <% if (theclaim.HowReported != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.HowReported, "HowReported", theclaim.HowReported.ListName)%>
    <%}%>
    <% if (theclaim.ex_LossDueTo != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.ex_LossDueTo, "ex_LossDueTo", theclaim.ex_LossDueTo.ListName)%>
    <%}%>
    <% if (theclaim.ex_LossLocation != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.ex_LossLocation, "ex_LossLocation", theclaim.ex_LossLocation.ListName)%>
    <%}%>
    <% if (theclaim.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(theclaim.LoadCommandID, theclaim.CreateUser, theclaim.UpdateUser) and theclaim.StorageDate != null) { %>
            <AssignmentDate><%=theclaim.StorageDate%></AssignmentDate>
     <% } else if (theclaim.AssignmentDate != null) {%>
            <AssignmentDate><%=theclaim.AssignmentDate%></AssignmentDate> 
    <%}%>
    <% if (theclaim.State != null) {%>
    <% if (incidentStatus == "open") {%>
    <Status>
    <Code>open</Code>
    <Description>Open</Description>
    <ListName><%=StringUtils.getXMLValue(theclaim.State.ListName, false)%></ListName>
    </Status>
    <% } else { %>
    <%=TypeListTemplate.renderToString(theclaim.State, "Status", theclaim.State.ListName)%>
    <%}%>
    <%}%>
    <% if (theclaim.JurisdictionState != null) {%>
    <JurisdictionState>
      <Code><%=theclaim.JurisdictionState.Code%></Code>
      <Description><%=theclaim.JurisdictionState.Description%></Description>
      <ListName><%=theclaim.JurisdictionState.ListName%></ListName>
      <AddressType>
        <Code>jurisdictionstate</Code>
        <Description>Jurisdiction State</Description>
        <ListName>Jurisdiction State</ListName>
      </AddressType>
    </JurisdictionState>
    <%}%>

    <% if (theclaim.ClosedOutcome != null) {%>
    <% if (incidentStatus != "open") {%>
    <%=TypeListTemplate.renderToString(theclaim.ClosedOutcome, "ClosedOutcome", theclaim.ClosedOutcome.ListName)%>
    <%}%>
    <%}%>
    <% if (theclaim.ReopenedReason != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.ReopenedReason, "ReOpenedReason", theclaim.ReopenedReason.ListName)%>
    <%}%>  

    <%
    var oStatus = objStatus;
    if (objStatus == "D") {
     oStatus = "C";
    }
    %>
    <% if (theclaim.LossLocation != null) { var locationaddress = theclaim.LossLocation;%>
    <%=LossLocationTemplate.renderToString(locationaddress, oStatus, theclaim)%>
    <%}%>
    <% if (theclaim.VendorFraudExt != null) {%> 
    <VendorFraudExt><%=theclaim.VendorFraudExt%></VendorFraudExt>
    <%}%>
    <% if (theclaim.LossCauseOtherDescExt != null) {%> 
    <LossCauseOtherDescExt><%=theclaim.LossCauseOtherDescExt%></LossCauseOtherDescExt>
    <%}%>
    <% if (theclaim.AmountClaimedExt != null) {%> 
    <AmountClaimedExt><%=theclaim.AmountClaimedExt%></AmountClaimedExt>
    <%}%>
    <% if (theclaim.DetailLossCause2Ext != null) {%> 
    <%=TypeListTemplate.renderToString(theclaim.DetailLossCause2Ext, "DetailLossCause2Ext", theclaim.DetailLossCause2Ext.ListName)%>
    <%}%>
    <% if (theclaim.DetailLossCause3Ext != null) {%> 
    <%=TypeListTemplate.renderToString(theclaim.DetailLossCause3Ext, "DetailLossCause3Ext", theclaim.DetailLossCause3Ext.ListName)%>
    <%}%>
    <% if (theclaim.PotentialDevelopmentExt != null) {%> 
    <PotentialDevelopmentExt><%=theclaim.PotentialDevelopmentExt%></PotentialDevelopmentExt>
    <%}%>
    <% if (theclaim.ClaimRelatedTypeExt != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.ClaimRelatedTypeExt, "ClaimRelatedTypeExt", theclaim.ClaimRelatedTypeExt.ListName)%>
    <%}%>
    <% if (theclaim.ClaimTypeExt != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.ClaimTypeExt, "ClaimTypeExt", theclaim.ClaimTypeExt.ListName)%>
    <%}%>
    <% if (theclaim.ASideDICExt != null) {%> 
    <ASideDICExt><%=theclaim.ASideDICExt%></ASideDICExt>
    <%}%>
    <% if (theclaim.BodilyInjuryExt != null) {%> 
    <BodilyInjuryExt><%=theclaim.BodilyInjuryExt%></BodilyInjuryExt>
    <%}%>
    <% if (theclaim.NoticeDateExt != null) {%> 
    <NoticeDateExt><%=theclaim.NoticeDateExt%></NoticeDateExt>
    <%}%>
    <% if (theclaim.AreaofPracticeExt != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.AreaofPracticeExt, "AreaofPracticeExt", theclaim.AreaofPracticeExt.ListName)%>
    <%}%>
    <% if (theclaim.ProjectCategoryExt != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.ProjectCategoryExt, "ProjectCategoryExt", theclaim.ProjectCategoryExt.ListName)%>
    <%}%>
    <% if (theclaim.IndustryCategoryExt != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.IndustryCategoryExt, "IndustryCategoryExt", theclaim.IndustryCategoryExt.ListName)%>
    <%}%>
    <% if (theclaim.UnderlyingDamagesExt != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.UnderlyingDamagesExt, "UnderlyingDamagesExt", theclaim.UnderlyingDamagesExt.ListName)%>
    <%}%>
    <% if (theclaim.ContractTypeExt != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.ContractTypeExt, "ContractTypeExt", theclaim.ContractTypeExt.ListName)%>
    <%}%>    
    <Parties>
    <%
    uses java.util.Map ;
    uses java.util.HashMap ;
    uses util.UniqueNumberGenerators
    uses templates.messaging.edw.TypeListTemplate
    uses util.StringUtils
    uses templates.messaging.edw.LossLocationTemplate
    uses templates.messaging.edw.PartyTemplate
    uses templates.messaging.edw.PolicyTemplate
    uses templates.messaging.edw.RiskClaimTemplate
    uses templates.messaging.edw.RiskAircraftTemplate
    uses templates.messaging.edw.ClaimOtherCoverageTemplate
    uses templates.messaging.edw.UserTemplate
    uses gw.api.database.Query
    var contacts : Map = new HashMap() ;

    for ( cc in theclaim.Contacts ) {
      for (ccr in cc.Roles) {
        if ((ccr.getOwner() == null or ccr.getOwner() == theclaim.ClaimNumber) and ccr.Role != "checkpayee" and ccr.Role != "recoverypayer" and ccr.Role != "activityowner" and ccr.Contact != null) {
          var key : String = ccr.PublicID + ccr.Role.Code ;
          var isDuplicateContact = false ;
          if (ccr.Contact.AddressBookUID != null) {
            for (objkey in contacts.keySet().iterator()) {
              var listccr = contacts.get(objkey) as ClaimContactRole ;
              if (listccr.Contact.AddressBookUID == ccr.Contact.AddressBookUID and listccr.Role.Code == ccr.Role.Code) {
                isDuplicateContact = true ;
                break ;
              }
            }
          }
          if (!isDuplicateContact) {
            contacts.put(key, ccr) ;
          }
        }
      }
    }
    %>
    <%var partyRelTo = "<PartyRelTo><PublicID>"+theclaim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>"%>
    <% for( contactkey in contacts.keySet().iterator() ) {%>
    <%var thepartiesinvolved = contacts.get(contactkey) as ClaimContactRole%>
    <%var pirole = "<Role><Code>"+thepartiesinvolved.Role.Code+"</Code><Description>"+thepartiesinvolved.Role.Description+"</Description><ListName>"+thepartiesinvolved.Role.ListName+"</ListName></Role>"%>
    <%=PartyTemplate.renderToString(thepartiesinvolved.Contact, "", oStatus, pirole, "", partyRelTo, theclaim, "", "")%>
    <%}%>

    <% if (theclaim.CreateUser != null) { %>
    <%=UserTemplate.renderToString(theclaim.CreateUser, "", oStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
    <%}%>

    <% if (theclaim.UpdateUser != null) { %>
    <%=UserTemplate.renderToString(theclaim.UpdateUser, "", oStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
    <%}%>

    <% if (theclaim.AssignedUser != null) { var theassigneduser = theclaim.AssignedUser;%>
    <%var aurole = "<Role><Code>assigneduser</Code><Description>AssignedUser</Description><ListName>AssignedUser</ListName></Role>"%>
    <%var assignStatus = "<AssignmentStatus><Code>"+theclaim.AssignmentStatus.Code+"</Code><Description>"+theclaim.AssignmentStatus.DisplayName+"</Description><ListName>"+theclaim.AssignmentStatus.ListName+"</ListName></AssignmentStatus>"%>
    <%=UserTemplate.renderToString(theassigneduser, "", oStatus, aurole, assignStatus, partyRelTo)%>
    <%}%>

    <% if (theclaim.AssignedByUser != null) { var theassignedbyuser = theclaim.AssignedByUser;%>
    <%var aburole = "<Role><Code>assignedbyuser</Code><Description>AssignedByUser</Description><ListName>AssignedByUser</ListName></Role>"%>
    <%=UserTemplate.renderToString(theassignedbyuser, "", oStatus, aburole, "", partyRelTo)%>
    <%}%>

    <% if (theclaim.PreviousUser != null) { var theprevioususer = theclaim.PreviousUser;%>
    <%var purole = "<Role><Code>previoususer</Code><Description>PreviousUser</Description><ListName>PreviousUser</ListName></Role>"%>
    <%=UserTemplate.renderToString(theprevioususer, "", oStatus, purole, "", partyRelTo)%>
    <%}%>

    <% if (theclaim.AssignedGroup != null) { var thegroup = theclaim.AssignedGroup;%>
    <Party>
      <PublicID>grp:<%=thegroup.PublicID%></PublicID>
      <% if (objStatus == "D") {%>
      <ObjectStatus>C</ObjectStatus>
      <%} else {%>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <%}%>
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
      <%=TypeListTemplate.renderToString(theclaim.AssignmentStatus, "AssignmentStatus", theclaim.AssignmentStatus.ListName)%>
      <% if (thegroup.Name != null) {%>
      <Name><%=StringUtils.getXMLValue(thegroup.Name.replaceAll("\\xae", ""), false)%></Name>
      <%}%>
      <Management>  
        <% if (thegroup.Name != null) {%>
        <Name><%=StringUtils.getXMLValue(thegroup.Name.replaceAll("\\xae", ""), false)%></Name>
        <%}%>
        <%=TypeListTemplate.renderToString(thegroup.GroupType, "GroupType", thegroup.GroupType.ListName)%>
      </Management>
      <% if (thegroup.SecurityZone  != null) {%>
        <SecurityZone><%=thegroup.SecurityZone%></SecurityZone> 
      <%}%>
      <% if (thegroup.SecurityZone.SecurityFilters  != null and thegroup.SecurityZone.SecurityFilters.length > 0) {%>
        <SecureReferenceValues>
          <%for (secref in thegroup.SecurityZone.SecurityFilters){
              if (secref typeis ProfitCenterSecurityFilterExt) {
                if (secref.ProfitCenterGrouping != null) {
                  for (var bu in secref.ProfitCenterGrouping.BusinessUnitItemExt) {
                    if (bu.BusinessUnit != null) {
                      for (var prmid in util.admin.SecurityUtil.convertBusinessUnitToPRMName(bu.BusinessUnit)) {
                  %>
                    <SecureReferenceValuesExt>
                      <%=TypeListTemplate.renderToString(typekey.AccessTypeExt.TC_PRODUCINGBUSINESSUNIT, "AccessTypeExt", typekey.AccessTypeExt.TC_PRODUCINGBUSINESSUNIT.ListName)%>
                        <AccessValue><%=prmid%></AccessValue> 
                    </SecureReferenceValuesExt>
                  <%}}}
                  for (var pc in secref.ProfitCenterGrouping.ProfitCenterItemExt) {
                  %>
                    <SecureReferenceValuesExt>
                      <%=TypeListTemplate.renderToString(typekey.AccessTypeExt.TC_PROFITCENTER, "AccessTypeExt", typekey.AccessTypeExt.TC_PROFITCENTER.ListName)%>
                      <%if (pc.ProfitCenter != null) {%>
                        <AccessValue><%=pc.ProfitCenter%></AccessValue> 
                      <%}%>
                    </SecureReferenceValuesExt>
                  <%}
                }
              } else if (secref typeis ClaimsBusinessUnitSecurityFilterExt) {%>
                <SecureReferenceValuesExt>
                  <%=TypeListTemplate.renderToString(typekey.AccessTypeExt.TC_PARENTGROUP, "AccessTypeExt", typekey.AccessTypeExt.TC_PARENTGROUP.ListName)%>
                  <%if (secref.ClaimsBusinessUnit != null) {%>
                    <AccessValue><%=secref.ClaimsBusinessUnit.PublicID%></AccessValue> 
                  <%}%>
                </SecureReferenceValuesExt>
              <%}%>
          <%}%>
        </SecureReferenceValues>
      <%}%>
    </Party>   
    <%}%>

    <% if (theclaim.getClaimOfficeBranchGroup() != null) { var thegroup = theclaim.getClaimOfficeBranchGroup();%>
    <Party>
      <PublicID>grp:<%=thegroup.PublicID%></PublicID>
      <% if (objStatus == "D") {%>
      <ObjectStatus>C</ObjectStatus>
      <%} else {%>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <%}%>
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
      <%=TypeListTemplate.renderToString(theclaim.AssignmentStatus, "AssignmentStatus", theclaim.AssignmentStatus.ListName)%>
      <% if (thegroup.Name != null) {%>
      <Name><%=StringUtils.getXMLValue(thegroup.Name.replaceAll("\\xae", ""), false)%></Name>
      <%}%>
      <Management>  
        <% if (thegroup.Name != null) {%>
        <Name><%=StringUtils.getXMLValue(theclaim.getClaimOfficeBranch().replaceAll("\\xae", ""), false)%></Name>
        <%}%>
        <%=TypeListTemplate.renderToString(thegroup.GroupType, "GroupType", thegroup.GroupType.ListName)%>
      </Management>
      <% if (thegroup.SecurityZone  != null) {%>
        <SecurityZone><%=thegroup.SecurityZone%></SecurityZone> 
      <%}%>
      <% if (thegroup.SecurityZone.SecurityFilters  != null and thegroup.SecurityZone.SecurityFilters.length > 0) {%>
        <SecureReferenceValues>
          <%for (secref in thegroup.SecurityZone.SecurityFilters){
              if (secref typeis ProfitCenterSecurityFilterExt) {
                if (secref.ProfitCenterGrouping != null) {
                  for (var bu in secref.ProfitCenterGrouping.BusinessUnitItemExt) {
                    if (bu.BusinessUnit != null) {
                      for (var prmid in util.admin.SecurityUtil.convertBusinessUnitToPRMName(bu.BusinessUnit)) {
                  %>
                    <SecureReferenceValuesExt>
                      <%=TypeListTemplate.renderToString(typekey.AccessTypeExt.TC_PRODUCINGBUSINESSUNIT, "AccessTypeExt", typekey.AccessTypeExt.TC_PRODUCINGBUSINESSUNIT.ListName)%>
                        <AccessValue><%=prmid%></AccessValue> 
                    </SecureReferenceValuesExt>
                  <%}}}
                  for (var pc in secref.ProfitCenterGrouping.ProfitCenterItemExt) {
                  %>
                    <SecureReferenceValuesExt>
                      <%=TypeListTemplate.renderToString(typekey.AccessTypeExt.TC_PROFITCENTER, "AccessTypeExt", typekey.AccessTypeExt.TC_PROFITCENTER.ListName)%>
                      <%if (pc.ProfitCenter != null) {%>
                        <AccessValue><%=pc.ProfitCenter%></AccessValue> 
                      <%}%>
                    </SecureReferenceValuesExt>
                  <%}
                }
              } else if (secref typeis ClaimsBusinessUnitSecurityFilterExt) {%>
                <SecureReferenceValuesExt>
                  <%=TypeListTemplate.renderToString(typekey.AccessTypeExt.TC_PARENTGROUP, "AccessTypeExt", typekey.AccessTypeExt.TC_PARENTGROUP.ListName)%>
                  <%if (secref.ClaimsBusinessUnit != null) {%>
                    <AccessValue><%=secref.ClaimsBusinessUnit.PublicID%></AccessValue> 
                  <%}%>
                </SecureReferenceValuesExt>
              <%}%>
          <%}%>
        </SecureReferenceValues>
      <%}%>
    </Party>
    <%}%>
    <% if (theclaim.NCWOnlyBusinessUnitExt != null) { %>
    <%var qry = Query.make(Group);%>
    <%var secmng = qry.join(SecureManageValuesExt, "ProducingUnitExt")%>
    <%secmng.compare("BusinessUnitExt", Equals, theclaim.NCWOnlyBusinessUnitExt);%>
    <%var producingUnit = qry.select().AtMostOneRow;%>
    <% if (producingUnit != null) { %>
    <Party>
      <PublicID>grp:<%=producingUnit.PublicID%></PublicID>
      <% if (objStatus == "D") {%>
      <ObjectStatus>C</ObjectStatus>
      <%} else {%>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <%}%>
      <% if (producingUnit.CreateTime != null) {%>
      <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(producingUnit.CreateTime)%></CreateTime> 
      <%}%>
      <% if (producingUnit.UpdateTime != null) {%>
      <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(producingUnit.UpdateTime)%></UpdateTime> 
      <%}%>
      <Role>
        <Code>producingbusinessunit</Code>
        <Description>Producing Business Unit</Description>
        <ListName>UserRole</ListName>
      </Role> 
      <%=TypeListTemplate.renderToString(theclaim.AssignmentStatus, "AssignmentStatus", theclaim.AssignmentStatus.ListName)%>
      <% if (producingUnit.Name != null) {%>
      <Name><%=StringUtils.getXMLValue(producingUnit.Name.replaceAll("\\xae", ""), false)%></Name>
      <%}%>
      <Management>  
        <% if (producingUnit.Name != null) {%>
        <Name><%=StringUtils.getXMLValue(producingUnit.Name.replaceAll("\\xae", ""), false)%></Name>
        <%}%>
        <%=TypeListTemplate.renderToString(producingUnit.GroupType, "GroupType", producingUnit.GroupType.ListName)%>
      </Management>
      <% if (producingUnit.SecurityZone  != null) {%>
        <SecurityZone><%=producingUnit.SecurityZone%></SecurityZone> 
      <%}%>
      <% if (producingUnit.SecurityZone.SecurityFilters  != null and producingUnit.SecurityZone.SecurityFilters.length > 0) {%>
        <SecureReferenceValues>
          <%for (secref in producingUnit.SecurityZone.SecurityFilters){
              if (secref typeis ProfitCenterSecurityFilterExt) {
                if (secref.ProfitCenterGrouping != null) {
                  for (var bu in secref.ProfitCenterGrouping.BusinessUnitItemExt) {
                    if (bu.BusinessUnit != null) {
                      for (var prmid in util.admin.SecurityUtil.convertBusinessUnitToPRMName(bu.BusinessUnit)) {
                  %>
                    <SecureReferenceValuesExt>
                      <%=TypeListTemplate.renderToString(typekey.AccessTypeExt.TC_PRODUCINGBUSINESSUNIT, "AccessTypeExt", typekey.AccessTypeExt.TC_PRODUCINGBUSINESSUNIT.ListName)%>
                        <AccessValue><%=prmid%></AccessValue> 
                    </SecureReferenceValuesExt>
                  <%}}}
                  for (var pc in secref.ProfitCenterGrouping.ProfitCenterItemExt) {
                  %>
                    <SecureReferenceValuesExt>
                      <%=TypeListTemplate.renderToString(typekey.AccessTypeExt.TC_PROFITCENTER, "AccessTypeExt", typekey.AccessTypeExt.TC_PROFITCENTER.ListName)%>
                      <%if (pc.ProfitCenter != null) {%>
                        <AccessValue><%=pc.ProfitCenter%></AccessValue> 
                      <%}%>
                    </SecureReferenceValuesExt>
                  <%}
                }
              } else if (secref typeis ClaimsBusinessUnitSecurityFilterExt) {%>
                <SecureReferenceValuesExt>
                  <%=TypeListTemplate.renderToString(typekey.AccessTypeExt.TC_PARENTGROUP, "AccessTypeExt", typekey.AccessTypeExt.TC_PARENTGROUP.ListName)%>
                  <%if (secref.ClaimsBusinessUnit != null) {%>
                    <AccessValue><%=secref.ClaimsBusinessUnit.PublicID%></AccessValue> 
                  <%}%>
                </SecureReferenceValuesExt>
              <%}%>
          <%}%>
        </SecureReferenceValues>
      <%}%>
    </Party>   
    <%}%>
    <%}%>
    <% if (theclaim.LossType != null and (theclaim.LossType == LossType.TC_AGRIEL or theclaim.LossType == LossType.TC_AGRIWC
                                      or  theclaim.LossType == LossType.TC_ALTMARKETSEL or theclaim.LossType == LossType.TC_ALTMARKETSWC
                                      or  theclaim.LossType == LossType.TC_ECUEL or theclaim.LossType == LossType.TC_ECUWC                                     
                                      or  theclaim.LossType == LossType.TC_OMEL or theclaim.LossType == LossType.TC_OMWC                                     
                                      or  theclaim.LossType == LossType.TC_PIMINMARINEEL or theclaim.LossType == LossType.TC_PIMINMARINEWC                                    
                                      or  theclaim.LossType == LossType.TC_SPECIALTYESEL or theclaim.LossType == LossType.TC_SPECIALTYESWC                                     
                                      or  theclaim.LossType == LossType.TC_STRATEGICCOMPEL or theclaim.LossType == LossType.TC_STRATEGICCOMPWC                                     
                                      or  theclaim.LossType == LossType.TC_TRUCKINGEL or theclaim.LossType == LossType.TC_TRUCKINGWC 
                                      or  theclaim.LossType == LossType.TC_ALTMARKETSAUTO or theclaim.LossType == LossType.TC_SHSAUTO
                                      or  theclaim.LossType == LossType.TC_AGRIAUTO or theclaim.LossType == LossType.TC_TRUCKINGAUTO)) { %>

          <Party>
            <% if (theclaim.ExternalHandlingExt != null) {%>
                <PublicID>csg:<%=theclaim.ExternalHandlingExt.PublicID%></PublicID>
                <% if (objStatus == "D") {%>
                     <ObjectStatus>C</ObjectStatus>
                <%} else {%>
                     <ObjectStatus><%=objStatus%></ObjectStatus>
                <%}%>
                <% if (theclaim.ExternalHandlingExt.CreateTime != null) {%>
                  <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.ExternalHandlingExt.CreateTime)%></CreateTime> 
                <%}%>
                <% if (theclaim.ExternalHandlingExt.UpdateTime != null) {%>
                  <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.ExternalHandlingExt.UpdateTime)%></UpdateTime> 
                <%}%>
                <Role>
                  <Code>claimservicegroup</Code>
                  <Description>Claim Service Group</Description>
                  <ListName>ClaimServiceGroup</ListName>
                </Role> 
                <% if (theclaim.ExternalHandlingExt.NameExt != null) {%>
                    <Name><%=StringUtils.getXMLValue(theclaim.ExternalHandlingExt.NameExt.replaceAll("\\xae", ""), false)%></Name>
                <%}%>
            <%} else {%>
                <PublicID>csg:GAI</PublicID>
                <% if (objStatus == "D") {%>
                   <ObjectStatus>C</ObjectStatus>
                <%} else {%>
                   <ObjectStatus><%=objStatus%></ObjectStatus>
                <%}%>
                <% if (theclaim.CreateTime != null) {%>
                  <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.CreateTime)%></CreateTime> 
                <%}%>
                <% if (theclaim.UpdateTime != null) {%>
                  <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.UpdateTime)%></UpdateTime> 
                <%}%>
                <Role>
                  <Code>claimservicegroup</Code>
                  <Description>Claim Service Group</Description>
                  <ListName>ClaimServiceGroup</ListName>
                </Role> 
                <Name>GAI</Name>
            <%}%>   
          </Party>   
    <%}%>
    <% if (theclaim.ManagedCareOrgTypeExt != null) { %>
          <Party>
             <PublicID>mco:<%=theclaim.PublicID%></PublicID>
             <ObjectStatus><%=objStatus%></ObjectStatus>
             <% if (theclaim.CreateTime  != null) {%>
             <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.CreateTime)%></CreateTime> 
             <%}%>
             <% if (theclaim.UpdateTime  != null) {%>
             <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.UpdateTime)%></UpdateTime> 
             <%}%>
             <Role><Code>MCO</Code><Description>Managed Care Organization</Description><ListName>ContactRole</ListName></Role>
             <Name>default Managed Care Organization</Name>
             <%=TypeListTemplate.renderToString(theclaim.ManagedCareOrgTypeExt, "ManagedCareOrgTypeExt", theclaim.ManagedCareOrgTypeExt.ListName)%>
          </Party>
      <%}%>
    </Parties>

    <%=PolicyTemplate.renderToString(theclaim, objStatus, eventName)%>
    
    <%-- add claim risk for converted claims injured animal  --%>
    <%if ((theclaim.Policy.PolicyType != null) and (theclaim.Policy.PolicyType.Code == PolicyType.TC_AMP or theclaim.Policy.PolicyType.Code == PolicyType.TC_AMO)) {%>
    <%var riskClaimTemplateData = RiskClaimTemplate.renderToString(theclaim, objStatus, null, eventName)%>
    <% if (org.apache.commons.lang.StringUtils.deleteSpaces( riskClaimTemplateData ) != "") {%>
    <Risks>
      <%=riskClaimTemplateData%>
    </Risks>
    <%}%>
    <%}%>
    
    <%-- def 8824 Aviation - add aircraft risk  --%>
    <%if (theclaim.LossType.Code == "AVIATION") {%>
      <%var riskAircraftTemplateData = RiskAircraftTemplate.renderToString(theclaim, objStatus)%>
      <% if (org.apache.commons.lang.StringUtils.deleteSpaces( riskAircraftTemplateData ) != "") {%>
        <Risks>
          <%=riskAircraftTemplateData%>
        </Risks>
      <%}%>
    <%}%>
    
    <%=ClaimOtherCoverageTemplate.renderToString(theclaim, objStatus)%>
    <% if (theclaim.AgentUpdatesExt != null) {%> 
        <AgentUpdatesExt><%=theclaim.AgentUpdatesExt%></AgentUpdatesExt>
    <%}%>
    <% if (theclaim.WindHurricaneDedTriExt != null) {%> 
        <WindHurricaneDedTriExt><%=theclaim.WindHurricaneDedTriExt%></WindHurricaneDedTriExt>
    <%}%>
    <% if (theclaim.WindHurricaneDedAmtExt != null) {%> 
        <WindHurricaneDedAmtExt><%=theclaim.WindHurricaneDedAmtExt%></WindHurricaneDedAmtExt>
    <%}%>
    <% if (theclaim.CodeNameExt != null) {%> 
        <CodeNameExt><%=StringEscapeUtils.escapeXml(theclaim.CodeNameExt)%></CodeNameExt>
    <%}%>
    <% if (theclaim.ProductInvolvedExt != null) {%> 
        <ProductInvolvedExt><%=StringEscapeUtils.escapeXml(theclaim.ProductInvolvedExt)%></ProductInvolvedExt>
    <%}%>
    <% if (theclaim.SiteNameExt != null) {%> 
        <SiteNameExt><%=StringEscapeUtils.escapeXml(theclaim.SiteNameExt)%></SiteNameExt>
    <%}%>    
    <% if (theclaim.SiteNumberExt != null) {%> 
        <SiteNumberExt><%=StringEscapeUtils.escapeXml(theclaim.SiteNumberExt)%></SiteNumberExt>
    <%}%>   
    <% if (theclaim.ClaimTypeDetailExt != null) {%>
        <%=TypeListTemplate.renderToString(theclaim.ClaimTypeDetailExt, "ClaimTypeDetailExt", theclaim.ClaimTypeDetailExt.ListName)%>
    <%}%>
    <% if (theclaim.InspectionDateExt != null) {%> 
        <InspectionDateExt><%=theclaim.InspectionDateExt%></InspectionDateExt>
    <%}%>       
    <% if (theclaim.DeductibleStatus != null) {%>
        <%=TypeListTemplate.renderToString(theclaim.DeductibleStatus, "DeductibleStatus", theclaim.DeductibleStatus.ListName)%>
    <%}%>
    <% if (theclaim.SubrogationStatus != null) {%>
        <%=TypeListTemplate.renderToString(theclaim.SubrogationStatus, "SubrogationStatus", theclaim.SubrogationStatus.ListName)%>
    <%}%>
    <% if (theclaim.SalvageStatus != null) {%>
        <%=TypeListTemplate.renderToString(theclaim.SalvageStatus, "SalvageStatus", theclaim.SalvageStatus.ListName)%>
    <%}%>
    <% if (theclaim.OtherRecovStatus != null) {%>
        <%=TypeListTemplate.renderToString(theclaim.OtherRecovStatus, "OtherRecovStatus", theclaim.OtherRecovStatus.ListName)%>
    <%}%>
    <% if (theclaim.ReinsuranceStatus != null) {%>
        <%=TypeListTemplate.renderToString(theclaim.ReinsuranceStatus, "ReinsuranceStatus", theclaim.ReinsuranceStatus.ListName)%>
    <%}%>    
    <% if (theclaim.PermissionRequired != null) {%>
        <%=TypeListTemplate.renderToString(theclaim.PermissionRequired, "PermissionRequired", theclaim.PermissionRequired.ListName)%>
    <%}%>   
    <% if (theclaim.DOLOutsideIndExt != null) {%> 
    	<DOLOutsideIndExt><%=theclaim.DOLOutsideIndExt%></DOLOutsideIndExt>
    <%}%>    
    <% if (theclaim.LegacyClaimNumExt != null) {%> 
    	<LegacyClaimNumExt><%=StringUtils.getXMLValue(theclaim.LegacyClaimNumExt, false)%></LegacyClaimNumExt>
    <%}%>
    <% if (theclaim.CLEEExt.CodeExt != null) {%> 
    	<CLEECodeExt><%=StringUtils.getXMLValue(theclaim.CLEEExt.CodeExt, false)%></CLEECodeExt>
    <%}%>
    <% if (theclaim.CLEEExt.DescriptionOneExt != null) {%> 
    	<CLEEDescOneExt><%=StringUtils.getXMLValue(theclaim.CLEEExt.DescriptionOneExt, false)%></CLEEDescOneExt>
    <%}%>
    <% if (theclaim.CLEEExt.DescriptionTwoExt != null) {%> 
    	<CLEEDescTwoExt><%=StringUtils.getXMLValue(theclaim.CLEEExt.DescriptionTwoExt, false)%></CLEEDescTwoExt>
    <%}%>
    <% if (theclaim.CLEEExt.DescriptionThreeExt != null) {%> 
    	<CLEEDescThreeExt><%=StringUtils.getXMLValue(theclaim.CLEEExt.DescriptionThreeExt, false)%></CLEEDescThreeExt>
    <%}%>
    <% if (theclaim.CLEEExt.CLEELocationExt != null) {%> 
    	<CLEELocationExt><%=StringUtils.getXMLValue(theclaim.CLEEExt.CLEELocationExt, false)%></CLEELocationExt>
    <%}%>
    <% if (theclaim.CLEEExt.StartDateExt != null) {%> 
    	<CLEEStartDateExt><%=theclaim.CLEEExt.StartDateExt%></CLEEStartDateExt>
    <%}%>
    <% if (theclaim.CLEEExt.EndDateExt != null) {%> 
    	<CLEEEndDateExt><%=theclaim.CLEEExt.EndDateExt%></CLEEEndDateExt>
    <%}%>
    <%=YesNoTypeListTemplate.renderToString(theclaim.ControvertedExt, "ControvertedExt")%>      
    <% if (theclaim.Compensable != null) {%>
        <%=TypeListTemplate.renderToString(theclaim.Compensable, "CompensabilityDecision", theclaim.Compensable.ListName)%>
    <%}%>      
    <% if (theclaim.DateCompDcsnDue != null) {%>
      <DateCompDcsnDue><%=theclaim.DateCompDcsnDue%></DateCompDcsnDue> 
    <%}%>
    <%=StringParseTemplate.renderToString(theclaim.EmployerDetailExt, "EmployerDetailExt")%>
    <% if (theclaim.EmployerTypeExt != null) {%>
        <%=TypeListTemplate.renderToString(theclaim.EmployerTypeExt, "EmployerTypeExt", theclaim.EmployerTypeExt.ListName)%>
    <%}%> 
    <%-- kotteson Oct 5 2016 added test for aviation as special logic needed to properly send primarypilot data this field is populated but not to be sent for aviation --%>
    <% if (theclaim.LossType != null and theclaim.LossType.Code != "AVIATION") {%>
        <%=YesNoTypeListTemplate.renderToString(theclaim.EmpQusValidity, "EmpQusValidity")%>  
    <%}%>
    <% if (theclaim.DateFormGivenToEmp != null) {%>
      <EmpSentMPNNotice><%=theclaim.DateFormGivenToEmp%></EmpSentMPNNotice> 
    <%}%>
    <% if (theclaim.DateRptdToEmployer != null) {%>
      <DateRptdToEmployer><%=theclaim.DateRptdToEmployer%></DateRptdToEmployer>
    <%}%>      
    <% if (theclaim.FraudulentCodeExt != null) {%>
        <%=TypeListTemplate.renderToString(theclaim.FraudulentCodeExt, "FraudulentCodeExt", theclaim.FraudulentCodeExt.ListName)%>
    <%}%>
    <% if (theclaim.InsuredPremises != null) {%> 
      <InsuredPremises><%=theclaim.InsuredPremises%></InsuredPremises>
    <%}%>   
    <%=StringParseTemplate.renderToString(theclaim.JurisClaimNumberExt, "JurisClaimNumberExt")%>
    <%=StringParseTemplate.renderToString(theclaim.OWCPCaseNumberExt, "OWCPCaseNumberExt")%> 
     <% if (theclaim.EmploymentData != null and theclaim.EmploymentData.ScndInjryFnd != null) {%> 
      <ScndInjryFnd><%=theclaim.EmploymentData.ScndInjryFnd%></ScndInjryFnd>
    <%}%>
    <%=StringParseTemplate.renderToString(theclaim.WCCatastropheExt, "WCCatastropheExt")%>
     <% if (theclaim.SchedReviewDateExt != null) {%>
      <SchedReviewDateExt><%=theclaim.SchedReviewDateExt%></SchedReviewDateExt> 
    <%}%>  
    <% if (theclaim.LossDate != null) {%>
      <LossDateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.LossDate)%></LossDateTime> 
    
    <% if(theclaim.AirportCodeExt != null) {%>
      <%=StringParseTemplate.renderToString(theclaim.AirportCodeExt, "AirportCodeExt")%>  
    <%}%>  
    <% if(theclaim.EventHighestInjuryExt != null) {%>
      <%=TypeListTemplate.renderToString(theclaim.EventHighestInjuryExt, "EventHighestInjuryExt", theclaim.EventHighestInjuryExt.ListName)%>
    <%}%>
    <% if(theclaim.ReportStatusExt != null) {%>
      <%=TypeListTemplate.renderToString(theclaim.ReportStatusExt, "ReportStatusExt", theclaim.ReportStatusExt.ListName)%>
    <%}%>
    <% if(theclaim.PolicyFormExt != null) {%>
      <%=StringParseTemplate.renderToString(theclaim.PolicyFormExt, "PolicyFormExt")%>
    <%}%>
    <% if(theclaim.MAAccidentLocationExt != null) {%>
      <MAAccidentLocationExt><%=theclaim.MAAccidentLocationExt.DisplayName.substring(0,3)%></MAAccidentLocationExt>
    <%}%>
    <%}%>    
  </Claim>
</Transaction>