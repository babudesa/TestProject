<% uses templates.messaging.edw.AddressTemplate %>
<% uses templates.messaging.edw.FarmPropertyTypeTemplate %>
<% uses templates.messaging.edw.CoverageTemplateEDW %>
<% uses templates.messaging.edw.PartyTemplate %>
<% uses templates.messaging.edw.CoverageCauseOfLossTemplateEDW %>
<% uses templates.messaging.edw.CoverageAtoDTemplateEDW %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(theclaim : Claim, thepolicy : Policy, therisk : LocationBasedRU, theexposure : Exposure, objStatus : String, riskCat : String, cvrg : String, riskType : String, eventName : String, actualfrmloc : String, thelocationnumber : String) %>
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
        <%=AddressTemplate.renderToString(theaddress, primInd, oStatus, "")%>
      </RiskLocation>
    </RiskLocations>
    <%}%>
    <% if (theexposure != null && theexposure.RestorationDateExt != null) {%>
    <RestorationDateExt><%=theexposure.RestorationDateExt%></RestorationDateExt>
    <%}%>

    <%=FarmPropertyTypeTemplate.renderToString(therisk)%>
  </UnVerifiedRisk>

  <%=riskCat%>

  <% if (therisk.Coverages.length != 0) {%>
  <Coverages>
    <% for(thecoverage in therisk.Coverages) {%>
    <% var hasNoLimitChanged : boolean = (thecoverage.getRemovedArrayElements("CoverageBasisLimitsExt").length == 0
    && thecoverage.getAddedArrayElements("CoverageBasisLimitsExt").length == 0
    && thecoverage.getChangedArrayElements("CoverageBasisLimitsExt").length == 0) ? true : false ;%>
    <%
       var obStatus = objStatus;
       if (objStatus == "D") {
         obStatus = "E";
       } else if (thecoverage.New and eventName != "CoverageRemoved") {
         obStatus = "A";
       } 
    %>
    <%=CoverageTemplateEDW.renderToString(thepolicy, thecoverage, obStatus, cvrg, riskType)%>
    <% if (eventName == "NewClaim" or hasNoLimitChanged) {%>
    <% for (limitItem in thecoverage.CoverageBasisLimitsExt) {%>
    <%=CoverageAtoDTemplateEDW.renderToString(limitItem, (eventName == "NewClaim" ? "A" : "C"))%>
    <%}%>
    <%}%>
    <% for (deletedItem in thecoverage.getRemovedArrayElements("CoverageBasisLimitsExt")) {%>
    <%var deletedLimit = deletedItem as CoverageBasisLimitExt%>
    <%=CoverageAtoDTemplateEDW.renderToString(deletedLimit, "D")%>
    <%}%>
    <% for (addedItem in thecoverage.getAddedArrayElements("CoverageBasisLimitsExt")) {%>
    <%var addedLimit = addedItem as CoverageBasisLimitExt%>
    <%=CoverageAtoDTemplateEDW.renderToString(addedLimit, "A")%>
    <%}%>
    <% for (changedItem in thecoverage.getChangedArrayElements("CoverageBasisLimitsExt")) {%>
    <%var changedLimit = changedItem as CoverageBasisLimitExt%>
    <%=CoverageAtoDTemplateEDW.renderToString(changedLimit, (objStatus == "D" ? "E" : "C"))%>
    <%}%>
    <%
    if (thecoverage.CauseOfLossExt != null) {
      var oStatus = objStatus;
      if (objStatus == "D") {
        oStatus = "E";
      } else if (thecoverage.New and eventName != "CoverageRemoved") {
        oStatus = "A";
      }
    %>
    <%=CoverageCauseOfLossTemplateEDW.renderToString(thecoverage, oStatus)%>
    <%}%>
    <%}%>
  </Coverages>
  <%}%>

  <%var partyRelTo = "<PartyRelTo><PublicID>"+therisk.PublicID+"</PublicID><RelToType>Risk</RelToType></PartyRelTo>"%>
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
  <% if (thelocationnumber == null) {%>
  <RelToRisk><%=actualfrmloc%>.FRMLOC</RelToRisk>
  <%} else {%>
  <RelToRisk><%=thepolicy.PublicID%>.<%=thelocationnumber%>.FRMLOC</RelToRisk>
  <%}%>
</Risk>