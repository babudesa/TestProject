<%uses java.util.Map%>
<%uses java.util.HashMap%>
<%uses util.StringUtils%>
<%uses templates.messaging.edw.PartyTemplate%>
<%uses templates.messaging.edw.TypeListTemplate %>
<%uses templates.messaging.edw.UserTemplate %>
<%uses templates.messaging.edw.ExposurePartiesLienTemplate %>
<%@ params(exposure : Exposure, objStatus : String) %>
<%var partyRelTo = "<PartyRelTo><PublicID>"+exposure.PublicID+"</PublicID><RelToType>Feature</RelToType></PartyRelTo>"%>
<Parties>
  <% if ( exposure.Incident typeis FixedPropertyIncident ) {%>
  <% var doc = exposure.Incident.VeterinarianExt; %>
  <% if ( doc != null) {%>
  <%var vrole = "<Role><Code>doctor</Code><Description>Doctor</Description><ListName>ContactRole</ListName></Role>"%>
  <%=PartyTemplate.renderToString(doc, "", (objStatus == "D" ? objStatus : "C"), vrole, "", partyRelTo, exposure.Claim, "", "")%>
  <%}%>
  <%}%>

  <%
  var contacts : Map = new HashMap() ;

  for (ccr in exposure.Roles) {
    if ((ccr.Role.Code != "claimant" and ccr.Role.Code != "driver" and ccr.Role.Code != "claimantdep" and !((ccr.Role.Code == "formerclaimant" or ccr.Role.Code == "claimlosspayee"  or ccr.Role.Code == "frmrclaimlosspayee") and ccr.Contact.PublicID == exposure.Claimant.PublicID )) and ccr.Contact != null) {
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
  %>
  <% for( key in contacts.keySet().iterator()) {%>
  <%//this is a filter to not send the claimant or driver information in this loop%>
  <%/// we are sending the claimant and driver information separately as they need additional information %>
  <%
  var thepartiesinvolved = contacts.get(key) as ClaimContactRole ;
  if (thepartiesinvolved.Role.Code != "claimant" and thepartiesinvolved.Role.Code != "driver" and thepartiesinvolved.Role.Code != "claimantdep") {
    var pirole = "<Role><Code>"+thepartiesinvolved.Role.Code+"</Code><Description>"+thepartiesinvolved.Role.Description+"</Description><ListName>"+thepartiesinvolved.Role.ListName+"</ListName></Role>";
  %>
  <%=PartyTemplate.renderToString(thepartiesinvolved.Contact, "", (objStatus == "D" ? objStatus : "C"), pirole, "", partyRelTo, exposure.Claim, "", "")%>
  <%}%>
  <%}%>

  <% if (exposure.CreateUser != null) { %>
  <%=UserTemplate.renderToString(exposure.CreateUser, "", (objStatus == "D" ? objStatus : "C"), displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
  <%}%>

  <% if (exposure.UpdateUser != null) { %>
  <%=UserTemplate.renderToString(exposure.UpdateUser, "", (objStatus == "D" ? objStatus : "C"), displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
  <%}%>

  <% if (exposure.Claimant != null) {%>
  <%
  var claimant = exposure.Claimant;
  var extradata : String = "";
  var featuredata : String = "";
  var indemexposure : Exposure; 
  if (exposure.ExposureType == "wc_indemnity_timeloss") {
  indemexposure = exposure;
  } else {
  var iexposures = exposure.Claim.Exposures.where(\ i -> i.ExposureType == "wc_indemnity_timeloss" )
  indemexposure = iexposures.first();
  }
  var contactProhibited = exposure.Claim.getClaimContact(exposure.Claimant).ContactProhibited;
  if (contactProhibited != null) {
  extradata = extradata + "<ContactProhibited>"+contactProhibited+"</ContactProhibited>";
  }
  if (exposure.ExposureType == "wc_medical_details" or exposure.ExposureType == "wc_indemnity_timeloss" or exposure.ExposureType == "wc_vocational_rehab"  or exposure.ExposureType == "wc_employers_liability" ) {
    extradata = extradata + "<MinorChildExt>"+ exposure.Claim.InjuredWorker.MinorWorkerExt+"</MinorChildExt>";
  } else if (exposure.MinorChildExt != null) {
      extradata = extradata + "<MinorChildExt>"+exposure.MinorChildExt+"</MinorChildExt>";
  } 
  if (exposure.SeatbeltAvailableExt != null) {
  extradata = extradata + "<SeatbeltAvailableExt>"+exposure.SeatbeltAvailableExt+"</SeatbeltAvailableExt>";
  }
  if (exposure.SeatbeltWornExt != null) {
  extradata = extradata + "<SeatbeltWornExt>"+exposure.SeatbeltWornExt+"</SeatbeltWornExt>";
  }
  // BESTOR 04062009 - Defect 1690
  // Change exposure.Description to exposure.Incident.Description
  if (exposure.Incident != null && exposure.Incident.Description != null && exposure.Claim.LossType == LossType.TC_EQUINE) {
  extradata = extradata + "<Description>"+StringUtils.getXMLValue(exposure.Incident.Description, false)+"</Description>";
  } else if (exposure.InjuryNatureDescExt != null && !exposure.ExposureType.hasCategory( ExposureCategoryType.TC_PROPERTY )) {
  // BESTOR 20100818 - Defect 3514: Alleged Injury Text
  extradata = extradata + "<Description>"+StringUtils.getXMLValue(exposure.InjuryNatureDescExt, false)+"</Description>";
  }
  if (exposure.WeeklyCompRateExt != null) {
  extradata = extradata + "<WeeklyCompRateExt>"+exposure.WeeklyCompRateExt+"</WeeklyCompRateExt>";
  }
  if(indemexposure != null and indemexposure.WCImpairmentExt != null) {
  extradata = extradata + "<Impairment>"+indemexposure.WCImpairmentExt+"</Impairment>";
  } else if (exposure.ImpairmentExt != null) {
  extradata = extradata + "<Impairment>"+exposure.ImpairmentExt+"</Impairment>";
  } 
  if (exposure.LostWagesExt != null) {
  extradata = extradata + "<LostWages>"+exposure.LostWagesExt+"</LostWages>";
  }
  if (exposure.MedicalTreatmentExt != null) {
  extradata = extradata + "<MedicalTreatment><Code>"+exposure.MedicalTreatmentExt.Code+"</Code><Description>"+exposure.MedicalTreatmentExt.Description+"</Description><ListName>"+exposure.MedicalTreatmentExt.ListName+"</ListName></MedicalTreatment>";
  }
  if (exposure.DetailedBodyPartExt != null) {
  extradata = extradata + "<DetailedBodyPart><Code>"+exposure.DetailedBodyPartExt.Code+"</Code><Description>"+exposure.DetailedBodyPartExt.Description+"</Description><ListName>"+exposure.DetailedBodyPartExt.ListName+"</ListName></DetailedBodyPart>";
  }
  if (exposure.PrimaryBodyPartExt != null) {
  extradata = extradata + "<PrimaryBodyPart><Code>"+exposure.PrimaryBodyPartExt.Code+"</Code><Description>"+exposure.PrimaryBodyPartExt.Description+"</Description><ListName>"+exposure.PrimaryBodyPartExt.ListName+"</ListName></PrimaryBodyPart>";
  }
  if (exposure.DetailedInjuryExt != null) {
  extradata = extradata + "<DetailedInjury><Code>"+exposure.DetailedInjuryExt.Code+"</Code><Description>"+exposure.DetailedInjuryExt.Description+"</Description><ListName>"+exposure.DetailedInjuryExt.ListName+"</ListName></DetailedInjury>";
  }
  if (exposure.LeadingInjuryExt != null) {
  extradata = extradata + "<LeadingInjury><Code>"+exposure.LeadingInjuryExt.Code+"</Code><Description>"+exposure.LeadingInjuryExt.Description+"</Description><ListName>"+exposure.LeadingInjuryExt.ListName+"</ListName></LeadingInjury>";
  }
  if (exposure.Incident != null && exposure.Incident.Severity != null) { 
  extradata = extradata + "<Severity><Code>"+exposure.Incident.Severity.Code+"</Code><Description>"+exposure.Incident.Severity.Description+"</Description><ListName>"+exposure.Incident.Severity.ListName+"</ListName></Severity>";
  }
  if (gw.api.util.ArrayUtil.count(exposure.IMEPerformed) > 0){ 
  extradata = extradata + "<IMEs>";
  for (ime in exposure.IMEPerformed) { 
  extradata = extradata + "<IMEPerformed><IMEType><Code>"+ ime.IMEType+"</Code><Description>"+ime.IMEType+"</Description><ListName>"+ime.IMEType.ListName+"</ListName></IMEType><IMEDate>" + ime.IMEDate+"</IMEDate></IMEPerformed>";
  }
  extradata = extradata + "</IMEs>";
  }
  if(indemexposure != null and indemexposure.ImpairPercBasisExt != null) {
  extradata = extradata + "<ImpairPercBasisExt><Code>"+indemexposure.ImpairPercBasisExt.Code+"</Code><Description>"+indemexposure.ImpairPercBasisExt.Description+"</Description><ListName>"+indemexposure.ImpairPercBasisExt.ListName+"</ListName></ImpairPercBasisExt>";
  }

  if (exposure.AttorneyRepExt != null or exposure.InjuredPartyTypeExt != null) {
    featuredata = featuredata + "<PartyFeatureData><PartyFeature><FeaturePublicID>"+exposure.PublicID+"</FeaturePublicID>"
    if (exposure.AttorneyRepExt != null){
      featuredata = featuredata + "<AttorneyRepExt>"+exposure.AttorneyRepExt+"</AttorneyRepExt>";
    }
    if (exposure.InjuredPartyTypeExt != null) {
      featuredata = featuredata + "<InjuredPartyTypeExt><Code>"+exposure.InjuredPartyTypeExt.Code+"</Code><Description>"+exposure.InjuredPartyTypeExt.Description+"</Description><ListName>"+exposure.InjuredPartyTypeExt.ListName+"</ListName></InjuredPartyTypeExt>";
    }
    featuredata = featuredata + "<PartyFeatureRole><Role><Code>claimant</Code><Description>Claimant</Description><ListName>ContactRole</ListName></Role></PartyFeatureRole></PartyFeature></PartyFeatureData>";
  }
  var lienholderData = ExposurePartiesLienTemplate.renderToString(exposure)
  if (org.apache.commons.lang.StringUtils.deleteSpaces( lienholderData ) != "") {
    featuredata = featuredata + lienholderData;
  }
 
  var crole = "<Role><Code>claimant</Code><Description>Claimant</Description><ListName>ContactRole</ListName></Role>"+ extradata;
  %>
  <%=PartyTemplate.renderToString(claimant, "", (objStatus == "D" ? objStatus : "C"), crole, "", partyRelTo, exposure.Claim, "injwrkr", featuredata)%>
  
  <%}%>
     
  <% if (exposure.DriverExt != null) {%>
  <%
  var driver = exposure.DriverExt;
  var drivertype : String = "";
  if (exposure.DriverTypeExt != null) {
    drivertype = "<DriverTypeExt><Code>"+exposure.DriverTypeExt.Code+"</Code><Description>"+exposure.DriverTypeExt.Description+"</Description><ListName>"+exposure.DriverTypeExt.ListName+"</ListName></DriverTypeExt>";
  }
  if (exposure.DrivingExperienceExt != null) {
    drivertype = drivertype + "<DrivingExperienceExt>"+exposure.DrivingExperienceExt+"</DrivingExperienceExt>";
  }
  var drole = "<Role><Code>driver</Code><Description>Driver</Description><ListName>ContactRole</ListName></Role>"+ drivertype;
  %>
  <%=PartyTemplate.renderToString(driver, "", (objStatus == "D" ? objStatus : "C"), drole, "", partyRelTo, exposure.Claim, "", "")%>
  <%}%>
 
  <% 
  for (cldep in exposure.Roles ) {
    if ((cldep.Role.Code  == "claimantdep") and cldep.Contact != null) {
      var cldepinfo : String = "";
      if (cldep.ClaimContact.DependentType != null) {
        cldepinfo = "<DependentType><Code>"+cldep.ClaimContact.DependentType.Code+"</Code><Description>"+cldep.ClaimContact.DependentType.Description+"</Description><ListName>"+cldep.ClaimContact.DependentType.ListName+"</ListName></DependentType>";
      } 
      if (cldep.ClaimContact.BenefitEndReasonType   != null) {
        cldepinfo = cldepinfo + "<DependentEndReason><Code>"+cldep.ClaimContact.BenefitEndReasonType.Code+"</Code><Description>"+cldep.ClaimContact.BenefitEndReasonType.Description+"</Description><ListName>"+cldep.ClaimContact.BenefitEndReasonType.ListName+"</ListName></DependentEndReason>";
      }
      if (cldep.ClaimContact.BenefitEndDate != null) {
        cldepinfo = cldepinfo + "<DependentEndDate>"+cldep.ClaimContact.BenefitEndDate+"</DependentEndDate>";
      }     
    
      var drole = "<Role><Code>"+cldep.Role.Code+"</Code><Description>"+cldep.Role.Description+"</Description><ListName>"+cldep.Role.ListName+"</ListName></Role>" + cldepinfo;
      %>
      <%=PartyTemplate.renderToString(cldep.Contact, "", (objStatus == "D" ? objStatus : "C"), drole, "", partyRelTo, exposure.Claim, "", "")%>
    <%}%>
  <%}%>
  
  <% 
  for (frmr in exposure.Roles ) { 
    if (((frmr.Role.Code  == "formerclaimant" or frmr.Role.Code == "claimlosspayee"  or frmr.Role.Code == "frmrclaimlosspayee") and frmr.Contact.PublicID == exposure.Claimant.PublicID) and frmr.Contact != null) {
      var frole = "<Role><Code>"+frmr.Role.Code+"</Code><Description>"+frmr.Role.Description+"</Description><ListName>"+frmr.Role.ListName+"</ListName></Role>";
      %>
      <%=PartyTemplate.renderToString(frmr.Contact, "", (objStatus == "D" ? objStatus : "C"), frole, "", partyRelTo, exposure.Claim, "", "")%>
    <%}%>
  <%}%>
    
  <% if (exposure.AssignedUser != null) { var theassigneduser = exposure.AssignedUser;%>
  <%
  var aurole = "<Role><Code>assigneduser</Code><Description>AssignedUser</Description><ListName>AssignedUser</ListName></Role>";
  %>
  <%var assignStatus = "<AssignmentStatus><Code>"+exposure.Claim.AssignmentStatus.Code+"</Code><Description>"+exposure.Claim.AssignmentStatus.DisplayName+"</Description><ListName>"+exposure.Claim.AssignmentStatus.ListName+"</ListName></AssignmentStatus>"%>
  <%=UserTemplate.renderToString(theassigneduser, "", (objStatus == "D" ? objStatus : "C"), aurole, assignStatus, partyRelTo)%>
  <%}%>

  <% if (exposure.AssignedByUser != null) { var theassignedbyuser = exposure.AssignedByUser;%>
  <%var aburole = "<Role><Code>assignedbyuser</Code><Description>AssignedByUser</Description><ListName>AssignedByUser</ListName></Role>"%>
  <%=UserTemplate.renderToString(theassignedbyuser, "", (objStatus == "D" ? objStatus : "C"), aburole, "", partyRelTo)%>
  <%}%>

  <% if (exposure.PreviousUser != null) { var theprevioususer = exposure.PreviousUser;%>
  <%var purole = "<Role><Code>previoususer</Code><Description>PreviousUser</Description><ListName>PreviousUser</ListName></Role>"%>
  <%=UserTemplate.renderToString(theprevioususer, "", (objStatus == "D" ? objStatus : "C"), purole, "", partyRelTo)%>
  <%}%>

  <% if (exposure.VenueChoiceExt != null) {%>
  <Party>
    <PublicID><%=exposure.VenueChoiceExt%></PublicID>
    <ObjectStatus>E</ObjectStatus>
    <% if (exposure.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.CreateTime)%></CreateTime> 
    <%}%>
    <% if (exposure.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.UpdateTime)%></UpdateTime> 
    <%}%>
    <Role>
      <Code>Venue Choice</Code>
      <Description>Venue Choice</Description>
      <ListName>Venue Choice</ListName>
    </Role>
    <Name>VenueChoicExt</Name>
    <Management>
      <Name>VenueChoicExt</Name>
    </Management>
  </Party>
  <%}%>
  <% if (exposure.ConstructedByExt != null) {%>
  <Party>
    <PublicID>cnst:<%=exposure.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (exposure.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.CreateTime)%></CreateTime> 
    <%}%>
    <% if (exposure.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.UpdateTime)%></UpdateTime> 
    <%}%>
    <Role>
    <Code>ConstructedBy</Code>
    <Description>ConstructedBy</Description>
    <ListName>ConstructedBy</ListName>
    </Role>
    <Name><%=StringUtils.getXMLValue(exposure.ConstructedByExt, false)%></Name>
    <Organization>
      <PublicID>cnst:<%=exposure.PublicID%></PublicID>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <Name><%=StringUtils.getXMLValue(exposure.ConstructedByExt, false)%></Name>
    </Organization>
  </Party>
  <%}%>

  <% if (exposure.AssignedGroup != null) { var thegroup = exposure.AssignedGroup;%>
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
    <%=TypeListTemplate.renderToString(exposure.AssignmentStatus, "AssignmentStatus", exposure.AssignmentStatus.ListName)%>
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

  <% if (exposure.getClaimOfficeBranchGroup() != null) { var thegroup = exposure.getClaimOfficeBranchGroup();%>
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
    <%=TypeListTemplate.renderToString(exposure.AssignmentStatus, "AssignmentStatus", exposure.AssignmentStatus.ListName)%>
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
</Parties>