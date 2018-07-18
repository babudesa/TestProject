<%
var claim = entityRoot; 

uses gw.api.database.Query
var aQuery = Query.make(Check)
aQuery.compare("Claim", Equals, claim)
var checks : java.util.List<Check> = aQuery.select().toList()

for ( check in checks ) {
	for ( payment in check.Payments ) {
%>
<%=templates.messaging.edw.CheckPaymentDataEDW.renderToString(check, payment, "A", "DataExtraction")%>|
<%}%>
<%}%>
