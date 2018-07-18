<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.ExposureOtherInsuranceTemplate %>
<% uses templates.messaging.edw.ExposurePartiesTemplate %>
<% uses templates.messaging.edw.ExposureCoverageTemplate %>
<% uses templates.messaging.edw.ExposureRiskHandler %>
<% uses templates.messaging.edw.ExposureTotalLossReportingTemplate %>
<% uses templates.messaging.edw.ExposureDamagePropertyDetailsTemplate %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.ExposureSIR %>
<% uses templates.messaging.edw.commons.YesNoTypeListTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>

<%@ params(exposure : Exposure, incidentStatus : String, objStatus : String, eventName : String) %>
<% var verified = exposure.Claim.Policy.Verified; %>
<% var theexposurecoverage = objStatus != "D" ? exposure.Coverage : exposure.PreviousCoverageExt.OriginalVersion as Coverage%>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (exposure.Claim.LossType.Code == "PERSONALAUTO" && exposure.Claim.ConvertedClaimIndExt && exposure.Claim.CreateTime.trimToMidnight() == exposure.CreateTime.trimToMidnight() && objStatus == "A") {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <%} else if (ConversionStatusChecker.isCurrentlyConverting(exposure.LoadCommandID, exposure.CreateUser, exposure.UpdateUser)) {%>
   <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
   <%} else {%>
   <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
   <%}%>
  <%if (exposure.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=exposure.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (exposure.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=exposure.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (exposure.Claim.LossType != null) {%>
  <TransactionLossType><%=exposure.Claim.LossType%></TransactionLossType>
  <%}%>
  <Exposure>
    <PublicID><%=exposure.PublicID%></PublicID>
    <% if (objStatus != "D") {%>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <%} else {%>
    <ObjectStatus>C</ObjectStatus>
    <%}%>
    <% if (exposure.RptCreateDateExt != null and exposure.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(exposure.LoadCommandID, exposure.CreateUser, exposure.UpdateUser)) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.RptCreateDateExt)%></CreateTime> 
    <%} else if (exposure.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.CreateTime)%></CreateTime> 
    <%}%>
    <% if (exposure.RptUpdateDateExt != null and exposure.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(exposure.LoadCommandID, exposure.CreateUser, exposure.UpdateUser)) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.RptUpdateDateExt)%></UpdateTime> 
    <%} else if (exposure.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.UpdateTime)%></UpdateTime> 
    <%}%>
    <% if (exposure.Claim.PublicID != null) {%>
    <RelToClaim><%=exposure.Claim.PublicID%></RelToClaim>
    <%}%>

    <% if (exposure.StatuteOfLimitationsExt != null) {%>
    <StatuteOfLimitationsExt><%=exposure.StatuteOfLimitationsExt%></StatuteOfLimitationsExt> 
    <%}%>
    <% if (exposure.ReservedFileExt != null) {%>
    <ReservedFileExt><%=exposure.ReservedFileExt%></ReservedFileExt> 
    <%}%>
    <% if (exposure.Incident != null && exposure.Incident.LossEstimate != null) {%>
    <LossEstimate><%=exposure.Incident.LossEstimate.Amount%></LossEstimate> 
    <%}%>
    <% if (exposure.TotalLossIndExt != null) {%>
    <TotalLossIndExt><%=exposure.TotalLossIndExt%></TotalLossIndExt> 
    <%}%>

    <% if (exposure.Claim.DeathDate != null) {%>
    <DeathDate><%=exposure.Claim.DeathDate%></DeathDate> 
    <%}%>
    <% if (exposure.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(exposure.LoadCommandID, exposure.CreateUser, exposure.UpdateUser) and exposure.HospitalDate != null) { %>
            <AssignmentDate><%=exposure.HospitalDate%></AssignmentDate>
     <% } else if (exposure.AssignmentDate != null) { %>
            <AssignmentDate><%=exposure.AssignmentDate%></AssignmentDate>   
    <%}%>
    <% if (exposure.SalvagePotentialExt != null) {%>
    <SalvagePotentialExt><%=exposure.SalvagePotentialExt%></SalvagePotentialExt> 
    <%}%>
    <% if (exposure.SubrogPotentialExt != null) {%>
    <SubrogPotentialExt><%=exposure.SubrogPotentialExt%></SubrogPotentialExt> 
    <%}%>
    <% if (exposure.CourseOfEmployExt != null) {%>
    <CourseOfEmployExt><%=exposure.CourseOfEmployExt%></CourseOfEmployExt> 
    <%}%>
    <% if (exposure.VehicleOperableExt != null) {%>
    <VehicleOperableExt><%=exposure.VehicleOperableExt%></VehicleOperableExt> 
    <%}%>

    <% if (exposure.TypeOfLossMostExt != null) {%>
    <%-- BESTOR 01-19-2009 - FIX FOR DEFECT 1443 --%>
    <% for (obj in exposure.getTOLValues()) {%>
    <% if (obj as java.lang.String == exposure.TypeOfLossMostExt) {%>
    <TypeOfLossMostExt>
      <Code><%=exposure.TypeOfLossMostExt%></Code>
      <Description><%=obj.toString()%></Description>
      <ListName><%=exposure.getTOLTypeList()%></ListName>
    </TypeOfLossMostExt> 
    <%}%>
    <%}%>
    <%}%>
    <% if (exposure.DateOfBirthExt != null) {%>
    <DateOfBirthExt><%=exposure.DateOfBirthExt%></DateOfBirthExt> 
    <%}%>
    <% if (exposure.ContribPotentialExt != null) {%>
    <ContribPotentialExt><%=exposure.ContribPotentialExt%></ContribPotentialExt> 
    <%}%>

    <% if (exposure.ex_InSuit != null) {%>	        
    <ex_InSuit><%=exposure.ex_InSuit%></ex_InSuit>
    <%}%>
    <%-- JHARNING 03042009 : FIX FOR DEFECT 3066 - only truncate order number for converted claims --%>
    <%-- DEFECT 6812 mbendure - added a check to ClaimNumber to see if it starts with 750 and is thus a converted Equine claim --%>
    <% if (exposure.Claim.LoadCommandID != null and exposure.Claim.ClaimNumber.startsWith("750")) {%>
    <ClaimOrder><%=exposure.ClaimOrder % 10%></ClaimOrder>
    <%} else {%>
    <ClaimOrder><%=exposure.ClaimOrder%></ClaimOrder>
    <%}%>            

    <% if (exposure.LossAppToExt != null) {%>
    <%=TypeListTemplate.renderToString(exposure.LossAppToExt, "LossAppToExt", exposure.LossAppToExt.ListName)%>
    <%}%>
    <% if (exposure.SublimitsExt != null) {%>	 
    <%=TypeListTemplate.renderToString(exposure.SublimitsExt, "SublimitsExt", exposure.SublimitsExt.ListName)%>
    <%}%>
    <% if (exposure.MethodVerifyDamagesExt != null) {%>	 
    <%=TypeListTemplate.renderToString(exposure.MethodVerifyDamagesExt, "MethodVerifyDamagesExt", exposure.MethodVerifyDamagesExt.ListName)%>
    <%}%>
    <% if (exposure.BasisOfPayExt != null) {%>	 
    <%=TypeListTemplate.renderToString(exposure.BasisOfPayExt, "BasisOfPayExt", exposure.BasisOfPayExt.ListName)%>
    <%}%>
    <% if (exposure.ExposureDetailsExt != null) {%>	 
    <%=TypeListTemplate.renderToString(exposure.ExposureDetailsExt, "ExposureDetailsExt", exposure.ExposureDetailsExt.ListName)%>
    <%}%>
    <% if (exposure.ExposureType != null) {%>
       <% if (exposure.Claim.LossType.Code != "PERSONALAUTO" and exposure.Claim.LossType.Code != "AVIATION"){%>
       <%=TypeListTemplate.renderToString(exposure.ExposureType, "ExposureType", exposure.ExposureType.ListName)%>
       <%} else {%>
       <%var expsuretype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "ExposureType", "EDWFeatureType", exposure.ExposureType.Code);%>
       <% if (expsuretype != null){%>
    <ExposureType>
      <Code><%=expsuretype%></Code>
      <Description><%=expsuretype%></Description>
      <ListName><%=exposure.ExposureType.ListName%></ListName>
    </ExposureType>
       <%}%>
       <%}%>
    <%}%>
    <% if (exposure.LossParty != null) {%>
    <%=TypeListTemplate.renderToString(exposure.LossParty, "LossParty", exposure.LossParty.ListName)%>
    <%}%>

    <% if (exposure.State != null) {%>
    <% if (incidentStatus == "open") {%>
    <StaffingStatus>
      <Code>open</Code>
      <Description>Open</Description>
      <ListName><%=StringUtils.getXMLValue(exposure.State.ListName, false)%></ListName>
    </StaffingStatus>
    <%} else {%>
    <%=TypeListTemplate.renderToString(exposure.State, "StaffingStatus", exposure.State.ListName)%>
    <%}%>
    <%}%>

    <% if (incidentStatus != "open" && exposure.ClosedOutcome != null) {%>
    <%=TypeListTemplate.renderToString(exposure.ClosedOutcome, "ClosedOutcome", exposure.ClosedOutcome.ListName)%>
    <%}%> 
    <% if (exposure.MethodOfSettlementExt != null) {%>	 
    <%=TypeListTemplate.renderToString(exposure.MethodOfSettlementExt, "MethodOfSettlementExt", exposure.MethodOfSettlementExt.ListName)%>
    <%}%> 
    <% if (exposure.JurisdictionState != null) {%>
    <JurisdictionState>
      <Code><%=exposure.JurisdictionState.Code%></Code>
      <Description><%=exposure.JurisdictionState.Description%></Description>
      <ListName><%=exposure.JurisdictionState.ListName%></ListName>
      <AddressType>
        <Code>jurisdictionstate</Code>
        <Description>Jurisdiction State</Description>
        <ListName>Jurisdiction State</ListName>
      </AddressType>
    </JurisdictionState>
    <%}%>
    <% if (exposure.ReopenedReason != null) {%>
    <%=TypeListTemplate.renderToString(exposure.ReopenedReason, "ReOpenedReason", exposure.ReopenedReason.ListName)%>
    <%}%> 
    <% if (exposure.LossDueToExt != null) {%>
    <%=TypeListTemplate.renderToString(exposure.LossDueToExt, "ex_LossDueTo", exposure.LossDueToExt.ListName)%>
    <%}%>
    <% if (exposure.LossLocationExt != null) {%>
    <%=TypeListTemplate.renderToString(exposure.LossLocationExt, "ex_LossLocation", exposure.LossLocationExt.ListName)%>
    <%}%>
    <% if (exposure.Incident.Description != null) {%>
    <DamageDescription><%=StringUtils.getXMLValue(exposure.Incident.Description, false)%></DamageDescription>
    <%}%>
    <% if (!verified) {%>
    <% if (theexposurecoverage != null && theexposurecoverage.ClassCodeExt != null) {%>
    <ClassCodeExt>
      <Code><%=theexposurecoverage.ClassCodeExt%></Code> 
      <Description><%=theexposurecoverage.ClassCodeExt%></Description> 
      <ListName>ClassCodeExt</ListName>
    </ClassCodeExt>
    <%}%>
    <%} else if (objStatus == "D") {%> 
    <% if (theexposurecoverage != null && theexposurecoverage.ClassCodeExt != null) {%>
    <ClassCodeExt>
      <Code><%=theexposurecoverage.ClassCodeExt%></Code> 
      <Description><%=theexposurecoverage.ClassCodeExt%></Description> 
      <ListName>ClassCodeExt</ListName>
    </ClassCodeExt>
    <%}%>
    <%} else {%> 	
    <% if (theexposurecoverage != null && (theexposurecoverage.Policy.PolicyType.Code == PolicyType.TC_AMP or theexposurecoverage.Policy.PolicyType.Code == PolicyType.TC_AMO)) {%>
    <ClassCodeExt>
      <Code>953</Code>
      <Description>953</Description>
      <ListName>ClassCodeExt</ListName>
    </ClassCodeExt>
    <%}%> 	
    <%}%> 

    <% if (exposure.ReciprocatePIPExt != null) {%>
    <ReciprocatePIPExt><%=exposure.ReciprocatePIPExt%></ReciprocatePIPExt>
    <%}%>

    <%=ExposureOtherInsuranceTemplate.renderToString(exposure, (objStatus == "D" ?  "C" : objStatus))%>

    <%=ExposurePartiesTemplate.renderToString(exposure, (objStatus == "D" ? "C" : objStatus))%>

    <%=ExposureCoverageTemplate.renderToString(exposure, theexposurecoverage, verified, objStatus)%>

    <% if (theexposurecoverage != null) {%>
    <%
    var typeCode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getInternalCodeByAlias( "EDWRiskType", "CoverageRisk", theexposurecoverage.Type.Code);
    var riskCat = "<RiskCat><Code>"+typeCode+"</Code><Description>"+typeCode+"</Description><ListName>EDWRiskType</ListName></RiskCat>";
    var riskTemplateData = ExposureRiskHandler.renderToString(exposure, verified, typeCode, riskCat, objStatus)
    %>
    <% if (org.apache.commons.lang.StringUtils.deleteSpaces(riskTemplateData) != "") {%>
    <Risks>
      <%=riskTemplateData%>
    </Risks>
    <%}%>
    <%}%>

    <% if (exposure.PropertyIncident != null && exposure.PropertyIncident.PropertyDesc != null) {%>
    <PropertyDesc><%=exposure.PropertyIncident.PropertyDesc%></PropertyDesc>
    <%}%>
    <%-- BESTOR 20100818 - Defect 3514: Alleged Injury Text --%>
    <% if (exposure.Incident != null && exposure.Incident.Description != null && !exposure.ExposureType.hasCategory( ExposureCategoryType.TC_PROPERTY ) ) {%>
    <DamagedPropertyDesc><%=exposure.Incident.Description%></DamagedPropertyDesc>
    <%} else if (exposure.InjuryNatureDescExt != null && exposure.ExposureType.hasCategory( ExposureCategoryType.TC_PROPERTY ) ) {%>
    <DamagedPropertyDesc><%=StringUtils.getXMLValue(exposure.InjuryNatureDescExt,false)%></DamagedPropertyDesc>
    <%}%>
    <%-- BESTOR 20100903 - Added <ExposureCategoryType>, related to defect #3514 --%>
    <% if (exposure.ExposureType.hasCategory( ExposureCategoryType.TC_LIABILITY )) {%>
    <%=TypeListTemplate.renderToString(ExposureCategoryType.TC_LIABILITY, "ExposureCategoryType", ExposureCategoryType.TC_LIABILITY.ListName)%>
    <%} else if (exposure.ExposureType.hasCategory( ExposureCategoryType.TC_PROPERTY )) {%>
    <%=TypeListTemplate.renderToString(ExposureCategoryType.TC_PROPERTY, "ExposureCategoryType", ExposureCategoryType.TC_PROPERTY.ListName)%>
    <%} else if (exposure.ExposureType.hasCategory( ExposureCategoryType.TC_PIP )) {%>
    <%=TypeListTemplate.renderToString(ExposureCategoryType.TC_PIP, "ExposureCategoryType", ExposureCategoryType.TC_PIP.ListName)%>
    <%}%>
    <%-- bestor 20101014: defect 2557 - Total Loss Reporting --%>
    <%=ExposureTotalLossReportingTemplate.renderToString(exposure)%>
    <%-- bestor 20101020: PIM related changes --%>
    <%-- kOtteson 20160414: def 8545  Only execute for PIM features --%>
    <% if (exposure.ExposureType == ExposureType.TC_IM_BUILDING OR exposure.ExposureType == ExposureType.TC_IM_BUSINESSINC OR
        exposure.ExposureType == ExposureType.TC_IM_PERSONALPROP OR exposure.ExposureType == ExposureType.TC_IM_CONTRACTEQUIP OR
        exposure.ExposureType == ExposureType.TC_IM_PROPOFOTHERS OR exposure.ExposureType == ExposureType.TC_IM_EQUIPBRKDWN) { %>
          <%=ExposureDamagePropertyDetailsTemplate.renderToString(exposure)%>      
    <% }%>

    <%-- kotteson 20110113: defect 3765 - lost property type --%>
    <%-- kOtteson 20160414: def 8545  Move test for lost property type to after damagepropertydetails template --%>
    <% if (exposure.LostPropertyType != null) {%>	 
    <LostPropertyType>
      <Code><%=exposure.LostPropertyType.Code%></Code>
      <Description><%=exposure.LostPropertyType.Description%></Description>
      <ListName><%=exposure.LostPropertyType.ListName%></ListName>
    </LostPropertyType>
    <%}%>
    <% if (exposure.LegalExpenseExt != null) {%>
    <LegalExpenseExt><%=exposure.LegalExpenseExt%></LegalExpenseExt>
    <%}%>
    <% if (exposure.NoLegalExpenseTypeExt != null) {%>
    <%=TypeListTemplate.renderToString(exposure.NoLegalExpenseTypeExt, "NoLegalExpenseTypeExt", exposure.NoLegalExpenseTypeExt.ListName)%>
    <%}%>
    <% if (exposure.ExposureDeductibleExt != null && exposure.ExposureDeductibleExt.Deductible != null) {%>
    <ExposureDeductibleAmt><%=exposure.ExposureDeductibleExt.Deductible%></ExposureDeductibleAmt>
    <%}%>
    <% if (exposure.ExposureDeductibleExt != null && exposure.ExposureDeductibleExt.DeductLimitAppExt != null) {%>
    <ExposureDeductibleText><%=exposure.ExposureDeductibleExt.DeductLimitAppExt.Description%></ExposureDeductibleText>
    <%}%>
    <% if (exposure.GlassOnlyClaimIndExt != null) {%>
    <GlassOnlyClaimIndExt><%=exposure.GlassOnlyClaimIndExt%></GlassOnlyClaimIndExt>
    <%}%>
    <% if (exposure.BodyShopPaymentIndExt != null) {%>
    <BodyShopPaymentIndExt><%=exposure.BodyShopPaymentIndExt%></BodyShopPaymentIndExt>
    <%}%>
    <% if (exposure.TotalDamageIndExt != null) {%>
    <TotalDamageIndExt><%=exposure.TotalDamageIndExt%></TotalDamageIndExt>
    <%}%>
    <% if (exposure.ReinspectedIndExt != null) {%>
    <ReinspectedIndExt><%=exposure.ReinspectedIndExt%></ReinspectedIndExt>
    <%}%>
    <% if (exposure.ReinspectionresultExt != null) {%>
      <ReinspectionResultExt>
        <Code><%=exposure.ReinspectionresultExt.Code%></Code> 
        <Description><%=exposure.ReinspectionresultExt.Description%></Description> 
        <ListName>ReinspectionResults</ListName>
      </ReinspectionResultExt>
    <%}%>
    <% if (exposure.MedicareExposureExt != null) {%>
    <MedicareExposureExt><%=exposure.MedicareExposureExt%></MedicareExposureExt>
    <%}%>
    <% if (exposure.JurisdictionCountryExt != null) {%>
         <JurisdictionCountry>
           <Code><%=exposure.JurisdictionCountryExt.Code%></Code>
           <Description><%=exposure.JurisdictionCountryExt.Description%></Description>
           <ListName><%=exposure.JurisdictionCountryExt.ListName%></ListName>
           <AddressType>
             <Code>jurisdictioncountry</Code>
             <Description>Jurisdiction Country</Description>
             <ListName>Jurisdiction Country</ListName>
           </AddressType>
         </JurisdictionCountry>
    <%}%>
    <% if (exposure.DeductibleExistsExt != null) {%>
         <DeductibleExistsExt><%=exposure.DeductibleExistsExt%></DeductibleExistsExt>
    <%}%>
    <% if (exposure.AppliesToCertAggLimitExt != null) {%>
         <AppliesToCertAggLimitExt><%=exposure.AppliesToCertAggLimitExt%></AppliesToCertAggLimitExt>
    <%}%>    
    
    <% if (exposure.ExposureDetails2Ext != null) {%>	 
      <%=TypeListTemplate.renderToString(exposure.ExposureDetails2Ext, "ExposureDetails2Ext", exposure.ExposureDetails2Ext.ListName)%>
    <%}%>
        
    <% if (exposure.SIRsExt != null) { %>
      <% if ((exposure.SIRsExt.SIRInvoicesExt.size > 0) or (exposure.SIRsExt.getRemovedArrayElements("SIRInvoicesExt").size > 0) ) { %>
        <Invoices>
          <% for(invoice in exposure.SIRsExt.SIRInvoicesExt) { %>
            <Invoice>
              <%=ExposureSIR.renderToString(invoice, objStatus, exposure)%>
            </Invoice>
          <% } %>
          <% for(deletedInvoice in exposure.SIRsExt.getRemovedArrayElements("SIRInvoicesExt")) { %>
             <Invoice>
              <%=ExposureSIR.renderToString(deletedInvoice as SIRInvoiceExt,"D", exposure)%>
            </Invoice>
          <% } %>           
        </Invoices>
       <% } %> 
    <% } %>
    <% if(exposure.SettleMethod != null) { %>
        <%=TypeListTemplate.renderToString(exposure.SettleMethod, "SettleMethod", exposure.SettleMethod.ListName)%>
    <%}%>       
    
    <% if(exposure.FuneralAmountExt != null) { %>
        <FuneralAmountExt><%=exposure.FuneralAmountExt%></FuneralAmountExt>
    <%}%>         
    <% if(exposure.VocRehabLimitAmtExt != null) { %>
        <VocRehabLimitAmtExt><%=exposure.VocRehabLimitAmtExt%></VocRehabLimitAmtExt>
    <%}%>         
    <% if(exposure.VocRehabLimitWeeksExt != null) { %>
        <VocRehabLimitWeeksExt><%=exposure.VocRehabLimitWeeksExt%></VocRehabLimitWeeksExt>
    <%}%>    
    <% if(exposure.RemarriagePaymentExt != null) { %>
        <RemarriagePaymentExt><%=exposure.RemarriagePaymentExt%></RemarriagePaymentExt>
    <%}%>    
    <% if (exposure.MedTreatmentsPrescribedExt != null and exposure.MedTreatmentsPrescribedExt.length > 0) {%>
      <MedTreatments>
        <% for (treatment in exposure.MedTreatmentsPrescribedExt) {  %>
              <MedTreatment>
                <%if (treatment.RefServiceProviderExt != null) {%>
                    <RefServiceProviderExt><%=treatment.RefServiceProviderExt%></RefServiceProviderExt> 
                <%}%>
                <%if (treatment.RefServiceProvTaxIDExt != null) {%>
                    <RefServiceProvTaxIDExt><%=treatment.RefServiceProvTaxIDExt%></RefServiceProvTaxIDExt> 
                <%}%>
                <%if (treatment.RendServiceProviderExt != null) {%>
                    <RendServiceProviderExt><%=treatment.RendServiceProviderExt%></RendServiceProviderExt> 
                <%}%>
                <%if (treatment.RendServiceProvTaxIDExt != null) {%>
                    <RendServiceProvTaxIDExt><%=treatment.RendServiceProvTaxIDExt%></RendServiceProvTaxIDExt> 
                <%}%> 
                <%if (treatment.NDCNumExt != null) {%>
                    <NDCNumExt><%=treatment.NDCNumExt%></NDCNumExt> 
                <%}%>
                <%if (treatment.PrescriptionNumExt != null) {%>
                    <PrescriptionNumExt><%=treatment.PrescriptionNumExt%></PrescriptionNumExt> 
                <%}%>
                <%if (treatment.PrescriberIDExt != null) {%>
                    <PrescriberIDExt><%=treatment.PrescriberIDExt%></PrescriberIDExt> 
                <%}%>
                <%if (treatment.DescriptionExt != null) {%>
                    <DescriptionExt><%=treatment.DescriptionExt%></DescriptionExt> 
                <%}%>
                <%if (treatment.DaysSupplyExt != null) {%>
                    <DaysSupplyExt><%=treatment.DaysSupplyExt%></DaysSupplyExt> 
                <%}%>
              </MedTreatment>
        <%}%>
      </MedTreatments>
    <%}%>
    <% if (exposure.CarSeatExt != null) {%>
        <CarSeatExt><%=exposure.CarSeatExt%></CarSeatExt>
    <%}%>                   
  </Exposure>
</Transaction>