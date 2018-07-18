<% uses templates.messaging.edw.RiskWatercraftBoatTemplate %>
<% uses templates.messaging.edw.RiskWatercraftTrailerTemplate %>
<% uses templates.messaging.edw.RiskWatercraftEngineTemplate %>
<%@ params(theclaim : Claim, thepolicy : Policy, objStatus : String, eventName : String) %>
<% for ( thedeletedrisk in thepolicy.getRemovedArrayElements("RiskUnits") ) {%>
<% if (thedeletedrisk typeis VehicleRU) {%>
<% if (thedeletedrisk.Vehicle != null and thedeletedrisk.Vehicle.Style == "boat") {%>
<%=RiskWatercraftBoatTemplate.renderToString(theclaim, null, thedeletedrisk, "D", displaykey.EDW.Templates.BoatRiskCategory, eventName, "BOAT")%>

<% if (thedeletedrisk.Vehicle.TrailerExt != null) {%>
<%=RiskWatercraftTrailerTemplate.renderToString(theclaim, thedeletedrisk, thedeletedrisk.Vehicle.TrailerExt, "D", displaykey.EDW.Templates.TrailerRiskCategory, eventName, "TRAIL")%>
<%}%>

<% for (engine in thedeletedrisk.Vehicle.EnginesExt) {%>
<%=RiskWatercraftEngineTemplate.renderToString(theclaim, thedeletedrisk, engine, "D", displaykey.EDW.Templates.EngineRiskCategory, eventName, "ENGMTR")%>
<%}%>

<%}%>
<%}%>
<%}%>

<% for ( therisk in thepolicy.Vehicles ) { %>
	<% if (therisk.Vehicle != null and therisk.Vehicle.Style == "boat") { %>
		<%=RiskWatercraftBoatTemplate.renderToString(theclaim, null, therisk, objStatus, displaykey.EDW.Templates.BoatRiskCategory, eventName, "BOAT")%>
	
		<% if (therisk.Vehicle.TrailerExt != null) {%>
		<%=RiskWatercraftTrailerTemplate.renderToString(theclaim, therisk, therisk.Vehicle.TrailerExt, objStatus, displaykey.EDW.Templates.TrailerRiskCategory, eventName, "TRAIL")%>
		<%}%>
		
		<% for (engineitem in therisk.Vehicle.getRemovedArrayElements("EnginesExt")) {%>
		<%var deletedengine = engineitem as EngineExt%>
		<%=RiskWatercraftEngineTemplate.renderToString(theclaim, therisk, deletedengine, "D", displaykey.EDW.Templates.EngineRiskCategory, eventName, "ENGMTR")%>
		<%}%>
		
		<% for (engine in therisk.Vehicle.EnginesExt) {%>
		<%=RiskWatercraftEngineTemplate.renderToString(theclaim, therisk, engine, objStatus, displaykey.EDW.Templates.EngineRiskCategory, eventName, "ENGMTR")%>
		<%}%>
	<%}%>
<%}%>
