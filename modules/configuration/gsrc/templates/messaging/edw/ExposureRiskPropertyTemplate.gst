<% uses templates.messaging.edw.RiskEquinePropTemplate %>
<% uses util.gaic.EDW.EDWFunctionsFactory %>
<%@ params(exposure : Exposure, isVerified : boolean, typeCode : String, riskCat : String, objStatus : String) %>
<%
var riskF = EDWFunctionsFactory.getRiskFunctions();
var prop = exposure.FixedPropertyIncident.Property != null ? exposure.FixedPropertyIncident.Property : exposure.FixedPropertyIncident.PreviousPropertyExt.OriginalVersion as PolicyLocation;
var deletedpc = exposure.PreviousCoverageExt.OriginalVersion as Coverage;
var theIncidentRisk = riskF.getPropertyIncidentRU(prop, exposure.Claim.Policy);
%>
<% if (typeCode == "CCCOPS") {%>
<% if (exposure.FixedPropertyIncident != null && exposure.FixedPropertyIncident.Property != null) {%>
<%
riskCat = "<RiskCat><Code>ANIMAL</Code><Description>ANIMAL</Description><ListName>EDWRiskType</ListName></RiskCat>";
var oStatus = objStatus;
if (objStatus == "C" && exposure.FixedPropertyIncident.Property.New) {
  oStatus = "A"; 
}
var propertyPolLoc : PolicyLocation = null;
    
for (item in exposure.Claim.Properties) {
    if (item == exposure.FixedPropertyIncident.Property) {
      propertyPolLoc = item;
    }
}
    
%>
<%=RiskEquinePropTemplate.renderToString(exposure.Claim, propertyPolLoc, exposure, oStatus, riskCat, "", "exposure", "FPC")%>
<%}%>
<%} else {%>
<% if (objStatus == "D") {%>
<% if (theIncidentRisk != null) {%>
<% if (theIncidentRisk.Property.PhysicalPropertyEBIInstExt != null) {%>
<Risk>
  <PublicID><%=theIncidentRisk.PublicID%></PublicID>
  <ObjectStatus>D</ObjectStatus>
  <VerifiedRisk>
    <RiskEBIInstExt><%=theIncidentRisk.Property.PhysicalPropertyEBIInstExt%></RiskEBIInstExt>
    <RiskEBIExt><%=theIncidentRisk.Property.PhysicalPropertyEBIExt%></RiskEBIExt>
  </VerifiedRisk>
  <%=riskCat%>
</Risk>
<%} else {%>
<Risk>
  <PublicID><%=theIncidentRisk.PublicID%></PublicID>
  <ObjectStatus>D</ObjectStatus>
  <%=riskCat%>
</Risk>
<%}%>
<%} else if (deletedpc != null) {%>
<% if (deletedpc typeis PropertyCoverage) {%>
<% if (deletedpc.RiskUnit typeis LocationBasedRU) {%>
<% var deletedpublicid = (deletedpc.RiskUnit.Property.RiskTypeExt != null && (deletedpc.RiskUnit.Property.RiskTypeExt == "FRMLOC" || deletedpc.RiskUnit.Property.RiskTypeExt == "BLDG")) ? deletedpc.RiskUnit.PublicID + "." + deletedpc.RiskUnit.Property.RiskTypeExt : deletedpc.RiskUnit.PublicID; %>
<% if (deletedpc.RiskUnit.Property.PhysicalPropertyEBIExt != null) {%>
<Risk>
  <PublicID><%=deletedpublicid%></PublicID>
  <ObjectStatus>D</ObjectStatus>
  <VerifiedRisk>
    <RiskEBIInstExt><%=deletedpc.RiskUnit.Property.PhysicalPropertyEBIInstExt%></RiskEBIInstExt>
    <RiskEBIExt><%=deletedpc.RiskUnit.Property.PhysicalPropertyEBIExt%></RiskEBIExt>
  </VerifiedRisk>
</Risk>
<%} else {%>
<Risk>
  <PublicID><%=deletedpublicid%></PublicID>
  <ObjectStatus>D</ObjectStatus>
  <%=riskCat%>
</Risk>
<%}%>
<%}%>
<%}%>
<%}%>
<%} else {%>
<% if (theIncidentRisk != null && theIncidentRisk.Property != null && theIncidentRisk.Property.PublicID != null) {%>
<% if (theIncidentRisk.Property.PhysicalPropertyEBIExt != null) {%>
<Risk>
  <PublicID><%=theIncidentRisk.PublicID%></PublicID>
  <ObjectStatus>E</ObjectStatus>
  <VerifiedRisk>
    <RiskEBIInstExt><%=theIncidentRisk.Property.PhysicalPropertyEBIInstExt%></RiskEBIInstExt>
    <RiskEBIExt><%=theIncidentRisk.Property.PhysicalPropertyEBIExt%></RiskEBIExt>
  </VerifiedRisk>
</Risk>
<%} else {%>
<Risk>
  <PublicID><%=theIncidentRisk.PublicID%></PublicID>
  <ObjectStatus>E</ObjectStatus>
</Risk>
<%}%>
<%} else if (exposure.Coverage typeis PropertyCoverage) { var pc = exposure.Coverage; %>
<% if (pc.RiskUnit typeis LocationBasedRU) {%>
<% var thepublicid = (pc.RiskUnit.Property.RiskTypeExt != null && (pc.RiskUnit.Property.RiskTypeExt == "FRMLOC" || pc.RiskUnit.Property.RiskTypeExt == "BLDG" || pc.RiskUnit.Property.RiskTypeExt == "JOBSITE")) ? pc.RiskUnit.PublicID + "." + pc.RiskUnit.Property.RiskTypeExt : pc.RiskUnit.PublicID; %>
<% if (pc.RiskUnit.Property != null && pc.RiskUnit.Property.PhysicalPropertyEBIExt != null) {%>
<Risk>
  <PublicID><%=thepublicid%></PublicID>
  <ObjectStatus>E</ObjectStatus>
  <VerifiedRisk>
    <RiskEBIInstExt><%=pc.RiskUnit.Property.PhysicalPropertyEBIInstExt%></RiskEBIInstExt>
    <RiskEBIExt><%=pc.RiskUnit.Property.PhysicalPropertyEBIExt%></RiskEBIExt>
  </VerifiedRisk>
</Risk>
<%} else {%>
<Risk>
  <PublicID><%=thepublicid%></PublicID>
  <ObjectStatus>E</ObjectStatus>
</Risk>
<%}%>
<%}%>
<%}%>
<%}%>
<%}%>
