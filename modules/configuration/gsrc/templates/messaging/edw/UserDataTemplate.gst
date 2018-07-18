<% uses util.UniqueNumberGenerators %>
<% uses templates.dataextraction.edw.UserData %>
<%@ params(user : User, objStatus : String, date : String, role : String) %>
<CCTransactionTime>
<%=util.custom_Ext.DateTime.getTimeStamp()%>
</CCTransactionTime>
<uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>

<%=UserData.renderToString(user, objStatus, date, role)%>
