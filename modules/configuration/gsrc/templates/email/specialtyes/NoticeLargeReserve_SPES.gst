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
	  var incurredAmount = gw.api.financials.FinancialsCalculationUtil.getTotalIncurredGross().getAmount(transSet.Claim)
	  var incurredFormat = gw.api.util.StringUtil.formatNumber( incurredAmount, "$#,##0.00" )
	  // once the DL list script parameter is finalized, change var recipient to match...
	  //var recipient = util.GlobalParameters.ParameterFinder.getUserParameter("ccproperty", transSet.Claim.LossType)
	  var recipient = "E&SClaims; E&SManagement; E&SSupport"
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
				<td class=value>Notice of Large Reserve</td>
			    </tr>
			</table>
		    </td>
		</tr>
		<tr>
		    <td><br></td>
	        </tr>
		<tr>
		    <td class=header>Notice of Large Reserve</td>
	        </tr>
	        <tr>
		    <td><br></td>
	        </tr>
		<tr>
		    <td><br></td>
		</tr>
		<tr>
		    <td class=value><p>This notification is to advise you a reserve of $100,000 or higher has been reached on this claim:</p>
		    </td>
		</tr>
		<tr>
		    <td><br></td>
		</tr>
		<tr>
		    <td>
			<table>
		            <tr>
				<td class=label>Policy Number:</td>
				<td class=value><%= transSet.Claim.Policy.PolicyNumber %></td>
			    </tr>
			    <tr>
				<td class=label>Insured Name:</td>
				<td class=value><%= transSet.Claim.Policy.insured %></td>
			    </tr>
			    <tr>
			        <td class=label>Claim Number:</td>
				<td class=value><%= transSet.Claim.ClaimNumber %></td>
			    </tr>
			    <tr>
			        <td class=label>Date of Loss:</td>
				<td class=value><%= gw.api.util.StringUtil.formatDate( transSet.Claim.LossDate, "MM-dd-yyyy") %></td>
			    </tr>
			    <tr>
			  	<td class=label>Total Incurred:</td>
				<td class=value><%= incurredFormat %></td>
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
				<td class=value><%= transSet.Claim.LossType.DisplayName %></td>
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