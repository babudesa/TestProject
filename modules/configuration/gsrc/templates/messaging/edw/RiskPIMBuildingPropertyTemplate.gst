<% uses templates.messaging.edw.AddressTemplate %>
<% uses templates.messaging.edw.CoverageTemplateEDW %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(theclaim : Claim, therisk : LocationBasedRU, objStatus : String, riskCat : String, cvrg : String, riskType : String, eventName : String, thebuildingnumber : String, thecoverages : List<Coverage>, actualpremises : String, thepremisesnumber : String) %>
<Risk>
  <% if (therisk.Property.RiskTypeExt != null and therisk.Property.RiskTypeExt == "BLDG") {%>
        <PublicID><%=therisk.PublicID%>.<%=therisk.Property.RiskTypeExt%></PublicID>
   <%} else if (thepremisesnumber == null){%>
              <PublicID><%=actualpremises%>.<%=thebuildingnumber%>.BLDG</PublicID>
          <%} else {%>
              <PublicID><%=theclaim.Policy.PublicID%>.<%=thepremisesnumber%>.<%=thebuildingnumber%>.BLDG</PublicID>
          <%}%>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <UnVerifiedRisk>
    <% if (therisk.Property.Address != null) { %> 
    <LocationNumber><%=therisk.Property.Address%></LocationNumber>
    <% } else { %>
    <LocationNumber>cc</LocationNumber>
    <%}%>
    <% if (therisk.Property.Address.CreateTime != null) { %>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(therisk.Property.Address.CreateTime)%></CreateTime>
    <%}%>
    <% if (therisk.Property.Address != null) { var theaddress = therisk.Property.Address; %>
    <RiskLocations>
      <RiskLocation>
        <%
        var primInd = therisk.Property.ex_AnimalAddressType == "primary" ? true : false;
        var oStatus = objStatus;
        if (objStatus == "D") {
          oStatus = "E";
        } else if (theaddress.New and eventName != "CoverageRemoved") {
          oStatus = "A";
        }
        %>
        <%=AddressTemplate.renderToString(theaddress, primInd, objStatus, "")%>
      </RiskLocation>
    </RiskLocations>
    <%}%>
  </UnVerifiedRisk>

  <%=riskCat%>
  
  <% if (thecoverages != null and thecoverages.length > 0) { %>
  <Coverages>
    <% for(item in thecoverages.iterator()) { %>
    <%
    var thecoverage = item as PropertyCoverage;
    var oStatus = objStatus;
    if (objStatus == "D") {
     oStatus = "E";
    } else if (thecoverage.New and eventName != "CoverageRemoved") {
     oStatus = "A";
    }
    %>
    <%=CoverageTemplateEDW.renderToString(thecoverage.Policy, thecoverage, oStatus, cvrg, riskType)%>
    <%}%>
  </Coverages>
  <%}%>
  <%var partyRelTo = "<PartyRelTo><PublicID>"+therisk.PublicID+"</PublicID><RelToType>Risk</RelToType></PartyRelTo>"%>
  <% if (therisk.CreateUser != null || therisk.UpdateUser != null) {%>
      <Parties>
        <% if (therisk.CreateUser != null) { %>
        <%=UserTemplate.renderToString(therisk.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
        <%}%>
        <% if (therisk.UpdateUser != null) { %>
        <%=UserTemplate.renderToString(therisk.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
        <%}%>
      </Parties>
   <%}%>
  <% if (thepremisesnumber == null) {%>
    <RelToRisk><%=actualpremises%>.PRM</RelToRisk>
  <%} else {%>
    <RelToRisk><%=theclaim.Policy.PublicID%>.<%=thepremisesnumber%>.PRM</RelToRisk>
  <%}%>

</Risk>
