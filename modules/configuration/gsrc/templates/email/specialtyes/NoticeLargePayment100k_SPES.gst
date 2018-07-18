<% uses java.lang.Double %>
<%@ params(transSet : TransactionSet) %>
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
	  var trans = (transSet as CheckSet);
	  var checkAmount = trans.PrimaryCheck.GrossAmountExt
	  var checkFormat = gw.api.util.StringUtil.formatNumber( checkAmount, "$#,##0.00" )
	  var costType : String = ""
	  var hasExpense : boolean = false
	  var hasLoss : boolean = false
	  // once the DL list script parameter is finalized, change var recipient to match...
	  // var recipient = util.GlobalParameters.ParameterFinder.getUserParameter("ccproperty", transSet.Claim.LossType)
	  
	  // Defect# 8360, The "E&SSupport" email was removed by sakula
	  var recipient = "E&SClaims; E&SManagement; DL-ClaimCenter.Accounting.100K; DL-AFG.Reins.Claims"
	  var agency = ""				  
	  var agentCity = ""
	  var agentState = ""
	 	
		 if(transSet.Claim.Policy.ex_Agency != null){
		      agency = transSet.Claim.Policy.ex_Agency.DisplayName;
		      agentCity = transSet.Claim.Policy.ex_Agency.PrimaryAddress.City
		      agentState = transSet.Claim.Policy.ex_Agency.PrimaryAddress.State.Code
		    }else{
		      agency = "&#60No Agent Indicated&#62"
		    }
	  
	  
	  for( key in trans.Checks.Payments ) {
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
	%>
	
          <table>
                <tr>
		    <td>
		        <table>
		            <tr>
				<td class=label>From:</td>
				<td class=value><%= transSet.Claim.AssigneeDisplayString %></td>
			    </tr>
		            <tr>
				<td class=label>To:</td>
				<td class=value><%= recipient %></td>
			    </tr>
			    <tr>
		                <td><br></td>
	                    </tr>
	                    <tr>
		                <td><br></td>
	                    </tr>
	                    <tr>
				<td class=label>Subject:</td>
				<td class=value>Large Payment Notification</td>
			    </tr>
			</table>
		    </td>
		</tr>
		<tr>
		    <td><br></td>
	        </tr>
		<tr>
		    <td class=header>Notice of Large Payment</td>
	        </tr>
	        <tr>
		    <td><br></td>
	        </tr>
		<tr>
		    <td><br></td>
		</tr>
		<tr>
		    <td class=value><p>This notification is to advise you a payment between $100,000 and $500,000 has been issued for the 
		    following:</p>
		    </td>
		</tr>
		<tr>
		    <td><br></td>
		</tr>
		<tr>
		    <td>
			<table>
		             <tr>
				<td class=label>Insured Name:</td>
				<td class=value><%= transSet.Claim.Policy.insured %></td>
			    </tr>
		            <tr>
			        <td class=label>Claim Number:</td>
				<td class=value><%= transSet.Claim.ClaimNumber %></td>
			    </tr>
			    <tr>
				<td class=label>Check/EFT Number:</td>
				<td class=value><%= trans.PrimaryCheck.CheckNumber %></td>
			    </tr>
			    <tr>
				<td class=label>Payee:</td>
				<td class=value><%= trans.PrimaryCheck.PayTo %></td>
			    </tr>
			    <tr>
			  	<td class=label>Amount:</td>
				<td class=value><%= checkFormat %></td>
			    </tr>
			    <tr>
				<td class=label>Loss or Expense:</td>
				<td class=value><%= costType %></td>
			    </tr>
			    <tr>
				<td class=label>Producer Name:</td>
				<td class=value><%= agency %></td>
			    </tr>
			    <tr>
				<td class=label>Producer City, State:</td>
				<td class=value><%= agentCity %>, <%= agentState %></td>
			    </tr>
			    <tr>
			  	<td class=label>Business Unit: </td>
				<td class=value><%= trans.Claim.LossType.DisplayName %></td>
			    </tr>
			</table>
		    </td>
		</tr>
		<tr>
		    <td><br></td>
		</tr>
		<tr>
		    <td class=value><p>Please contact the adjuster, <%= transSet.Claim.AssigneeDisplayString %>, if you have further questions.</p></td>
		</tr>
		<tr>
		    <td><br></td>
		</tr>	
	</table>
    </body>
</html>