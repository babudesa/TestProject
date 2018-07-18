<Transaction>
	<CCTransactionTime>
	<%=util.custom_Ext.DateTime.getTimeStamp()%>
	</CCTransactionTime>
	<uniqueID><%=Libraries.UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
	<%
	var thegroup = entityRoot;
	var date = "<EffectiveDate>" + java.util.GregorianCalendar.getInstance().getTime() + "</EffectiveDate>" as String;
	%>
	<%=templates.dataextraction.edw.GroupData.renderToString(thegroup, "A", date)%>
	<%@ params(thegroup : Group, objStatus : String, date : String) %>
</Transaction>
