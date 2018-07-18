<% uses templates.messaging.edw.RiskAutoVehicleTemplate %>
<%@ params(theclaim : Claim, thepolicy : Policy, objStatus : String, eventName : String) %>
<%var riskCat = "<RiskCat><Code>VEH</Code><Description>VEHICLE</Description><ListName>EDWRiskType</ListName></RiskCat>"%>
<%
for (thedeletedrisk in thepolicy.getRemovedArrayElements("RiskUnits")) {
  if (thedeletedrisk typeis VehicleRU) {
  if (thedeletedrisk.Vehicle != null && thedeletedrisk.Vehicle.Style != "boat") {
%>
<%=RiskAutoVehicleTemplate.renderToString(theclaim, thedeletedrisk, objStatus, riskCat, eventName, "VEHICLE")%>
<%}%>
<%}%>
<%}%>

<%
for (therisk in thepolicy.Vehicles) {
  if (therisk.Vehicle != null && therisk.Vehicle.Style != "boat") {
%>
<%=RiskAutoVehicleTemplate.renderToString(theclaim, therisk, objStatus, riskCat, eventName, "VEHICLE")%>
<%}%>
<%}%>
