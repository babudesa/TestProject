<% uses templates.messaging.edw.ClaimDataEDW %>
<%
var claim = entityRoot;
var claimData2 = "" ; 

if (claim.State == "closed") { 
	claimData2 = ClaimDataEDW.renderToString(claim, "A", "open", "DataExtraction") ; 
}

var claimData = ClaimDataEDW.renderToString(claim, (claim.State == "closed" ? "C" : "A"), "Actual", "DataExtraction") ; 

if (claim.State == "closed") { 
%>
<%=claimData2%>|<%=claimData%>
<%
} else { 
%> 
<%=claimData%>
<%}%>