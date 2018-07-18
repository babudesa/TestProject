<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(primcheck : Check, objStatus : String) %>
<Transaction>
  <CCTransactionTime><%=util.custom_Ext.DateTime.getTimeStamp()%></CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(primcheck.CheckSet.LoadCommandID, primcheck.CheckSet.Recurrence.CreateUser.CreateUser, primcheck.CheckSet.Recurrence.CreateUser.UpdateUser))  {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>	
  <%if (primcheck.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=primcheck.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (primcheck.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=primcheck.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (primcheck.Claim.LossType != null) {%>
  <TransactionLossType><%=primcheck.Claim.LossType%></TransactionLossType>
  <%}%>
  <PaymentSchedule>
    <PublicID><%=primcheck.CheckSet.Recurrence.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (primcheck.CheckSet.Recurrence.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(primcheck.CheckSet.Recurrence.CreateTime)%></CreateTime> 
    <%}%>
    <% if (primcheck.CheckSet.Recurrence.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(primcheck.CheckSet.Recurrence.UpdateTime)%></UpdateTime> 
    <%}%>
    <% if (primcheck.CheckSet.Claim != null && primcheck.CheckSet.Claim.PublicID != null) {%>
    <RelToClaim><%=primcheck.CheckSet.Claim.PublicID%></RelToClaim>
    <%}%>

    <% if (primcheck.CheckSet.Recurrence typeis WeeklyCheckRecurrence) {%>
        <RecurrencePattern>
           <Code>WeeklyCheckRecurrence</Code>
           <Description>WeeklyCheckRecurrence</Description>
           <ListName>checkrecurrence</ListName>
        </RecurrencePattern>  
        <%  if (primcheck.CheckSet.Recurrence.WeeklyFrequency != null)  {%>  
          <RecurWeeklyFrequency><%=primcheck.CheckSet.Recurrence.WeeklyFrequency%></RecurWeeklyFrequency> 
        <%}%>    
    <%}%>    
    
    <% if (primcheck.CheckSet.Recurrence typeis MonthlyCheckRecurrence) {%>
        <RecurrencePattern>
           <Code>MonthlyCheckRecurrence</Code>
           <Description>MonthlyCheckRecurrence</Description>
           <ListName>checkrecurrence</ListName>
        </RecurrencePattern>
        <% if (primcheck.CheckSet.Recurrence.MonthlyFrequency != null) {%>
          <RecurMonthlyFrequency><%=primcheck.CheckSet.Recurrence.MonthlyFrequency%></RecurMonthlyFrequency> 
        <%}%>
        <% if (primcheck.CheckSet.Recurrence.RecurrenceDate != null) {%>
          <RecurrenceDate><%=primcheck.CheckSet.Recurrence.RecurrenceDate%></RecurrenceDate> 
        <%}%>      
        <% if (primcheck.CheckSet.Recurrence.RecurrenceWeek != null) {%>
          <%=TypeListTemplate.renderToString(primcheck.CheckSet.Recurrence.RecurrenceWeek, "RecurrenceWeek", primcheck.CheckSet.Recurrence.RecurrenceWeek.ListName)%>
        <%}%>      
    <%}%>
    
    <% if (primcheck.CheckSet.Recurrence.RecurrenceDay != null) {%>
      <%=TypeListTemplate.renderToString(primcheck.CheckSet.Recurrence.RecurrenceDay, "RecurrenceDay", primcheck.CheckSet.Recurrence.RecurrenceDay.ListName)%> 
    <%}%>      
    <% if (primcheck.CheckSet.Recurrence.IssuanceDateOffset != null) {%>
      <RecurIssuanceDateOffset><%=primcheck.CheckSet.Recurrence.IssuanceDateOffset%></RecurIssuanceDateOffset> 
    <%}%>       
    <% if (primcheck.CheckSet.Recurrence.FirstDueDate != null) {%>
      <RecurFirstDueDate><%=primcheck.CheckSet.Recurrence.FirstDueDate%></RecurFirstDueDate> 
    <%}%>  
    <% if (primcheck.CheckSet.Recurrence.NumChecks != null) {%>
      <RecurNumChecks><%=primcheck.CheckSet.Recurrence.NumChecks%></RecurNumChecks> 
    <%}%> 
    <% if (primcheck.CheckSet.Recurrence.ChecksRemainingExt != null) {%>
      <RecurChecksRemainingExt><%=primcheck.CheckSet.Recurrence.ChecksRemainingExt%></RecurChecksRemainingExt> 
    <%}%>   
   
    <% if (primcheck.isRecurrenceActive != null) {%>
      <RecurrenceActive><%=primcheck.isRecurrenceActive%></RecurrenceActive> 
    <%}%>  
    <% if (primcheck.CheckSet.Recurrence.CreateUser != null or primcheck.CheckSet.Recurrence.UpdateUser != null) { %>
      <%var partyRelTo = "<PartyRelTo><PublicID>"+primcheck.CheckSet.Recurrence.PublicID+"</PublicID><RelToType>CheckRecurrence</RelToType></PartyRelTo>"%>
      <Parties>
        <% if (primcheck.CheckSet.Recurrence.CreateUser != null) { %>
          <%=UserTemplate.renderToString(primcheck.CheckSet.Recurrence.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
        <%}%>

        <% if ((primcheck.CheckSet.Recurrence.UpdateUser != null) ) { %>
          <%=UserTemplate.renderToString(primcheck.CheckSet.Recurrence.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
        <%}%>
    <%}%>    
    </Parties> 
    
  </PaymentSchedule>
</Transaction>