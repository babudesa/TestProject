<% uses java.lang.Double %>
<%@ params(exp : Exposure) %>
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
	  var incurredAmount = gw.api.financials.FinancialsCalculationUtil.getTotalIncurredGross().getAmount(exp.Claim)
	  var incurredFormat = gw.api.util.StringUtil.formatNumber( incurredAmount, "$#,##0.00" )
	  // once the DL list script parameter is finalized, change var recipient to match. This is the old var...
	  // var recipient = util.GlobalParameters.ParameterFinder.getUserParameter("ccproperty", exp.Claim.LossType)
	  var recipient = "ClaimSupport@gaig.com"
	  var agency = ""
	  var agentCity = ""
	  var agentState = ""
	  	  
	  if(exp.Claim.Policy.ex_Agency != null){
	      agency = exp.Claim.Policy.ex_Agency.DisplayName;
	      agentCity = exp.Claim.Policy.ex_Agency.PrimaryAddress.City
	      agentState = exp.Claim.Policy.ex_Agency.PrimaryAddress.State.Code
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
				<td class=value><%= exp.Claim.AssigneeDisplayString %></td>
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
				<td class=value>Early Notice of Potential Catastrophic Loss</td>
			    </tr>
			</table>
		    </td>
		</tr>
		<tr>
		    <td><br></td>
	        </tr>
		<tr>
		    <td class=header>Early Notice of Potential Catastrophic Loss</td>
	        </tr>
	        <tr>
		    <td><br></td>
	        </tr>
		<tr>
		    <td><br></td>
		</tr>
		<tr>
		    <td class=value><p>This notification is to advise you this claim has been flagged as a potential 
		    catastrophic loss:</p>
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
				<td class=value><%= exp.Claim.Policy.PolicyNumber %></td>
			    </tr>
		            <tr>
				<td class=label>Insured Name:</td>
				<td class=value><%= exp.Claim.Policy.insured %></td>
			    </tr>
			    <tr>
			        <td class=label>Claim Number:</td>
				<td class=value><%= exp.Claim.ClaimNumber %></td>
			    </tr>
			    <tr>
			  	<td class=label>Reserve Amount:</td>
				<td class=value><%= incurredAmount==null ? "" : incurredFormat %></td>
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
				<td class=value><%= exp.Claim.LossType.DisplayName %></td>
			    </tr>
			</table>
		    </td>
		</tr>
		<tr>
		    <td><br></td>
		</tr>
		<tr>
		    <td class=value><p>Please contact the adjuster, <%= exp.Claim.AssigneeDisplayString %>, if you have further questions.</p></td>
		</tr>
		<tr>
		    <td><br></td>
		</tr>	
	</table>
    </body>
</html>