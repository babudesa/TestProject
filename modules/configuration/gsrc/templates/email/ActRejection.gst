<%@ params(Activity : Activity) %>
<html> 

<body> 
<% uses java.text.SimpleDateFormat %>
<% uses java.text.DecimalFormat %>
<H1>Activity Notification</H1> 

 

The following activity assigned to you has been rejected by <%= Activity.CloseUser.toString() %>  on <%= (new SimpleDateFormat("M-d-yyyy")).format(gw.api.util.DateUtil.currentDate())%></br></br>

Claim: <b><%= Activity.Claim.ClaimNumber %></b></br>

<% for(trans in Activity.TransactionSet.AllTransactions){%>
Reserve Line: <b><%= trans.ReserveLine.toString() %></b></br>
Payment/Reserve Amount: $<b><%=(new DecimalFormat("###,####,##0.00")).format(trans.Amount)%></b></br>

<%
}
%>

Action Taken:  <b><%= Activity.ApprovalRationale %></b></br>
Check Number:  <b><%= Activity.getApprovalCheckNumber () %></b></br>
Claimant:  <b><%= Activity.Exposure.Claimant %></b></br>

</body></html>