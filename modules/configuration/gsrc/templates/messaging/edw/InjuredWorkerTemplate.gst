<% uses templates.messaging.edw.commons.YesNoTypeListTemplate %>
<% uses templates.messaging.edw.commons.StringParseTemplate %>
<% uses templates.messaging.edw.commons.BitTemplate %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses util.StringUtils%>
<% uses util.WCHelper %>

<%@ params(theclaim : Claim, exp : Exposure) %>
<%  var medexposure : Exposure
    var indemexposure : Exposure %>

<% if(theclaim.Exposures.HasElements){

  var mexposures = theclaim.Exposures.where(\ m -> m.ExposureType == "wc_medical_details" )
  medexposure = mexposures.first();

  var iexposures = theclaim.Exposures.where(\ i -> i.ExposureType == "wc_indemnity_timeloss" )
  indemexposure = iexposures.first();
%>

 <InjuredWorker>
  <INJWFeatures>
   <%for(ex in theclaim.Exposures){%>
     <INJWFeature> 
       <FeaturePublicID><%=ex.PublicID%></FeaturePublicID>
       <% if (ex.New) { %>
         <FeatureAttribute>new</FeatureAttribute>
       <% }  %>
       <INJWFeatureRole><Role><Code>claimant</Code><Description>Claimant</Description><ListName>ContactRole</ListName></Role></INJWFeatureRole>
     </INJWFeature>
   <%}%>
  </INJWFeatures>
  <%=YesNoTypeListTemplate.renderToString(theclaim.ApportionmentExt, "ApportionmentExt")%> 
  <% if (theclaim.ApportionmentPctExt != null) {%>
    <ApportionmentPctExt><%=theclaim.ApportionmentPctExt%></ApportionmentPctExt> 
  <%}%>  
  <%=YesNoTypeListTemplate.renderToString(theclaim.DrugTestExt, "DrugTestExt")%> 
  <% if (theclaim.DrugTestResultExt != null) {%>
    <%=TypeListTemplate.renderToString(theclaim.DrugTestResultExt, "DrugTestResultExt", theclaim.DrugTestResultExt.ListName)%>
  <%}%>
  <%=StringParseTemplate.renderToString(theclaim.EquipmentUsed, "EquipmentUsed")%> 
  <% if (theclaim.EmploymentInjury != null) {%>
    <EmploymentInjury><%=theclaim.EmploymentInjury%></EmploymentInjury>
  <%}%>
  <% if (theclaim.SafetyEquipProv != null) {%>
    <SafetyEquipProv><%=theclaim.SafetyEquipProv%></SafetyEquipProv>
  <%}%>  
  <% if (theclaim.SafetyEquipUsed != null) {%>
    <SafetyEquipUsed><%=theclaim.SafetyEquipUsed%></SafetyEquipUsed>
  <%}%>
  <% if (theclaim.SafetyViolationExt != null) {%>
    <SafetyViolationExt><%=theclaim.SafetyViolationExt%></SafetyViolationExt>
  <%}%>    
  <%=StringParseTemplate.renderToString(theclaim.ActivityPerformed, "ActivityPerformed")%> 
  <%=YesNoTypeListTemplate.renderToString(theclaim.ConcurrentEmp, "ConcurrentEmp")%> 

  <% if (theclaim.EmploymentData != null) {%> 
    <% if (theclaim.EmploymentData.FirstFullDayMissedExt != null) {%>
      <FirstFullDayMissedExt><%=theclaim.EmploymentData.FirstFullDayMissedExt%></FirstFullDayMissedExt>
    <%}%>    
    <% if (theclaim.EmploymentData.PaidFull != null) {%>
      <PaidFull><%=theclaim.EmploymentData.PaidFull%></PaidFull>
    <%}%>  
    <% if (theclaim.EmploymentData.EmploymentStatus != null) {%>
      <%=TypeListTemplate.renderToString(theclaim.EmploymentData.EmploymentStatus, "EmploymentStatus", theclaim.EmploymentData.EmploymentStatus.ListName)%>
    <%}%>
    <% if (theclaim.EmploymentData.EmployStatusDateExt != null) {%>
      <EmployStatusDateExt><%=theclaim.EmploymentData.EmployStatusDateExt%></EmployStatusDateExt>
    <%}%>
    <% if (theclaim.EmploymentData.WageAmount != null) {%>
      <WageAmount><%=theclaim.EmploymentData.WageAmount.Amount%></WageAmount>
    <%}%>
    <% if (theclaim.EmploymentData.WageAmountPostInjury != null) {%>
      <WageAmountPostInjury><%=theclaim.EmploymentData.WageAmountPostInjury.Amount%></WageAmountPostInjury>
    <%}%>
    <% if (theclaim.EmploymentData.WageAmountPreInjuryExt != null) {%>
      <WageAmountPreInjuryExt><%=theclaim.EmploymentData.WageAmountPreInjuryExt%></WageAmountPreInjuryExt>
    <%}%>
    <% if (theclaim.EmploymentData.WagePaymentCont != null) {%>
      <WagePaymentCont><%=theclaim.EmploymentData.WagePaymentCont%></WagePaymentCont>
    <%}%>    
    <% if (theclaim.EmploymentData.NoWorkFullDayAfterExt != null) {%>
      <NoWorkFullDayAfterExt><%=theclaim.EmploymentData.NoWorkFullDayAfterExt%></NoWorkFullDayAfterExt>
    <%}%>
    <% if (theclaim.EmploymentData.PhysRestrictionsExt != null) {%>
      <PhysRestrictionsExt><%=theclaim.EmploymentData.PhysRestrictionsExt%></PhysRestrictionsExt>
    <%}%>
  <%}%>
  
  <% if(indemexposure != null and indemexposure.WeeklyWageDeterminExt != null) { %>
     <%=TypeListTemplate.renderToString(indemexposure.WeeklyWageDeterminExt, "WeeklyWageDeterminExt", indemexposure.WeeklyWageDeterminExt.ListName)%>
  <%}%>
  <% if (theclaim.InjuredWorker != null and theclaim.InjuredWorker.DisciplinaryActionExt != null) {%>
    <%=BitTemplate.renderToString(theclaim.InjuredWorker.DisciplinaryActionExt, "DisciplinaryActionExt")%>
  <%}%>  
  <% if (theclaim.LossDate != null and theclaim.InjuredWorker != null and theclaim.InjuredWorker.DateOfBirth !=null) {%>
     <AgeAtInjuryOrIllness><%= util.WCHelper.ageAtInjury(theclaim)%></AgeAtInjuryOrIllness>
  <%}%>          
  <% if (theclaim.ExposureBegan != null) {%>
    <ExposureBegan><%=theclaim.ExposureBegan%></ExposureBegan>
  <%}%>
  <% if (theclaim.ExposureEnded != null) {%>
    <ExposureEnded><%=theclaim.ExposureEnded%></ExposureEnded>
  <%}%>
  <% if (theclaim.ExposureInjuryExt != null) {%>
    <ExposureInjuryExt><%=theclaim.ExposureInjuryExt%></ExposureInjuryExt>
  <%}%>
  <%=BitTemplate.renderToString(theclaim.DeathReport, "DeathReport")%>
  
  <% if (theclaim.OtherBenefits != null && theclaim.OtherBenefits.length > 0) {%>
    <OtherBenefits>
      <% for (othbenefit in theclaim.OtherBenefits) {%>
        <OtherBenefit>
          <% if (othbenefit.ReferenceNumber != null) {%>
            <OtherBenefitsRefNum><%=StringUtils.getXMLValue(othbenefit.ReferenceNumber, false)%></OtherBenefitsRefNum>
          <%}%>
        </OtherBenefit>
      <%}%>
    </OtherBenefits>
  <%}%>
  
  <% if (theclaim.HospitalDays != null) {%>
    <HospitalDays><%=theclaim.HospitalDays%></HospitalDays>
  <%}%>
  <% if (theclaim.HospitalDate != null) {%>
    <HospitalDate><%=theclaim.HospitalDate%></HospitalDate>
  <%}%>
  <%=BitTemplate.renderToString(theclaim.EmergencyRoomTxExt, "EmergencyRoomTxExt")%>
  <% if (theclaim.ExaminationDate != null) {%>
    <ExaminationDate><%=theclaim.ExaminationDate%></ExaminationDate>
  <%}%>
  <% if (theclaim.TreatmentTypeExt != null ) {%>
      <%=TypeListTemplate.renderToString(theclaim.TreatmentTypeExt, "MedicalTreatmentType", theclaim.TreatmentTypeExt.ListName)%>
  <%}%>  
  <%=BitTemplate.renderToString(theclaim.HospitalOvernightExt, "HospitalOvernightExt")%>
  
  <% if (theclaim.EmploymentData != null and theclaim.EmploymentData.WorkStatusChanges != null && theclaim.EmploymentData.WorkStatusChanges.length > 0) {%>
    <WorkStatuses>
      <% for (workstatus in theclaim.EmploymentData.WorkStatusChanges) {%>
      <WorkStatus>
        <% if (workstatus.StatusDate != null) {%>
          <WorkStatusStartDate><%=workstatus.StatusDate%></WorkStatusStartDate>
        <%}%>
        <% if (workstatus.StatusEndDate != null) {%>
          <WorkStatusEndDate><%=workstatus.StatusEndDate%></WorkStatusEndDate>
        <%}%>
        <% if (workstatus.NumHoursWorked != null) {%>
          <NumHoursWorked><%=workstatus.NumHoursWorked%></NumHoursWorked>
        <%}%>
        <% if (workstatus.LastWorkedDate != null) {%>
          <LastWorkedDate><%=workstatus.LastWorkedDate%></LastWorkedDate>
        <%}%>
        <%=BitTemplate.renderToString(workstatus.PaidFullForLastWorked, "PaidFullForLastWorked")%>
        <% if (workstatus.Status != null) {%>
           <%=TypeListTemplate.renderToString(workstatus.Status, "WorkCapacity", workstatus.Status.ListName)%>
        <%}%>
        <% if (workstatus.WageAmountPostInjury != null) {%>
          <WageAmountPostInj><%=workstatus.WageAmountPostInjury.Amount%></WageAmountPostInj>
        <%}%>
      </WorkStatus>
      <%}%>
    </WorkStatuses>
  <%}%>
  <% if (indemexposure.ReturnToWorkDateExt != null) {%>
    <ReturnToWorkDateExt><%=indemexposure.ReturnToWorkDateExt%></ReturnToWorkDateExt>
  <%}%>
  <%=BitTemplate.renderToString(indemexposure.ReturnToWorkValidExt, "ReturnToWorkValidExt")%>
  <%=BitTemplate.renderToString(theclaim.ModifiedDutyAvail, "ModifiedDutyAvail")%>
  <%=BitTemplate.renderToString(indemexposure.ReturnToModWorkValidExt, "ReturnToModWorkValidExt")%>
  <% if (indemexposure.ReturnToModWorkDateExt != null) {%>
    <ReturnToModWorkDateExt><%=indemexposure.ReturnToModWorkDateExt%></ReturnToModWorkDateExt>
  <%}%>
  <% if (indemexposure.ReturnToModWorkActualExt != null) {%>
      <ReturnToModWorkActualExt>
        <Code><%=(indemexposure.ReturnToModWorkActualExt == true) ? "ACTUAL" : "PROJECTED"%></Code>
        <Description><%=(indemexposure.ReturnToModWorkActualExt == true) ? "ACTUAL" : "PROJECTED"%></Description>
        <ListName>ReturnToDutyType</ListName>
      </ReturnToModWorkActualExt>
  <%}%>
  <% if (indemexposure.ReturnToWorkActualExt != null) {%>
      <ReturnToWorkActualExt>
        <Code><%=(indemexposure.ReturnToWorkActualExt == true) ? "ACTUAL" : "PROJECTED"%></Code>
        <Description><%=(indemexposure.ReturnToWorkActualExt == true) ? "ACTUAL" : "PROJECTED"%></Description>
        <ListName>ReturnToDutyType</ListName>
      </ReturnToWorkActualExt>
  <%}%>       
  <% if (indemexposure.WageStmtRecd != null) {%>
    <WageStmtRecd><%=indemexposure.WageStmtRecd%></WageStmtRecd>
  <%}%>
  <% if (indemexposure.WageStmtSent != null) {%>
    <WageStmtSent><%=indemexposure.WageStmtSent%></WageStmtSent>
  <%}%>
  <% if (theclaim.ClaimWorkComp.WaitingPeriodApplied !=null or (theclaim.ClaimWorkComp.WaitingPeriodDetails != null && theclaim.ClaimWorkComp.WaitingPeriodDetails.length > 0)) {%>
    <WaitingPeriods>
      <% if (theclaim.ClaimWorkComp.WaitingPeriodApplied !=null) {%>
          <WaitingPeriodApplied><%=theclaim.ClaimWorkComp.WaitingPeriodApplied%></WaitingPeriodApplied>
      <%}%>
      <% for (waitingper in theclaim.ClaimWorkComp.WaitingPeriodDetails) {%>
      <WaitingPeriod>
        <% if (waitingper.DateStarted != null) {%>
          <WaitingDateStarted><%=waitingper.DateStarted%></WaitingDateStarted>
        <%}%>
        <% if (waitingper.DateEnded != null) {%>
          <WaitingDateEnded><%=waitingper.DateEnded%></WaitingDateEnded>
        <%}%>
        <% if (waitingper.WaitingDaysRepaid != null) {%>
          <WaitingDaysRepaid><%=waitingper.WaitingDaysRepaid%></WaitingDaysRepaid>
        <%}%>
        <% if (waitingper.WaitingDaysApplied != null) {%>
          <WaitingDaysApplied><%=waitingper.WaitingDaysApplied%></WaitingDaysApplied>
        <%}%>
      </WaitingPeriod>
      <%}%>
    </WaitingPeriods>
  <%}%>
  <% if (medexposure.MMIDateExt != null) {%>
    <MMIDateExt><%=medexposure.MMIDateExt%></MMIDateExt>
  <%}%>

</InjuredWorker>
<%}%>