<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.SIUVendorsTemplate %>
<% uses templates.messaging.edw.SIUTravelsTemplate %>
<% uses templates.messaging.edw.PartyTemplate %>
<% uses templates.messaging.edw.LossLocationTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(thesiu : SIUInvestigationExt, objStatus : String) %>
<Transaction>
  <CCTransactionTime><%=util.custom_Ext.DateTime.getTimeStamp()%></CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(thesiu.LoadCommandID, thesiu.CreateUser, thesiu.UpdateUser))  {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>	
  <%if (thesiu.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=thesiu.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (thesiu.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=thesiu.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (thesiu.Claim.LossType != null) {%>
  <TransactionLossType><%=thesiu.Claim.LossType%></TransactionLossType>
  <%}%>
  <SpecialInvestigation>
    <PublicID><%=thesiu.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (thesiu.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thesiu.CreateTime)%></CreateTime> 
    <%}%>
    <% if (thesiu.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thesiu.UpdateTime)%></UpdateTime> 
    <%}%>
    <% if (thesiu.Claim != null && thesiu.Claim.PublicID != null) {%>
    <RelToClaim><%=thesiu.Claim.PublicID%></RelToClaim>
    <%}%>
    <% if (thesiu.ReferralDate != null) {%>
    <ReferralDate><%=thesiu.ReferralDate%></ReferralDate>
    <%}%> 
    <% if (thesiu.ReferralReason != null) {%>
    <ReferralReason><%=thesiu.ReferralReason%></ReferralReason> 
    <%}%>
    <% if (thesiu.SIUClaimType != null) {%>
    <%=TypeListTemplate.renderToString(thesiu.SIUClaimType, "SIUClaimType", thesiu.SIUClaimType.ListName)%>
    <%}%>
    <% if (thesiu.SIUReferralType != null) {%>
    <%=TypeListTemplate.renderToString(thesiu.SIUReferralType, "SIUReferralType", thesiu.SIUReferralType.ListName)%>
    <%}%>
    <% if (thesiu.SurvRequested != null) {%>
    <SurvRequested><%=StringUtils.getXMLValue(thesiu.SurvRequested as java.lang.String, false)%></SurvRequested>
    <%}%>
    <% if (thesiu.InvestigationStatus != null) {%>
    <%=TypeListTemplate.renderToString(thesiu.InvestigationStatus, "InvestigationStatus", thesiu.InvestigationStatus.ListName)%>
    <%}%>
    <% if (thesiu.SIUOpinion != null) {%>
    <%=TypeListTemplate.renderToString(thesiu.SIUOpinion, "SIUOpinion", thesiu.SIUOpinion.ListName)%>
    <%}%>
    <% if (thesiu.ClaimWithdrawn != null) {%>
    <ClaimWithdrawn><%=StringUtils.getXMLValue(thesiu.ClaimWithdrawn as java.lang.String, false)%></ClaimWithdrawn>
    <%}%>
    <% if (thesiu.DOIReferral != null) {%>
    <DOIReferral><%=StringUtils.getXMLValue(thesiu.DOIReferral as java.lang.String, false)%></DOIReferral>
    <%}%>
    <% if (thesiu.DOIReferralDate != null) {%>
    <DOIReferralDate><%=thesiu.DOIReferralDate%></DOIReferralDate> 
    <%}%>
    <% if (thesiu.DOIDisposition != null) {%>
    <%=TypeListTemplate.renderToString(thesiu.DOIDisposition, "DOIDisposition", thesiu.DOIDisposition.ListName)%>
    <%}%>
    <% if (thesiu.DOIAgencyLevel != null) {%>
    <%=TypeListTemplate.renderToString(thesiu.DOIAgencyLevel, "DOIAgencyLevel", thesiu.DOIAgencyLevel.ListName)%>
    <%}%>

    <%-- added SIUVendorExt --%>
    <% for (theitem in thesiu.getAddedArrayElements("SIUVendors")) {%>
    <%=SIUVendorsTemplate.renderToString(theitem as SIUVendorExt, "A")%>
    <%}%>
    <%-- removed SIUVendorExt --%>
    <% for (theitem in thesiu.getRemovedArrayElements("SIUVendors")) {%>
    <%=SIUVendorsTemplate.renderToString(theitem as SIUVendorExt, "D")%>
    <%}%>
    <%-- changed SIUVendorExt --%>
    <% for (theitem in thesiu.getChangedArrayElements("SIUVendors")) {%>
    <%=SIUVendorsTemplate.renderToString(theitem as SIUVendorExt, "C")%>
    <%}%>

    <%-- added SIUTravelInfos --%>
    <% for (thetravelitem in thesiu.getAddedArrayElements("SIUTravelInfos")) {%>
    <%=SIUTravelsTemplate.renderToString(thetravelitem as SIUTravelInfoExt, "A")%>
    <%}%>
    <%-- removed SIUTravelInfos --%>
    <% for (thetravelitem in thesiu.getRemovedArrayElements("SIUTravelInfos")) {%>
    <%=SIUTravelsTemplate.renderToString(thetravelitem as SIUTravelInfoExt, "D")%>
    <%}%>
    <%-- changed SIUTravelInfos --%>
    <%
    var isTravelInfoChanged : boolean = false;
    if (thesiu.isArrayElementChanged("SIUTravelInfos")) {
    isTravelInfoChanged = true;
    }
    %>
    <% if (isTravelInfoChanged) {
    for (thetravelitem in thesiu.getChangedArrayElements("SIUTravelInfos")) {%>
    <%=SIUTravelsTemplate.renderToString(thetravelitem as SIUTravelInfoExt, "D")%>
    <%}%>
    <%} else {%>
    <% for (travelinfo in thesiu.SIUTravelInfos) {
    if (travelinfo.TravelAddress.Changed && !travelinfo.TravelAddress.New) {%>
    <%=SIUTravelsTemplate.renderToString(travelinfo, "C")%>
    <%}%>
    <%}%>
    <%}%>

    <%var partyRelTo = "<PartyRelTo><PublicID>"+thesiu.PublicID+"</PublicID><RelToType>SpecialInvestigation</RelToType></PartyRelTo>"%>
    <Parties>
    <% if (thesiu.CreateUser != null) { %>
    <%=UserTemplate.renderToString(thesiu.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
    <%}%>
    <% if (thesiu.UpdateUser != null) { %>
    <%=UserTemplate.renderToString(thesiu.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
    <%}%>
    <% if (thesiu.SIUInvestigator != null) { %>
    <%var irole = "<Role><Code>investigator</Code><Description>Investigator</Description><ListName>ContactRole</ListName></Role>"%>
    <%=UserTemplate.renderToString(thesiu.SIUInvestigator, "", objStatus, irole, "", partyRelTo)%>
    <%}%>
    <% if (thesiu.SIUClaimant != null) { var theclaimant = thesiu.SIUClaimant;%>
    <%var clrole = "<Role><Code>claimant</Code><Description>Claimant</Description><ListName>ContactRole</ListName></Role>"%>
    <%=PartyTemplate.renderToString(theclaimant, "", objStatus, clrole, "", partyRelTo, thesiu.Claim, "", "")%>
    <%}%>
    <%var siurole = "<Role><Code>siursesearchsubject</Code><Description>SIU Service Subject</Description><ListName>ContactRole</ListName></Role>"%>
    <%var servicesdata : String = ""; %>
    
    <%  if (thesiu.DataResearchParties != null and thesiu.DataResearchParties.length > 0) {
             for (dataparties in thesiu.DataResearchParties) {
                 servicesdata = servicesdata + "<SIUServices>";
                 for (siudservs in dataparties.ResearchTypes) {
                    servicesdata = servicesdata + "<SIUService><ResearchTypeExt><Code>"+ siudservs.ResearchType.Code+"</Code><Description>"+siudservs.ResearchType.Description+"</Description><ListName>"+siudservs.ResearchType.ListName+"</ListName></ResearchTypeExt></SIUService>";
                 }
                 servicesdata = servicesdata + "</SIUServices>"; %>      
             <%=PartyTemplate.renderToString(dataparties.Contact, "", objStatus, siurole, "", partyRelTo, thesiu.Claim, "siusubj", servicesdata)%>
             <%servicesdata = ""; %>
             <%}%>
    <%}%>
    
    </Parties>
    <% if (thesiu.Claim.LossLocation != null) { var locationaddress = thesiu.Claim.LossLocation;%>
    <%var oStatus = objStatus%>
    <% if (objStatus == "D") {
    oStatus = "C"
    } %>
    <%=LossLocationTemplate.renderToString(locationaddress, oStatus, thesiu.Claim)%>
    <%}%>
    <% if (thesiu.OtherType != null) {%>
    <OtherType><%=thesiu.OtherType%></OtherType> 
    <%}%>
    <% if (thesiu.ClaimOrder != null) {%>
    <SIUNumber><%=thesiu.ClaimOrder%></SIUNumber> 
    <%}%>
    
    <%-- added SIU Open and Close Dates --%>
    <% if ((thesiu.SIUOpenDate != null) || (thesiu.SIUCloseDate != null)) {%>
      <SIUDates>
      <% if (thesiu.SIUOpenDate != null) {%>
        <SIUOpenDate><%=thesiu.SIUOpenDate%></SIUOpenDate> 
      <%}%>
      <% if (thesiu.SIUCloseDate != null) {%>
        <SIUCloseDate><%=thesiu.SIUCloseDate%></SIUCloseDate> 
      <%}%>
      <% if (thesiu.SIUReopened != null) {%>
        <SIUReopened><%=thesiu.SIUReopened%></SIUReopened> 
      <%}%>
      </SIUDates>
    <%}%>         
    
  </SpecialInvestigation>
</Transaction>