<% uses java.util.SortedMap %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.AddressTemplate %>
<% uses templates.messaging.edw.CoverageTemplateEDW %>
<% uses templates.messaging.edw.PartyTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses java.lang.System %>
<%@ params(theclaim : Claim, therisk : LocationBasedRU, theexposure : Exposure, objStatus : String, riskCat : String, eventName : String, thesource : String) %>
<%var thepolicy = theclaim.Policy%>
<Risk>
  <PublicID><%=therisk.PublicID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <UnVerifiedRisk>
    <% if (therisk.Property.LocationNumber != null) { %> 
    <LocationNumber><%=therisk.Property.LocationNumber%></LocationNumber>
    <% } else { %>
    <LocationNumber>cc</LocationNumber>
    <%}%>
    <% if (therisk.CreateTime != null) { %>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(therisk.CreateTime)%></CreateTime>
    <%}%>
    <% if (therisk.Property.LocationNumber != null) {%>
    <AnimalName><%=therisk.Property.LocationNumber%></AnimalName>
    <%}%>
    <% if (therisk.Property.ex_Breed != null) {%>
    <%=TypeListTemplate.renderToString(therisk.Property.ex_Breed, "ex_Breed", therisk.Property.ex_Breed.ListName)%>
    <%} else {%>
    <ex_Breed>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>EquineBreed</ListName>
    </ex_Breed>
    <%}%>
    <% if (therisk.Property.ex_Sex != null) {%> 
    <%=TypeListTemplate.renderToString(therisk.Property.ex_Sex, "ex_Sex", therisk.Property.ex_Sex.ListName)%>
    <%} else {%>
    <ex_Sex>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>EquineSex</ListName>
    </ex_Sex>
    <%}%>
    <% if (therisk.Property.ex_AnimalUse != null) {%> 
    <%=TypeListTemplate.renderToString(therisk.Property.ex_AnimalUse, "ex_AnimalUse", therisk.Property.ex_AnimalUse.ListName)%>
    <%} else {%>
    <ex_AnimalUse>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>EquineUse</ListName>
    </ex_AnimalUse>
    <%}%>
    <% if (therisk.Property.ex_DateofBirth != null) {%>
    <ex_DateofBirth><%=therisk.Property.ex_DateofBirth%></ex_DateofBirth>
    <%}%>
    <% if (therisk.Property.ex_BarnName != null) {%>
    <ex_BarnName><%=StringUtils.getXMLValue(therisk.Property.ex_BarnName, false)%></ex_BarnName>
    <%}%>
    <% if (therisk.Property.AnimalValueExt != null) {%>
    <AnimalValueExt><%=StringUtils.getXMLValue(therisk.Property.AnimalValueExt as java.lang.String, false)%></AnimalValueExt>
    <%}%>
    <% if (therisk.Property.VetBillsExt != null) {%>
    <VetBillsExt><%=StringUtils.getXMLValue(therisk.Property.VetBillsExt as java.lang.String, false)%></VetBillsExt>
    <%}%>
    <% if (therisk.Property.BoardingExt != null) {%>
    <BoardingExt><%=StringUtils.getXMLValue(therisk.Property.BoardingExt as java.lang.String, false)%></BoardingExt>
    <%}%>
    <% if (therisk.Property.Notes != null) {%>
    <Notes><%=StringUtils.getXMLValue(therisk.Property.Notes, false)%></Notes>
    <%}%>
    <% if (theclaim.DeathDate != null) {%>
    <DeathDate><%=theclaim.DeathDate%></DeathDate> 
    <%}%>
    <% if (therisk.Property.AnimalUse2Ext != null) {%> 
    <%=TypeListTemplate.renderToString(therisk.Property.AnimalUse2Ext, "AnimalUse2Ext", therisk.Property.AnimalUse2Ext.ListName)%>
    <%} else {%>
    <AnimalUse2Ext>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>EquineUse</ListName>
    </AnimalUse2Ext>
    <%}%>
    <% if (thesource == "exposure") { %>
    <% if (theexposure != null && theexposure.Incident != null && theexposure.Incident.Description != null) {%>
    <DamageDescription><%=theexposure.Incident.Description%></DamageDescription> 
    <%}%>
    <%}%>
    <% if (therisk.Property.Address != null) { var theaddress = therisk.Property.Address; %>
    <RiskLocations>
      <RiskLocation>
        <%
        var primInd = therisk.Property.ex_AnimalAddressType == "primary" ? true : false;
        var oStatus = objStatus;
        if (objStatus == "D") {
          oStatus = "E" ;
        } else if (theaddress.New and eventName != "CoverageRemoved") {
          oStatus = "A" ;
        }
        %>
        <%=AddressTemplate.renderToString(theaddress, primInd, objStatus, "")%>
      </RiskLocation>
    </RiskLocations>
    <%}%>
    <% if (thesource == "exposure") { %>
    <% if (theexposure != null && theexposure.RestorationDateExt != null) {%>
    <RestorationDateExt><%=theexposure.RestorationDateExt%></RestorationDateExt>
    <%}%>
    <%}%>
  </UnVerifiedRisk>

  <%=riskCat%>

  <% if (therisk.Coverages.length != 0) { %>
  <Coverages>
    <% for( var thecoverage in therisk.Coverages ) { %>
    <%
    var oStatus = objStatus;
    if (objStatus == "D") {
      oStatus = "E";
    } else if (thecoverage.New and eventName != "CoverageRemoved") {
      oStatus = "A";
    }
    %>
    <%=CoverageTemplateEDW.renderToString(thepolicy, thecoverage, oStatus, ".CVRG.", "AN")%>
    <%}%>
  </Coverages>
  <%}%>

  <% var partyRelTo = "<PartyRelTo><PublicID>"+therisk.PublicID+"</PublicID><RelToType>Risk</RelToType></PartyRelTo>"%>
  <% if (therisk.CreateUser != null || therisk.UpdateUser != null) {%>
  <Parties>
    <% if (therisk.Property.ex_PrimaryTrainer != null) { var theprimarytrainer = therisk.Property.ex_PrimaryTrainer;%>
    <%=PartyTemplate.renderToString(theprimarytrainer, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.PrimaryTrainerRole, "", partyRelTo, theclaim, "", "")%>
    <%}%>

    <% if (therisk.Property.ex_AlternateTrainer != null) { var thealternatetrainer = therisk.Property.ex_AlternateTrainer;%>
    <%=PartyTemplate.renderToString(thealternatetrainer, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.AlternateTraineRole, "", partyRelTo, theclaim, "", "")%>
    <%}%>

    <% if (therisk.CreateUser != null) { %>
    <%=UserTemplate.renderToString(therisk.CreateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
    <%}%>

    <% if (therisk.UpdateUser != null) { %>
    <%=UserTemplate.renderToString(therisk.UpdateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
    <%}%>
  </Parties>
  <%}%>
  <% if (thesource == "policy") {%>
  <% var injAnimal = false; %>
  <% var injAnimalInd = "C"; %> 
  <%
  if ((theclaim.FixedPropertyIncidentsOnly != null) && (theclaim.FixedPropertyIncidentsOnly.length != 0)) { 
    var newInjAnimal = false; 
    for (inc in theclaim.FixedPropertyIncidentsOnly ) {
      if (therisk.Property.PublicID == inc.Property.PublicID) {
        injAnimal = true;  
        if (inc.New) {  
          newInjAnimal = true; 
        } 
      }  
    }   
    if (injAnimal == true) {  
      if (objStatus == "D") {
        injAnimalInd = "D"; 
      } else if (newInjAnimal == true) { 
        injAnimalInd = "A"; 
      }   
    } 
  }
  
  if (injAnimal == false) { 
    if (objStatus == "D") {
       if ((theclaim.OriginalVersion as Claim).FixedPropertyIncidentsOnly != null
          && (theclaim.OriginalVersion as Claim).FixedPropertyIncidentsOnly.length != 0) {  
          var fnd = "false"; 
          for (originc in (theclaim.OriginalVersion as Claim).FixedPropertyIncidentsOnly)  { 
              if (therisk.Property.PublicID == originc.Property.PublicID) { 
                  injAnimal = true; 
                 injAnimalInd = "D"; 
              } 
          } 
       }
    } else if ((theclaim.OriginalVersion as Claim).FixedPropertyIncidentsOnly != null
    && (theclaim.OriginalVersion as Claim).FixedPropertyIncidentsOnly.length != 0) {  
      var fnd = "false"; 
      for (originc in (theclaim.OriginalVersion as Claim).FixedPropertyIncidentsOnly)  { 
        if (therisk.Property.PublicID == originc.Property.PublicID) { 
          injAnimal = true; 
          injAnimalInd = "D"; 
        } 
      } 
    } 
  }
  %>
  <% if (injAnimal == true) {%>  
  <InjuredAnimalIndicator><%=injAnimalInd%></InjuredAnimalIndicator>
  <%}%>
  <%}%>
</Risk>