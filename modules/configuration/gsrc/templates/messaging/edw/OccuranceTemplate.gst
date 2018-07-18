<% uses util.UniqueNumberGenerators %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(occurrence : Ex_CatOccurance, objStatus : String) %>
<Transaction>
  <CCTransactionTime><%=util.custom_Ext.DateTime.getTimeStamp()%></CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(occurrence.LoadCommandID, occurrence.CreateUser, occurrence.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <%} else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <%}%>		

  <Occurrence>
    <relatedToCatastrophe><%=occurrence.Catastrophe.PublicID%></relatedToCatastrophe>
    <PublicID><%=occurrence.PublicID%></PublicID>		
    <ObjectStatus><%=objStatus%></ObjectStatus>

    <% if (occurrence.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(occurrence.CreateTime)%></CreateTime>
    <%}%>

    <% if (occurrence.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(occurrence.UpdateTime)%></UpdateTime>
    <%}%>
    
    <%var partyRelTo = "<PartyRelTo><PublicID>"+occurrence.PublicID+"</PublicID><RelToType>Occurrence</RelToType></PartyRelTo>"%>
    <Parties>
     <% if ((occurrence.CreateUser != null) ) { %>
      <%=UserTemplate.renderToString(occurrence.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>

      <% if ((occurrence.UpdateUser != null) ) { %>
      <%=UserTemplate.renderToString(occurrence.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
      <%}%>
    </Parties>

    <% if (occurrence.EndDate   != null) {%>
    <EndDate><%=occurrence.EndDate%></EndDate>
    <%}%>

    <% if (occurrence.StartDate   != null) {%>
    <StartDate><%=occurrence.StartDate%></StartDate>
    <%}%>

    <% if (occurrence.State   != null) {%>
    <%=TypeListTemplate.renderToString(occurrence.State, "State", occurrence.State.ListName)%>
    <%}%>
  </Occurrence>
</Transaction>