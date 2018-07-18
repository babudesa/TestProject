<%@ params(Activity : Activity) %>
<html> 

<body> 

<H1>Payment Approval Notification</H1> 

 

The following payment has been approved</br></br>

 

Claim: <b><%= Activity.Claim.ClaimNumber %></b></br>

Claimant: <b><%= Activity.Claim.claimant.FirstName %><%= Activity.Claim.claimant.LastName %></b>


</body></html>