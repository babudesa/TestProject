<% uses java.lang.Double %>
<%@ params(Activity : Activity) %>

<html>
	<head>
		<style type="text/css">
			td.header {font-family:verdana;font-size:12;font-weight:bold}
			td.label {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
			td.value {font-family:verdana;font-size:10;text-align:left}
		</style>
	</head>
	<body> 
	
		<%
		var recipient = ""
		var sender = ""
		var checkNumber = ""
		var payeeName = ""
		var transType = ""
		var transFormat = ""
		var transAmount:Double = 0	
		
		
		
		if(Activity.AssignedUser != null){
		  recipient = Activity.AssignedUser.DisplayName;		
		}
		
		if(User.util.getCurrentUser() != null){
		  sender = User.util.getCurrentUser().toString();		  
		}
		
				
		if(Activity.TransactionSet.Subtype =="CheckSet"){	
		   
		  transType = "check";
  		  var trans = (Activity.TransactionSet as CheckSet);
  
  		  if(trans.PrimaryCheck != null){
  			transAmount = (trans.PrimaryCheck.NetAmount.Amount as Double)
  			
  			//transAmount = Libraries.Utilities.getCheckNetAmountRendered(trans.PrimaryCheck)
  		  }
  		  if(trans.PrimaryCheck.CheckNumber != null){
  			checkNumber = trans.PrimaryCheck.CheckNumber
  			
  		  }
  		  if(trans.PrimaryCheck.PayTo != null){
  			payeeName = trans.PrimaryCheck.PayTo
  		
  		  }
		}
		if(Activity.TransactionSet.Subtype =="ReserveSet"){
		  
		  transType = "reserve";
		  for(trans in Activity.TransactionSet.AllTransactions){
                    if(trans.Amount != null){
                      transAmount = transAmount + (trans.Amount as Double)
                    }
                  }
		  //if(Activity.TransactionSet.Amount != null){
		  //  transAmount = Activity.TransactionSet.Amount.toString();
		  //}
		}
		//transAmount = transAmount.replace("$", " ");
		//transAmount = transAmount.trim();
		if(transAmount >= 0){
		  transFormat = gw.api.util.StringUtil.formatNumber( transAmount, "$#,##0.00" );
		}else{
		  transFormat = gw.api.util.StringUtil.formatNumber( (-transAmount), "($-#,##0.00)" );
		}
		 
		%>
		
		<table>	
			<tr>
				<td class=header>Approval Activity Notification</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>
					<table>
						<tr>
							<td class=label>To:</td>
							<td class=value><%= recipient %></td>
						</tr>
						<tr>
							<td class=label>From:</td>
							<td class=value><%= sender %></td>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td class=value><p>The following claim has a <%= transType  %> that requires your review and approval.</p></td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>		 
					<table>
						<tr>
							<td class=label>Claim Number:</td>
							<td class=value><%= Activity.Claim.ClaimNumber %></td>
						</tr>
						<tr>
							<td class=label>Check Number:</td>
							<td class=value><%= checkNumber %></td>
						</tr>
						<tr>
							<td class=label>Transaction Amount:</td>
							<td class=value><%= transFormat %></td>
						</tr>
						<tr>
							<td class=label>Payee Name:</td>
							<td class=value><%= payeeName %></td>
						</tr>
						<tr>
							<td class=label>Insured Name:</td>
							<td class=value><%= Activity.Claim.Insured %></td>
						</tr>
						<tr>
							<td class=label>Adjuster:</td>
							<td class=value><%= Activity.Claim.AssigneeDisplayString %></td>
						</tr>
					</table> 
				</td>
			</tr>
		</table>	
	</body>
</html>