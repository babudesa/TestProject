<%
var claim = entityRoot;

uses gw.api.database.Query;
var reserveQuery = Query.make(Reserve);
var reserves = reserveQuery.compare("Claim", Equals, claim).select().toList();
var recoveryQuery = Query.make(Recovery);
var recoveries = recoveryQuery.compare("Claim", Equals, claim).select().toList();
var recoveryReserveQuery = Query.make(RecoveryReserve);
var recoveryReserves = recoveryReserveQuery.compare("Claim", Equals, claim).select().toList();
%>
<% for (reserve in reserves) {%>
<%=templates.messaging.edw.ReserveDataEDW.renderToString(reserve, "A", "DataExtraction")%>|
<%}%>
<% for (recovery in recoveries) {%>
<%=templates.messaging.edw.RecoveryDataEDW.renderToString(recovery, "A", "DataExtraction")%>|
<%}%>
<% for (recoveryReserve in recoveryReserves) {%>
<%=templates.messaging.edw.RecoveryReserveDataEDW.renderToString(recoveryReserve, "A", "DataExtraction")%>|
<%}%>
