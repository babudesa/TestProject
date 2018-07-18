<% uses templates.messaging.edw.ExposureRiskPropertyTemplate %>
<% uses templates.messaging.edw.ExposureRiskVehicleTemplate %>
<% uses templates.messaging.edw.RiskAutoIncVehicleTemplate %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.RiskAutoIncTrailerTemplate %>
<%@ params(exposure : Exposure, isVerified : boolean, typeCode : String, riskCat : String, objStatus : String) %>
<% var theexposurecoverage = exposure.Coverage != null ? exposure.Coverage : exposure.PreviousCoverageExt.OriginalVersion as Coverage; %>
<% if (theexposurecoverage != null && theexposurecoverage typeis PolicyCoverage) {%>
<%
  var riskopstype = "";
  var theclaim = exposure.Claim;
  if (theclaim.BusinessLineExt != null and theclaim.BusinessLineExt == "AGRIPROPERTY"  and (typeCode == null or (typeCode != null and typeCode != "FPOPS"))) {
    riskopstype = theexposurecoverage.PublicID;
  } else if (exposure.Claim.Policy.PolicyType.Code != PolicyType.TC_AMP and exposure.Claim.Policy.PolicyType.Code != PolicyType.TC_AMO) {
    riskopstype = typeCode;
  }
  var riskpublicid = theclaim.PublicID + theexposurecoverage.Policy.PublicID + riskopstype;
%>
<% if (objStatus == "D") {%>
<% if (theexposurecoverage.OpsRiskEBIInstExt != null) {%>
<Risk>
  <PublicID><%=riskpublicid%></PublicID>    
  <ObjectStatus>D</ObjectStatus>
  <VerifiedRisk>
    <RiskEBIInstExt><%=theexposurecoverage.OpsRiskEBIInstExt%></RiskEBIInstExt>
    <RiskEBIExt><%=theexposurecoverage.OpsRiskEBIExt%></RiskEBIExt>
  </VerifiedRisk>
  <%=riskCat%>
</Risk>
<% } else { %>
<Risk>
  <PublicID><%=riskpublicid%></PublicID>    
  <ObjectStatus>D</ObjectStatus>
  <%=riskCat%>
</Risk>
<%}%>
<%} else {%>
<% if (isVerified) {%>
<Risk>
  <PublicID><%=riskpublicid%></PublicID>    
  <ObjectStatus>E</ObjectStatus>
  <VerifiedRisk>
    <RiskEBIInstExt><%=theexposurecoverage.OpsRiskEBIInstExt%></RiskEBIInstExt>
    <RiskEBIExt><%=theexposurecoverage.OpsRiskEBIExt%></RiskEBIExt>
  </VerifiedRisk>
</Risk>
<%} else {%>
<Risk>
  <PublicID><%=riskpublicid%></PublicID>
  <ObjectStatus>E</ObjectStatus>
</Risk>
<%}%>
<%}%>
<%}%>
<%=ExposureRiskPropertyTemplate.renderToString(exposure, isVerified, typeCode, riskCat, objStatus)%>
<%=ExposureRiskVehicleTemplate.renderToString(exposure, isVerified, typeCode, riskCat, objStatus)%>

<% if ((exposure.Claim.LossType == LossType.TC_AGRIAUTO || exposure.Claim.LossType == LossType.TC_ALTMARKETSAUTO || exposure.Claim.LossType == LossType.TC_SHSAUTO)) {%>
<% if ((exposure.ExposureType == ExposureType.TC_AB_PHYSICALDAMAGE
  && exposure.LossParty == LossPartyType.TC_INSURED
  && exposure.Coverage typeis PolicyCoverage ) 
  || (exposure.ExposureType == ExposureType.TC_AB_AUTOPROPDAM
  && ((exposure.LossParty == LossPartyType.TC_INSURED
  && exposure.Coverage typeis PolicyCoverage )
  || (exposure.LossParty == LossPartyType.TC_THIRD_PARTY)))) {%>
<% if (objStatus != "D" && exposure.VehicleIncident != null && exposure.VehicleIncident.Vehicle != null) {%>
<%

riskCat = "<RiskCat><Code>VEH</Code><Description>VEHICLE</Description><ListName>EDWRiskType</ListName></RiskCat>";
%>
<%=RiskAutoIncVehicleTemplate.renderToString(exposure.Claim, exposure.VehicleIncident.Vehicle, objStatus, riskCat, "", "VEHICLE", "")%>   
<%}%>
<%}%>
<%}%>
<%-- //for 8070 --%> 
<% if (exposure.Claim.LossType == LossType.TC_PIMINMARINE) {%>
<% if ((exposure.ExposureType == ExposureType.TC_IM_MOTORTRUCKCARGO && exposure.Coverage typeis PolicyCoverage))  {%>
<% if (objStatus != "D" && exposure.VehicleIncident != null && exposure.VehicleIncident.Vehicle != null) {%>
<%
riskCat = "<RiskCat><Code>VEH</Code><Description>VEHICLE</Description><ListName>EDWRiskType</ListName></RiskCat>";
%>
<%=RiskAutoIncVehicleTemplate.renderToString(exposure.Claim, exposure.VehicleIncident.Vehicle, objStatus, riskCat, "", "VEHICLE", "T")%>
<%=RiskAutoIncTrailerTemplate.renderToString(exposure, exposure.Claim, exposure.VehicleIncident.Vehicle, objStatus, riskCat, "", "VEHICLE_TL", "TL")%>
<%}%>
<%}%>
<%}%>