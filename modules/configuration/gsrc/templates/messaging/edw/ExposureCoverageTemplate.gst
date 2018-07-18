<%@ params(exposure : Exposure, thecoverage : Coverage, isVerified : boolean, objStatus : String) %>
<%
var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper();
if (thecoverage != null) {
  var businessCoverageCode = typecodeMapper.getAliasByInternalCode( "CoverageType", "EDWChildBusinessCoverageCode", thecoverage.Type.Code);
  if (businessCoverageCode != null) {
%>

<% if (objStatus == "D") {%>
<% if (thecoverage.CoverageEBIInstExt != null) {%>
<Coverage>
    <PublicID><%=thecoverage.PublicID%></PublicID>
    <ObjectStatus>D</ObjectStatus>
    <VerifiedCoverage>
      <CoverageEBIInstExt><%=thecoverage.CoverageEBIInstExt%></CoverageEBIInstExt>
      <CoverageEBIExt><%=thecoverage.CoverageEBIExt%></CoverageEBIExt>
      <ClassCodeEBIInstExt><%=thecoverage.ClassCodeEBIInstExt%></ClassCodeEBIInstExt>
      <ClassCodeEBIExt><%=thecoverage.ClassCodeEBIExt%></ClassCodeEBIExt>
    </VerifiedCoverage>
</Coverage>
<%} else {%>
<Coverage>
  <PublicID><%=thecoverage.PublicID%>:<%=businessCoverageCode%></PublicID>
  <ObjectStatus>D</ObjectStatus>
</Coverage>
<%}%>
<%} else {%>
<% if (isVerified) {%>
<Coverage>
  <PublicID><%=thecoverage.PublicID%></PublicID>
  <ObjectStatus>E</ObjectStatus>
  <VerifiedCoverage>
    <CoverageEBIInstExt><%=thecoverage.CoverageEBIInstExt%></CoverageEBIInstExt>
    <CoverageEBIExt><%=thecoverage.CoverageEBIExt%></CoverageEBIExt>
    <ClassCodeEBIInstExt><%=thecoverage.ClassCodeEBIInstExt%></ClassCodeEBIInstExt>
    <ClassCodeEBIExt><%=thecoverage.ClassCodeEBIExt%></ClassCodeEBIExt>
  </VerifiedCoverage>
</Coverage>
<%} else {%>
<Coverage>
  <PublicID><%=thecoverage.PublicID%>:<%=businessCoverageCode%></PublicID>
  <ObjectStatus>E</ObjectStatus>
</Coverage>
<%}%>
<%}%>
<%}%>
<%}%>
