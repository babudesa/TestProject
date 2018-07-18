<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PersonMedicareTemplate %>
<% uses templates.messaging.edw.commons.YesNoTypeListTemplate %>
<% uses templates.messaging.edw.commons.StringParseTemplate %>
<% uses templates.messaging.edw.InjuredWorkerTemplate %>
<%@ params(person : Person, claim : Claim, exp : Exposure, persontype : String,  objStatus : String) %>
<Person>
  <PublicID><%=person.PublicID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <% if (person.LastName != null) {%>
  <LastName><%=StringUtils.getXMLValue(person.LastName, false)%></LastName>
  <%}%>
  <% if (person.FirstName != null) {%>
  <FirstName><%=StringUtils.getXMLValue(person.FirstName, false)%></FirstName>
  <%}%>
  <% if (person.MiddleName != null) {%>
  <MiddleName><%=StringUtils.getXMLValue(person.MiddleName, false)%></MiddleName>
  <%}%>
  <% if (person.Prefix != null) {%>
  <%=TypeListTemplate.renderToString(person.Prefix, "Prefix", person.Prefix.ListName)%>
  <%}%>
  <% if (person.Suffix != null) {%>
  <%=TypeListTemplate.renderToString(person.Suffix, "Suffix", person.Suffix.ListName)%>
  <%}%>
  <% if (person.DateOfBirth != null) {%>	        
  <DateOfBirth><%=person.DateOfBirth%></DateOfBirth>
  <%}%>
  <% if (person.Gender != null) {%>
  <%=TypeListTemplate.renderToString(person.Gender, "Gender", person.Gender.ListName)%>
  <%}%>
  <% if (person.MaritalStatus != null) {%>
  <%=TypeListTemplate.renderToString(person.MaritalStatus, "MaritalStatus", person.MaritalStatus.ListName)%>
  <%}%>
  <% if (person.FormerName != null) {%>
  <FormerName><%=StringUtils.getXMLValue(person.FormerName, false)%></FormerName>
  <%}%>
  <% if (person.Occupation != null) {%>
  <Occupation><%=StringUtils.getXMLValue(person.Occupation, false)%></Occupation>
  <%}%>
  <% if (person.LicenseNumber != null) {%>
  <DriverLicNumber><%=StringUtils.getXMLValue(person.LicenseNumber, false)%></DriverLicNumber>
  <%}%>
  <% if (person.LicenseState != null) {%>
  <%=TypeListTemplate.renderToString(person.LicenseState, "DriverLicState", person.LicenseState.ListName)%>
  <%}%>
  <% if (person.MedicareEligibleExt != null) {%>	        
  <MedicareEligibleExt><%=person.MedicareEligibleExt%></MedicareEligibleExt>
  <%}%>
  <% if (person.LegalLNameExt != null) {%>
  <LegalLNameExt><%=StringUtils.getXMLValue(person.LegalLNameExt, false)%></LegalLNameExt>
  <%}%>
  <% if (person.LegalFNameExt != null) {%>
  <LegalFNameExt><%=StringUtils.getXMLValue(person.LegalFNameExt, false)%></LegalFNameExt>
  <%}%>
  <% if (person.LegalMNameExt != null) {%>
  <LegalMNameExt><%=StringUtils.getXMLValue(person.LegalMNameExt, false)%></LegalMNameExt>
  <%}%>
  <% if (!(person typeis UserContact)) {%>
    <%=PersonMedicareTemplate.renderToString(person, claim)%>
  <%}%>
  <% if (person.DateOfDeathExt != null) {%>
    <PersonDateOfDeathExt><%=person.DateOfDeathExt%></PersonDateOfDeathExt>
  <%}%>
  <% if (person.ClaimantFatalityExt != null) {%>
    <DeceasedExt><%=person.ClaimantFatalityExt%></DeceasedExt>
  <%}%>

  <% if (person typeis InjuredWorkerExt) { %>
      <%=YesNoTypeListTemplate.renderToString(claim.InjuredWorker.ComorbObesityExt, "ComorbObesityExt")%>
      <%=YesNoTypeListTemplate.renderToString(claim.InjuredWorker.ComorbBehavioralExt, "ComorbBehavioralExt")%>
      <%=YesNoTypeListTemplate.renderToString(claim.InjuredWorker.ComorbDiabetesExt, "ComorbDiabetesExt")%>  
      <%=YesNoTypeListTemplate.renderToString(claim.InjuredWorker.ComorbHeartExt, "ComorbHeartExt")%>
      <%=YesNoTypeListTemplate.renderToString(claim.InjuredWorker.ComorbHypertensionExt, "ComorbHypertensionExt")%>  
      <%=YesNoTypeListTemplate.renderToString(claim.InjuredWorker.ComorbSmokingExt, "ComorbSmokingExt")%>  
      <% if (claim.EmploymentData != null) {%>
          <%=StringParseTemplate.renderToString(claim.EmploymentData.DepartmentCode, "DepartmentCode")%> 
          <% if (claim.EmploymentData.HireDate != null) {%>
            <HireDate><%=claim.EmploymentData.HireDate%></HireDate>
          <%}%>
          <% if (claim.EmploymentData.HireState != null) {%>
            <HireState>
              <Code><%=claim.EmploymentData.HireState.Code%></Code>
              <Description><%=claim.EmploymentData.HireState.Description%></Description>
              <ListName><%=claim.EmploymentData.HireState.ListName%></ListName>
              <AddressType>
                <Code>stateofhire</Code>
                <Description>State of Hire</Description>
                <ListName>State Of Hire</ListName>
              </AddressType>
           </HireState>
          <%}%>
          <% if (claim.EmploymentData.MilesToWorkExt != null) {%>
            <MilesToWorkExt><%=claim.EmploymentData.MilesToWorkExt%></MilesToWorkExt>
          <%}%>
      <%}%>
      <% if (person.ChildSupportOrderExt != null) {%>
          <ChildSupportOrderExt><%=person.ChildSupportOrderExt%></ChildSupportOrderExt>
      <%}%>
      <% if (person typeis InjuredWorkerExt) { %>
       <% if (claim.Incidents != null and claim.Incidents.length > 0) {%>
          <% for (cincident in claim.Incidents) {%>
              <% if (cincident typeis InjuryIncident and cincident.ClaimIncident) {%>      
                  <% if (cincident.InjuryDiagnoses != null and cincident.InjuryDiagnoses.length > 0) {%>
                      <ICDCodes>
                         <% for (injdiag in cincident.InjuryDiagnoses) {%>
                           <ICDCodeExt>             
                              <% if (injdiag.ICDCode.Code != null) {%>
                                <ICDCode><%=injdiag.ICDCode.Code%></ICDCode>
                              <%}%>  
                              <% if (injdiag.ICDCode.CodeDesc != null) {%>
                                  <ICDCodeDesc><%=injdiag.ICDCode.CodeDesc%></ICDCodeDesc>
                              <%}%>                      
                              <% if (injdiag.ICDCode.ICDVersionExt != null) {%>
                                <%=TypeListTemplate.renderToString(injdiag.ICDCode.ICDVersionExt, "ICDVersionExt", injdiag.ICDCode.ICDVersionExt.ListName)%>
                              <%}%>               
                              <% if (injdiag.IsPrimary != null) {%>
                                  <ICDCodePrimary><%=injdiag.IsPrimary%></ICDCodePrimary>
                              <%}%>  
                              <% if (injdiag.ICDMedReportExt != null) {%>
                                  <ICDMedReportExt><%=injdiag.ICDMedReportExt%></ICDMedReportExt>
                              <%}%>  
                              <% if (injdiag.Compensable != null) {%>
                                  <ICDCodeCompensable><%=injdiag.Compensable%></ICDCodeCompensable>
                              <%}%>                   
                           </ICDCodeExt>
                         <%}%> 
                      </ICDCodes>
                  <%}%> 
              <%}%>
          <%}%>  
       <%}%> 
      <% } %> 
      <% if (person.DependentsExt != null) {%>
          <DependentsExt><%=person.DependentsExt%></DependentsExt>
      <%}%>
      <% if (person.InterpreterReqExt != null) {%>
          <InterpreterReqExt><%=person.InterpreterReqExt%></InterpreterReqExt>
      <%}%>
      <% if (person.EducationLevelExt != null) {%>
          <%=TypeListTemplate.renderToString(person.EducationLevelExt, "EducationLevelExt", person.EducationLevelExt.ListName)%>
      <%}%>
      <% if (person.PrimaryLanguageExt != null) {%>
          <%=TypeListTemplate.renderToString(person.PrimaryLanguageExt, "PrimaryLanguageExt", person.PrimaryLanguageExt.ListName)%>
      <%}%>
      <% if (person.USCitizenExt != null) {%>
          <USCitizenExt><%=person.USCitizenExt%></USCitizenExt>
      <%}%>
      <% if (person.UndocumentedWorkerExt != null) {%>
          <UndocumentedWorkerExt><%=person.UndocumentedWorkerExt%></UndocumentedWorkerExt>
      <%}%>    
	  <% if (claim != null){ %> 
	    <% if (claim.Exposures.HasElements){
	        var indemexposure : Exposure 
	        var iexposures = claim.Exposures.where(\ i -> i.ExposureType == "wc_indemnity_timeloss" )
	        indemexposure = iexposures.first();   %>
	        <% if (indemexposure != null) { %>  
	             <NumberOfDependents><%=indemexposure.getClaimContactRolesByRole("claimantdep").Count%></NumberOfDependents> 
	        <%}%>
	    <%}%>
	  <%}%>
      <% if ((persontype != null) and (persontype == "injwrkr")) { %>
         <%=InjuredWorkerTemplate.renderToString(claim, exp) %>
      <% } %>  
  <% } %>  
  
  <% if (person.PilotsHoursInMakeExt != null) {%>
    <PilotsHoursInMakeExt><%=person.PilotsHoursInMakeExt%></PilotsHoursInMakeExt> 
  <%}%>
  <% if (person.PilotsTotalHoursExt != null) {%>
    <PilotsTotalHoursExt><%=person.PilotsTotalHoursExt%></PilotsTotalHoursExt> 
  <%}%>
  <% if (person.PilotTransitionExt != null) {%>
    <PilotTransitionExt><%=person.PilotTransitionExt%></PilotTransitionExt> 
  <%}%> 
  <% if (person.PilotTypeExt != null) {%>
    <%=TypeListTemplate.renderToString(person.PilotTypeExt, "PilotTypeExt", claim.PrimaryPilotExt.PilotTypeExt.ListName)%>
  <%}%>
  <% if (person.Pilot65Ext != null) {%>
    <Pilot65Ext><%=person.Pilot65Ext%></Pilot65Ext> 
  <%}%>
    
</Person>