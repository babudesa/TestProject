<%
var claim = entityRoot;

for (association in claim.Associations) { 
%>
<%=templates.messaging.edw.AssociationDataEDW.renderToString(association, "A", "DataExtraction")%>|
<%}%>
