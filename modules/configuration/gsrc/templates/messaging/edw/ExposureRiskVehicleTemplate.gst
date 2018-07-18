<%@ params(exposure : Exposure, isVerified : boolean, typeCode : String, riskCat : String, objStatus : String) %>
<% if (exposure != null) {%>
<%var thecoverage = objStatus != "D" ? exposure.Coverage : exposure.PreviousCoverageExt.OriginalVersion as Coverage%>
<% if (thecoverage typeis VehicleCoverage && thecoverage.RiskUnit typeis VehicleRU) {%>
<%
var therisk = thecoverage.RiskUnit;
var boatIndicator:boolean = (therisk.Vehicle != null && thecoverage.EngineExt == null && thecoverage.TrailerExt == null) ? true : false;
var engineIndicator:boolean = (thecoverage.EngineExt != null) ? true : false;
var trailerIndicator:boolean = (thecoverage.TrailerExt != null) ? true : false;
var vehicleStyle:String = (therisk.Vehicle != null and therisk.Vehicle.Style != null and therisk.Vehicle.Style == "boat") ? ":BOAT" : ":VEHICLE";
%>
<% if (objStatus == "D") {%>
<% if (thecoverage != null) {%>
<% if (thecoverage.EngineExt == null && thecoverage.TrailerExt == null) {%>
<% if (therisk.Vehicle != null && therisk.Vehicle.VehicleEBIExt != null) {%>
<Risk>
    <PublicID><%=therisk.Vehicle.PublicID%>:<%=exposure.Claim.ClaimNumber%><%=vehicleStyle%></PublicID>
    <ObjectStatus>D</ObjectStatus>
    <VerifiedRisk>
        <RiskEBIInstExt><%=therisk.Vehicle.VehicleEBIInstExt%></RiskEBIInstExt>
        <RiskEBIExt><%=therisk.Vehicle.VehicleEBIExt%></RiskEBIExt>
    </VerifiedRisk>
</Risk>
<%} else {%>
<Risk>
    <PublicID><%=therisk.Vehicle.PublicID%>:<%=exposure.Claim.ClaimNumber%><%=vehicleStyle%></PublicID>
    <ObjectStatus>D</ObjectStatus>
    <%=riskCat%>
</Risk>
<%}%>
<%} else if (thecoverage.EngineExt != null) {%>
<% if (thecoverage.EngineExt.EngineEBIExt != null) {%>
<Risk>
    <PublicID><%=thecoverage.EngineExt.PublicID%>:<%=exposure.Claim.ClaimNumber%>:ENGMTR</PublicID>
    <ObjectStatus>D</ObjectStatus>
    <VerifiedRisk>
        <RiskEBIInstExt><%=thecoverage.EngineExt.EngineEBIInstExt%></RiskEBIInstExt>
        <RiskEBIExt><%=thecoverage.EngineExt.EngineEBIExt%></RiskEBIExt>
    </VerifiedRisk>
</Risk>
<%} else {%>
<Risk>
    <PublicID><%=thecoverage.EngineExt.PublicID%>:<%=exposure.Claim.ClaimNumber%>:ENGMTR</PublicID>
    <ObjectStatus>D</ObjectStatus>
    <%=riskCat%>
</Risk>
<%}%>
<%} else if (thecoverage.TrailerExt != null) {%>
<% if (thecoverage.TrailerExt.TrailerEBIExt != null) {%>
<Risk>
    <PublicID><%=thecoverage.TrailerExt.PublicID%>:<%=exposure.Claim.ClaimNumber%>:TRAIL</PublicID>
    <ObjectStatus>D</ObjectStatus>
    <VerifiedRisk>
        <RiskEBIInstExt><%=thecoverage.TrailerExt.TrailerEBIInstExt%></RiskEBIInstExt>
        <RiskEBIExt><%=thecoverage.TrailerExt.TrailerEBIExt%></RiskEBIExt>
    </VerifiedRisk>
</Risk>
<%} else {%>
<Risk>
    <PublicID><%=thecoverage.TrailerExt.PublicID%>:<%=exposure.Claim.ClaimNumber%>:TRAIL</PublicID>
    <ObjectStatus>D</ObjectStatus>
    <%=riskCat%>
</Risk>
<%}%>
<%}%>
<%}%>
<%} else if (isVerified) {%>
<% if (boatIndicator) {%>
<Risk>
	<PublicID><%=thecoverage.RiskUnit.Vehicle.PublicID%>:<%=thecoverage.Policy.Claim.ClaimNumber%><%=vehicleStyle%></PublicID>
	<ObjectStatus>E</ObjectStatus>
	<VerifiedRisk>
		<RiskEBIInstExt><%=thecoverage.RiskUnit.Vehicle.VehicleEBIInstExt%></RiskEBIInstExt>
		<RiskEBIExt><%=thecoverage.RiskUnit.Vehicle.VehicleEBIExt%></RiskEBIExt>
	</VerifiedRisk>
</Risk>
<%} else if (trailerIndicator) {%>
<Risk>
	<PublicID><%=thecoverage.TrailerExt.PublicID%>:<%=thecoverage.Policy.Claim.ClaimNumber%>:TRAIL</PublicID>
	<ObjectStatus>E</ObjectStatus>
	<VerifiedRisk>
		<RiskEBIInstExt><%=thecoverage.TrailerExt.TrailerEBIInstExt%></RiskEBIInstExt>
		<RiskEBIExt><%=thecoverage.TrailerExt.TrailerEBIExt%></RiskEBIExt>
	</VerifiedRisk>
</Risk>
<%} else if (engineIndicator) {%>
<Risk>
	<PublicID><%=thecoverage.EngineExt.PublicID%>:<%=thecoverage.Policy.Claim.ClaimNumber%>:ENGMTR</PublicID>
	<ObjectStatus>E</ObjectStatus>
	<VerifiedRisk>
		<RiskEBIInstExt><%=thecoverage.EngineExt.EngineEBIInstExt%></RiskEBIInstExt>
		<RiskEBIExt><%=thecoverage.EngineExt.EngineEBIExt%></RiskEBIExt>
	</VerifiedRisk>
</Risk>
<%}%>
<%} else {%>
<% if (boatIndicator) {%>
<Risk>
	<PublicID><%=therisk.Vehicle.PublicID%>:<%=thecoverage.Policy.Claim.ClaimNumber%><%=vehicleStyle%></PublicID>
	<ObjectStatus>E</ObjectStatus>
</Risk>
<%} else if (trailerIndicator) {%>
<Risk>
	<PublicID><%=thecoverage.TrailerExt.PublicID%>:<%=thecoverage.Policy.Claim.ClaimNumber%>:TRAIL</PublicID>
	<ObjectStatus>E</ObjectStatus>
</Risk>
<%} else if (engineIndicator) {%>
<Risk>
	<PublicID><%=thecoverage.EngineExt.PublicID%>:<%=thecoverage.Policy.Claim.ClaimNumber%>:ENGMTR</PublicID>
	<ObjectStatus>E</ObjectStatus>
</Risk>
<%}%>
<%}%>
<%}%>
<%}%>
