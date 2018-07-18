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
		var checkNumber = ""
		var payeeName = ""
		var transType = ""
		var transFormat = ""
		var transAmount:Double = 0				
		
                if(transactionSet.Subtype =="CheckSet"){	
		   
		  transType = "check";
  		  var trans = (transactionSet as CheckSet);
  
  		  if(trans.PrimaryCheck != null){
  			transAmount = (trans.PrimaryCheck.NetAmount.Amount as Double)
  		  }
  		  if(trans.PrimaryCheck.CheckNumber != null){
  			checkNumber = trans.PrimaryCheck.CheckNumber  			
  		  }
  		  if(trans.PrimaryCheck.PayTo != null){
  			payeeName = trans.PrimaryCheck.PayTo  		
  		  }
		}
		if(transactionSet.Subtype =="ReserveSet"){
		  
		  transType = "reserve";
		  for(trans in transactionSet.AllTransactions){
                    if(trans.Amount != null){
                      transAmount = transAmount + (trans.Amount as Double)
                    }
                  }
		}
                if(transAmount >= 0){
		  transFormat = gw.api.util.StringUtil.formatNumber( transAmount, "$#,##0.00" );
		}else{
		  transFormat = gw.api.util.StringUtil.formatNumber( (-transAmount), "($-#,##0.00)" );
		}
		
		%>

		<table>
			<tr>
				<td class=label>To:</td>
				<td class=value><%= ScriptParameters.CorporateClaimsSecurity_Name %>; Karen Birdseye</td>
			</tr>
			<tr>
				<td class=label>From:</td>
				<td class=value><%= transactionSet.LastApprovingUser.DisplayName %></td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
		</table>
		<table>
			<tr>
				<td class=header>This item could not be submitted because it exceeds the authority of all potential approvers in ClaimCenter.</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>
					<table>
						<tr>
							<td class=label>Claim Number:</td>
							<td class=value><%=transactionSet.Claim.ClaimNumber %></td>
						</tr>
						<tr>
							<td class=label>Check Number:</td>
							<td class=value><%=checkNumber %></td>
						</tr>
						<tr>
							<td class=label>Transaction Amount:</td>
							<td class=value><%=transFormat%></td>
						</tr>
						<tr>
							<td class=label>Payee Name:</td>
							<td class=value><%= payeeName %></td>
						</tr>
						<tr>
							<td class=label>Insured Name:</td>
							<td class=value><%=transactionSet.Claim.Policy.insured%></td>
						</tr>
						<tr>
							<td class=label>Adjuster: </td>
							<td class=value><%=transactionSet.Claim.AssigneeDisplayString%></td>
						</tr>
						<tr>
							<td class=label>Claim Manager: </td>
							<td class=value><%=util.GlobalParameters.ParameterFinder.getUserParameter( "unitmanager", transactionSet.Claim.LossType )%></td>
						</tr>
					</table>
				</td>
			</tr>	
		</table>
	</body>
</html>