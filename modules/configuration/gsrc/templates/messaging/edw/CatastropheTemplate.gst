<% uses util.UniqueNumberGenerators %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(catastrophe : Catastrophe, objStatus : String, earliestdate : DateTime, latestdate : DateTime) %>
<Transaction>
  <CCTransactionTime><%=util.custom_Ext.DateTime.getTimeStamp()%></CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(catastrophe.LoadCommandID, catastrophe.CreateUser, catastrophe.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <%} else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <%}%>
  <Catastrophe>
    <PublicID><%=catastrophe.PublicID%></PublicID>		
    <ObjectStatus><%=objStatus%></ObjectStatus>

    <% if (catastrophe.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(catastrophe.CreateTime)%></CreateTime>
    <%}%>

    <% if (catastrophe.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(catastrophe.UpdateTime)%></UpdateTime>
    <%}%>

    <%var partyRelTo = "<PartyRelTo><PublicID>"+catastrophe.PublicID+"</PublicID><RelToType>Catastrophe</RelToType></PartyRelTo>"%>
    <Parties>
      <% if (catastrophe.CreateUser != null) { %>
	      <%=UserTemplate.renderToString(catastrophe.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>
      <% if (catastrophe.UpdateUser != null) { %>
	      <%=UserTemplate.renderToString(catastrophe.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
      <%}%>
    </Parties>

    <% if (catastrophe.BusinessCatNameExt   != null) {%>
    <BusinessCatNameExt><%=catastrophe.BusinessCatNameExt%></BusinessCatNameExt>
    <%}%>

    <% if (catastrophe.CatastropheNumber   != null) {%>
    <CatastropheNumber><%=catastrophe.CatastropheNumber%></CatastropheNumber>
    <%}%>

    <% if (catastrophe.Description   != null) {%>
    <Description><%=catastrophe.Description%></Description>
    <%}%>
    
    <% if (earliestdate != null) {%>
    <Ex_EarliestStartDate><%=earliestdate%></Ex_EarliestStartDate>
    <%} else if (catastrophe.Ex_EarliestStartDate    != null) {%>
    <Ex_EarliestStartDate><%=catastrophe.Ex_EarliestStartDate%></Ex_EarliestStartDate>
    <%}%>

    <% if (catastrophe.Ex_ISOCatNumber   != null) {%>
    <Ex_ISOCatNumber><%=catastrophe.Ex_ISOCatNumber%></Ex_ISOCatNumber>
    <%}%>

    <% if (latestdate != null) {%>
    <Ex_LatestEndDate><%=latestdate%></Ex_LatestEndDate>
    <%} else if (catastrophe.Ex_LatestEndDate   != null) {%>
    <Ex_LatestEndDate><%=catastrophe.Ex_LatestEndDate%></Ex_LatestEndDate>
    <%}%>

    <% if (catastrophe.Ex_Name   != null) {%>
    <Ex_Name><%=catastrophe.Ex_Name%></Ex_Name>
    <%}%>

    <% if (catastrophe.Ex_Year   != null) {%>
    <Ex_Year><%=catastrophe.Ex_Year%></Ex_Year>
    <%}%>

    <% if (catastrophe.Type   != null) {%>
    <%=TypeListTemplate.renderToString(catastrophe.Type, "Type", catastrophe.Type.ListName)%>
    <%}%>
  </Catastrophe>
</Transaction>