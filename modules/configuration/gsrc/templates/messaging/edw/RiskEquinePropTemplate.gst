<% uses java.util.SortedMap %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.AddressTemplate %>
<% uses templates.messaging.edw.PartyTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses java.lang.System %>
<%@ params(theclaim : Claim, therisk : PolicyLocation, theexposure : Exposure, objStatus : String, riskCat : String, eventName : String, thesource : String, thelobcode : String) %>
<%var thepolicy = theclaim.Policy%>
<Risk>
  <PublicID><%=therisk.PublicID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <UnVerifiedRisk>
    <% if (therisk.LocationNumber != null) { %> 
    <LocationNumber><%=therisk.LocationNumber%></LocationNumber>
    <% } else { %>
    <LocationNumber>cc</LocationNumber>
    <%}%>
    <% if (therisk.CreateTime != null) { %>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(therisk.CreateTime)%></CreateTime>
    <%}%>
    <% if (therisk.LocationNumber != null) {%>
    <AnimalName><%=therisk.LocationNumber%></AnimalName>
    <%}%>
    <% if (therisk.ex_Breed != null) {%>
    <%=TypeListTemplate.renderToString(therisk.ex_Breed, "ex_Breed", therisk.ex_Breed.ListName)%>
    <%} else {%>
    <ex_Breed>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>EquineBreed</ListName>
    </ex_Breed>
    <%}%>
    <% if (therisk.ex_Sex != null) {%> 
    <%=TypeListTemplate.renderToString(therisk.ex_Sex, "ex_Sex", therisk.ex_Sex.ListName)%>
    <%} else {%>
    <ex_Sex>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>EquineSex</ListName>
    </ex_Sex>
    <%}%>
    <% if (therisk.ex_AnimalUse != null) {%> 
    <%=TypeListTemplate.renderToString(therisk.ex_AnimalUse, "ex_AnimalUse", therisk.ex_AnimalUse.ListName)%>
    <%} else {%>
    <ex_AnimalUse>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>EquineUse</ListName>
    </ex_AnimalUse>
    <%}%>
    <% if (therisk.ex_DateofBirth != null) {%>
    <ex_DateofBirth><%=therisk.ex_DateofBirth%></ex_DateofBirth>
    <%}%>
    <% if (therisk.ex_BarnName != null) {%>
    <ex_BarnName><%=StringUtils.getXMLValue(therisk.ex_BarnName, false)%></ex_BarnName>
    <%}%>
    <% if (therisk.AnimalValueExt != null) {%>
    <AnimalValueExt><%=StringUtils.getXMLValue(therisk.AnimalValueExt as java.lang.String, false)%></AnimalValueExt>
    <%}%>
    <% if (therisk.VetBillsExt != null) {%>
    <VetBillsExt><%=StringUtils.getXMLValue(therisk.VetBillsExt as java.lang.String, false)%></VetBillsExt>
    <%}%>
    <% if (therisk.BoardingExt != null) {%>
    <BoardingExt><%=StringUtils.getXMLValue(therisk.BoardingExt as java.lang.String, false)%></BoardingExt>
    <%}%>
    <% if (therisk.Notes != null) {%>
    <Notes><%=StringUtils.getXMLValue(therisk.Notes, false)%></Notes>
    <%}%>
    <% if (theclaim.DeathDate != null) {%>
    <DeathDate><%=theclaim.DeathDate%></DeathDate> 
    <%}%>
    <% if (therisk.AnimalUse2Ext != null) {%> 
    <%=TypeListTemplate.renderToString(therisk.AnimalUse2Ext, "AnimalUse2Ext", therisk.AnimalUse2Ext.ListName)%>
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
    <% if (therisk.Address != null) { var theaddress = therisk.Address; %>
    <RiskLocations>
      <RiskLocation>
        <%
        var primInd = therisk.ex_AnimalAddressType == "primary" ? true : false;
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

  <% var partyRelTo = "<PartyRelTo><PublicID>"+therisk.PublicID+"</PublicID><RelToType>Risk</RelToType></PartyRelTo>"%>
  <% if (therisk.CreateUser != null || therisk.UpdateUser != null) {%>
  <Parties>
    <% if (therisk.ex_PrimaryTrainer != null) { var theprimarytrainer = therisk.ex_PrimaryTrainer;%>
    <%=PartyTemplate.renderToString(theprimarytrainer, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.PrimaryTrainerRole, "", partyRelTo, theclaim, "", "")%>
    <%}%>

    <% if (therisk.ex_AlternateTrainer != null) { var thealternatetrainer = therisk.ex_AlternateTrainer;%>
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
    <% if (thesource == "exposure") { %>
      <% if (thelobcode != null) {%>
         <LOBCode><%=thelobcode%></LOBCode> 
      <%}%>
    <%}%>
</Risk>