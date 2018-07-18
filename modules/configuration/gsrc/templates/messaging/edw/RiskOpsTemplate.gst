<% uses templates.messaging.edw.AddressTemplate %>
<% uses templates.messaging.edw.RiskOPSCoveragesTemplate %>
<%@ params(theclaim : Claim, thepolicy : Policy, objStatus : String, riskCat : String, riskOpsType : String, riskType : String, eventName : String) %>
<Risk>
  <% 
  var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper();
  var pubRiskOpsType = "";
  if (riskType != null and riskType != "POLICY") {
    pubRiskOpsType = riskType;
  }
  %>
  <PublicID><%=theclaim.PublicID%><%=thepolicy.PublicID%><%=pubRiskOpsType%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>

  <% var sppDesc = "";  %>  
  <%
  if (thepolicy.Coverages != null) {
    for (var pc in thepolicy.Coverages) {
      if (pc.isSPP()
      && riskOpsType == typecodeMapper.getInternalCodeByAlias( "EDWRiskType", "CoverageRisk", pc.Type.Code)
      && riskType == pc.PublicID) {
        if (pc.HighValueItemExt.SPPDescriptionExt != null) {
          sppDesc = pc.HighValueItemExt.SPPDescriptionExt
  %> 
  <%}%>
  <%}%>
  <%}%>
  <%}%>

  <% if (thepolicy.Properties.length != 0 or sppDesc != "") {%>
  <UnVerifiedRisk>
    <% if (thepolicy.CreateTime != null) { %>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thepolicy.CreateTime)%></CreateTime>
    <%}%>
    <% if (theclaim.DeathDate != null) { %>
    <DeathDate><%=theclaim.DeathDate%></DeathDate> 
    <%}%>
    <% if (thepolicy.Properties.length != 0) {%>
    <%
    var hasRiskLoc = false;
    for (pp in thepolicy.Properties) {
      if (pp.Property != null and pp.Property.Address != null) {
        hasRiskLoc = true;
        break;
      }
    }
    %>
    <% if (hasRiskLoc) {%>
    <RiskLocations>
      <% for (theproperty in thepolicy.Properties ) { %>
      <% if (theproperty.Property.Address != null) { var theaddress = theproperty.Property.Address;%>
      <RiskLocation>
        <%var primInd = theproperty.Property.ex_AnimalAddressType == "primary" ? true : false%>
        <%=AddressTemplate.renderToString(theaddress, primInd, objStatus == "D" ? "E" : objStatus, "")%>
      </RiskLocation>
      <%}%>
      <%}%>
    </RiskLocations>
    <%}%>
    <%}%>	
    <% if (sppDesc != "") {%>
    <Description><%=sppDesc%></Description> 
    <%}%>
  </UnVerifiedRisk>
  <%}%>

  <%=riskCat%>

  <%=RiskOPSCoveragesTemplate.renderToString(theclaim, thepolicy, (objStatus == "D" ? "E" : objStatus), riskOpsType, riskType, eventName)%>
</Risk>