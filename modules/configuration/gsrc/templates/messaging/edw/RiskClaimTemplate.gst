<% uses templates.messaging.edw.RiskEquinePropTemplate %>
<% uses util.gaic.EDW.EDWFunctionsFactory %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(theclaim : Claim, objStatus : String, exposure : Exposure, eventName : String) %>
<%
var thepolicy = theclaim.Policy;
var riskCat = "<RiskCat><Code>ANIMAL</Code><Description>ANIMAL</Description><ListName>EDWRiskType</ListName></RiskCat>";
var riskF = EDWFunctionsFactory.getRiskFunctions();
%>
<%
if (theclaim.LoadCommandID != null) { 
  var incObjStatus = objStatus;
  var policyInjAnimal = false; 
  if ((theclaim.FixedPropertyIncidentsOnly != null) && (theclaim.FixedPropertyIncidentsOnly.length != 0)) {
    for (inc in theclaim.FixedPropertyIncidentsOnly ) {
      policyInjAnimal = false;
      if (inc.Property.LoadCommandID != null) {
        if (theclaim.Policy.Properties != null && theclaim.Policy.Properties.length != 0) {
          for ( var therisk in theclaim.Policy.Properties ) { 
            if (inc.Property.PublicID == therisk.Property.PublicID) {
              policyInjAnimal = true;
            }
          }
        }
        if (!policyInjAnimal) {
          if (objStatus == "C" and inc.Property.New and theclaim.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(theclaim.LoadCommandID, theclaim.CreateUser, theclaim.UpdateUser)) {
            incObjStatus = "A";
          }
%>
<%=RiskEquinePropTemplate.renderToString(theclaim, inc.Property, null, incObjStatus, riskCat, eventName, "claim", "")%>
<%}%>
<%}%>
<%}%>
<%}%> 
<%
  for (deletedinc in theclaim.getRemovedArrayElements("Incidents")) {
    if (deletedinc typeis FixedPropertyIncident) {
    var inc = deletedinc as FixedPropertyIncident;
    policyInjAnimal = false;
    if (inc.Property.LoadCommandID != null) {
      if (theclaim.Policy.Properties != null && theclaim.Policy.Properties.length != 0) { 
        for ( var therisk in theclaim.Policy.Properties ) { 
          if (inc.Property.PublicID == therisk.Property.PublicID) {
            policyInjAnimal = true;
          }
        }
      }
      if (!policyInjAnimal) {
        for (prop in (theclaim.OriginalVersion as Claim).Policy.Properties) {
          if (inc.Property.PublicID == prop.PublicID) { 
            policyInjAnimal = true;
          }
        }
      }
      if (!policyInjAnimal) {
        incObjStatus = "D";
%>
<%=RiskEquinePropTemplate.renderToString(theclaim, inc.Property, null, "D", riskCat, eventName, "claim", "")%>
<%}%>
<%}%> 
<%}%> 
<%}%>   
<%}%>  