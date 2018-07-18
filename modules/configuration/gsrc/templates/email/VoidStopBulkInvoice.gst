<%@ params(theBulkInvoice : BulkInvoice, action : String) %>

<%var user : User = com.guidewire.cc.plugin.util.CurrentUserUtil.getCurrentUser().getUser()%>
<br>
<%=user%> has requested check number <%=theBulkInvoice.CheckNumber%> in the amount of $<%=theBulkInvoice.TotalAmountOfAllApprovedInvoiceItems%> be <%=action%>.
<p><u>BulkInvoice Details:</u><br>
Check Number: <%=theBulkInvoice.CheckNumber%><br>
BulkInvoice Total: $<%=theBulkInvoice.TotalAmountOfAllApprovedInvoiceItems%><br>
Invoice Date: <%=theBulkInvoice.ScheduledSendDate%><br>
Payee Name: <%=theBulkInvoice.PayTo%><br>