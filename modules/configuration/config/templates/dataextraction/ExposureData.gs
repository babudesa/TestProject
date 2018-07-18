<% uses templates.messaging.edw.ExposureDataEDW %>
<%
var exposure = entityRoot;

if (exposure.Claim != null && !exposure.Claim.IncidentReport) {
	var exposureData2 = "" ; 
	if (exposure.State == "closed") {
		exposureData2 = ExposureDataEDW.renderToString(exposure, "open", "A", "DataExtraction") ; 
	}
	
	var exposureData = ExposureDataEDW.renderToString(exposure, "Actual", (exposure.State == "closed" ? "C" : "A"), "DataExtraction") ;
	
	if (exposure.State == "closed") {
%>
	<%=exposureData2%>|<%=exposureData%>
	<%
	} else { 
	%> 
	<%=exposureData%>
	<%}%>
<%}%>
