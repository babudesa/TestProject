<%@ params(c : Claim) %>
<html>
	<head>
		<style type="text/css">
		td.header {font-family:verdana;font-size:12;font-weight:bold}
		td.label {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
		td.value {font-family:verdana;font-size:10;text-align:left}
		p.value {font-family:verdana;font-size:10;text-align:left}
		</style>
	</head>
	
	<body> 	
	<%		
		var sender = "" 
		var recipient = ""
	
		  if(User.util.getCurrentUser() != null){
		  sender = User.util.getCurrentUser();
		}
		if(c.LossType == LossType.TC_ENVLIAB){
		  if(c.AssignedUser.DisplayName != null){
		  recipient = c.AssignedUser.DisplayName;
		}else{
		  recipient = "&#60No Claim Owner Indicated&#62";
		}
		}
	%>
	
		<table>
			<tr>
				<td class=header>Notice of Closed Claim</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
		</table>
			
		<table>
			<%if (c.LossType != LossType.TC_ENVLIAB) {%>
			<tr>
				<td class=label>To:</td>
				<td class=value><%= c.Policy.underwriter == null ? "&#60No Underwriter Indicated&#62": 
				  c.Policy.underwriter %>&#59 <%= c.Policy.ex_Agency == null ? "&#60No Agent Identified&#62": c.Policy.ex_Agency %> 
				</td>
			</tr>
			<%} else {%>
			<tr>
				<td class=label>To:</td>
				<td class=value><%= recipient %></td>
			</tr>
			<%}%>
			<tr>
				<td class=label>From:</td>
				<td class=value><%= sender %></td>
			</tr>			
		</table>
					
		<p class=value>The following claim has been closed.</p>
				
		<table>
			<tr>
				<td class=label>Claim Number:</td>
				<td class=value><%= c.ClaimNumber %></td>
			</tr>
			<tr><br></tr>
			<tr>
				<td class=label>Insured Name:</td>
				<td class=value><%= c.Insured %></td>
			</tr>
			<tr>
				<td class=label>Policy Number:</td>
				<td class=value><%= c.Policy.PolicyNumber %></td>
			</tr>
			<tr>
				<td class=label>Policy Mod:</td>
				<td class=value><%= c.Policy.PolicySuffix %></td>
			</tr>
			<tr>
				<td class=label>Policy Expiration Date:</td>
				<td class=value><%= gw.api.util.StringUtil.formatDate( c.Policy.ExpirationDate, "MM-dd-yyyy" ) %></td>
			</tr>
			<tr>
				<td class=label>Producer Name:</td>
				<td class=value><%= c.Policy.ex_Agency == null ? "": c.Policy.ex_Agency %></td>
			</tr>
			<tr><br></tr>
			<tr>
				<td class=label>Date of Loss:</td>
				<td class=value><%= gw.api.util.StringUtil.formatDate( c.LossDate, "MM-dd-yyyy" ) %></td>
			</tr>
			<tr>
				<td class=label>Date Reported:</td>
				<td class=value><%= gw.api.util.StringUtil.formatDate( c.ReportedDate, "MM-dd-yyyy" ) %></td>
			</tr>
			<tr><br></tr>
			<tr>
				<td class=label>Loss Description:</td>
				<td class=value><%= c.Description == null? "": c.Description %></td>
			</tr>
			<tr><br></tr>
			<tr>
				<td class=label>Closed Date:</td>
				<td class=value><%= gw.api.util.StringUtil.formatDate( c.CloseDate, "MM-dd-yyyy" )  %></td>
			</tr>
			<tr>
				<td class=label>Paid Loss:</td>
				
				<td class=value><%= (gw.api.financials.FinancialsCalculationUtil.getTotalPayments().getAmount(c, CostType.TC_CLAIMCOST, CostCategory.TC_UNSPECIFIED ) == null) ? "$0.00" : 
				  gw.api.util.StringUtil.formatNumber(gw.api.financials.FinancialsCalculationUtil.getTotalPayments().getAmount(c, CostType.TC_CLAIMCOST, CostCategory.TC_UNSPECIFIED), "$#,##0.00") %>
				
			</tr>
			<tr>
				<td class=label>Paid Expense:</td>
				<td class=value><%= (gw.api.financials.FinancialsCalculationUtil.getTotalPayments().getAmount(c, CostType.TC_EXPENSE, CostCategory.TC_UNSPECIFIED ) == null) ? "$0.00" : 
				  gw.api.util.StringUtil.formatNumber(gw.api.financials.FinancialsCalculationUtil.getTotalPayments().getAmount(c, CostType.TC_EXPENSE, CostCategory.TC_UNSPECIFIED), "$#,##0.00") %>
				</td>
			</tr>
			<tr>
				<td class=label>Recoveries:</td>
				<td class=value><%= gw.api.util.StringUtil.formatNumber( c.ClaimRpt.TotalRecoveries, "$#,##0.00" ) %></td>
			</tr>
		</table> 
		<%if (c.LossType != LossType.TC_ENVLIAB) {%>
		<p class=value>*Expenses are as of closed date, there may be additional expenses. Contact the<br>adjuster <%= c.AssignedUser.DisplayName %> if you have further questions.</p>
<%}%>

	</body>
</html>