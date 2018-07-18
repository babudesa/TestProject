<%@ params(check : Check) %>
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
		var counter : int = 0
		var costType : String = ""
		var hasExpense : boolean = false
		var hasLoss : boolean = false
		var user : String = "" 
		var busUnit : String = ""		
		
		var checkNumber = check.CheckSet.PrimaryCheck.CheckNumber
		var Payee = check.CheckSet.PrimaryCheck.PayTo
		var amount = check.CheckSet.PrimaryCheck.GrossAmountExt
		var Payments = check.CheckSet.PrimaryCheck.Payments
		var Exposures = check.CheckSet.Exposures
		var FeatureAdjuster : String = ""
		var To = ScriptParameters.PropertyLgLoss
		var DivAccounting = ScriptParameters.Divisional_Accounting_Name
		
		if(check.Claim.LossType == "EQUINE" or check.Claim.LossType == "AGRIPROPERTY" or
		    check.Claim.LossType == "FIDCRIME" or check.Claim.LossType == "PIMINMARINE" or
		    check.Claim.LossType == "KIDNAPRANSOM") {
			To = ScriptParameters.PropertyLgLoss
		}
		else if(check.Claim.LossType == "AGRIAUTO" or check.Claim.LossType == "AGRILIABILITY"
		     or check.Claim.LossType == "EXECLIABDIV"  
		     or check.Claim.LossType == "EXCESSLIABILITY" 
		     or check.Claim.LossType == "EXCESSLIABILITYAUTO"
		     or check.Claim.LossType == "PROFLIABDIV"
		     or check.Claim.LossType == LossType.TC_SPECIALHUMSERV) {
			To = ScriptParameters.LiabilityLgLoss
		}
		else if (util.WCHelper.isWCorELLossType(check.Claim)){
		        To = ScriptParameters.WCLgLoss
		}
		var isManualCheck = check.CheckSet.PrimaryCheck.ManualCheck
  		var manualPaymentMethod = check.CheckSet.PrimaryCheck.ex_ManualPaymentMethod
		
		if (isManualCheck && manualPaymentMethod == "manual") {
  			checkNumber = check.CheckSet.PrimaryCheck.ex_DraftRegion + "-" + checkNumber
		} 
		else if ( isManualCheck && manualPaymentMethod == "eft") {
			checkNumber = check.CheckSet.PrimaryCheck.PrefixExt + "-" + checkNumber
		}	
		
		for( key in Payments ) {
		        if (key.CostType.Code.toLowerCase()=="expense") {
				hasExpense = true
			}
			if (key.CostType.Code.toLowerCase()=="claimcost") {
				hasLoss = true
			}
  		}
  		if( hasExpense==true && hasLoss==false ) {
   		  costType = "Expense"
   		} else if ( hasLoss==true && hasExpense==false ) {
     		  costType = "Loss"
   		} else {
   		  costType = "Loss and Expense" 
   		}
   			
   		for( key in Exposures ) {
   			if( counter < 1 ) {
   				FeatureAdjuster = key.AssignedUser.DisplayName
   				counter = counter + 1
   			}
   			else
   			{
   				FeatureAdjuster = check.Claim.AssignedUser.DisplayName
   			}
   		}
   		if( check.CheckSet.RequestingUser != null ) {
   			user = check.CheckSet.RequestingUser.DisplayName
   			busUnit=check.CheckSet.RequestingUser.getUserBusinessUnit()
   		}
   		
	%>
	
		<table>
			<tr>
				<td class=header>Notice of Large Payment</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
		</table>
			
		<table>
			<tr>
				<td class=label>To:</td>
				<td class=value><%= To %>; <%= DivAccounting %></td>
			</tr>
			<tr>
				<td class=label>From:</td>
				<td class=value><%= user %></td>
			</tr>
		</table>
					
		<p class=value>This notification is to advise you a payment of $500,000 or greater has been issued<br>
		for the following:</p>
				
		<table>
			<tr>
				<td class=label>Claim Number:</td>
				<td class=value><%= check.Claim.ClaimNumber %></td>
			</tr>
			<tr>
				<td class=label>Insured Name:</td>
				<td class=value><%= check.Claim.Insured %></td>
			</tr>
			<tr>
				<td class=label>Check/EFT Number:</td>
				<td class=value><%= checkNumber %></td>
			</tr>
			<tr>
				<td class=label>Payee:</td>
				<td class=value><%=  Payee  %></td>
			</tr>
			<tr>
				<td class=label>Amount:</td>
				<td class=value>$<%=util.StringUtils.getStringValue(gw.api.util.StringUtil.formatNumber(amount, "#,##0.00" ))%></td>
			</tr>
			<tr>
				<td class=label>Loss or Expense:</td>
				<td class=value><%= costType %></td>
			</tr>
			<tr>
				<td class=label>Business Unit:</td>
				<td class=value><%= busUnit %></td>
			</tr>
			
		</table> 
		<p class=value>Please contact the adjuster, <%= FeatureAdjuster %>, if you have any further questions.</p>
	</body>
</html>