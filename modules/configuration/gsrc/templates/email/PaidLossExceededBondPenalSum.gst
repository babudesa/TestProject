<% uses java.lang.Double %>
<%@ params(transactionSet : TransactionSet) %>

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
		var limit:Double = 0.0
		var transType = ""
		var transAmount:Double = 0.0	
		
		
		
		if(transactionSet.Claim.AssignedUser != null){
		  recipient = "DL-ClaimCenter.Avalon"	
		}
		
		if(User.util.getCurrentUser() != null){
		  sender = User.util.getCurrentUser().toString();		  
		}
		
				
		if(transactionSet.Subtype =="CheckSet"){	
		   
		  transType = "check";
  		  var trans = (transactionSet as CheckSet);
  
  		  if(trans.PrimaryCheck != null){
  		    for(payment in trans.PrimaryCheck.Payments){
  		      if(payment.Amount > payment.Exposure.Coverage.AggregateLimitExt){
  			transAmount = gw.api.util.StringUtil.formatNumber(payment.Amount as java.lang.Double, "$#,###.00")
  			limit = gw.api.util.StringUtil.formatNumber(payment.Exposure.Coverage.AggregateLimitExt as java.lang.Double, "$#,###.00")
  		      }
  		    }
  			
  		  }
  		 /* if(trans.PrimaryCheck.CheckNumber != null){
  			checkNumber = trans.PrimaryCheck.CheckNumber
  			
  		  }
  		  if(trans.PrimaryCheck.PayTo != null){
  			payeeName = trans.PrimaryCheck.PayTo
  		
  		  }*/
		}
		 
		%>
		
		<table>	
			<tr>
				<td class=header>Paid Loss Exceeded Bond Penal Sum</td>
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
				<td class=value><p>Total Paid Loss <%= transAmount  %> exceeded the Bond Penal Sum of <%= limit  %> on claim <%= transactionSet.Claim.ClaimNumber  %>.</p></td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>		 
					<table>
						<tr>
							<td class=label>Claim Number:</td>
							<td class=value><%= transactionSet.Claim.ClaimNumber %></td>
						</tr>
						<tr>
							<td class=label>Principal:</td>
							<td class=value><%= transactionSet.Claim.Insured %></td>
						</tr>
						<tr>
							<td class=label>Bond Number:</td>
							<td class=value><%= transactionSet.Claim.Policy.PolicyNumber %></td>
						</tr>
						<tr>
							<td class=label>Bond Mod:</td>
							<td class=value><%= transactionSet.Claim.Policy.PolicySuffix %></td>
						</tr>
						<tr>
							<td class=label>Bond Effective Date:</td>
							<td class=value><%= transactionSet.Claim.Policy.EffectiveDate %></td>
						</tr>
						<tr>
							<td class=label>Date of Loss:</td>
							<td class=value><%= transactionSet.Claim.LossDate %></td>
						</tr>
						<tr>
							<td class=label>Adjuster:</td>
							<td class=value><%= transactionSet.Claim.AssigneeDisplayString %></td>
						</tr>
					</table> 
				</td>
			</tr>
		</table>	
	</body>
</html>