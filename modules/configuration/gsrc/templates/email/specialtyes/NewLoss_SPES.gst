<%@ params(c : Claim) %>
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
		var underwriter = ""
		var recipient = "E&SSupport"
		var sender = ""
		var agency = ""
		var agentCity = ""
		var agentState = ""
		var lossDescription = ""
		
		if(c.Policy.underwriter != null){
		  underwriter = c.Policy.underwriter.DisplayName;
		}else{
		  underwriter = "&#60No Underwriter Indicated&#62";
		}
		if(User.util.getCurrentUser() != null){
		  sender = User.util.getCurrentUser().DisplayName;
		}
		if(c.Policy.ex_Agency != null){
		  agency = c.Policy.ex_Agency.DisplayName;
		  agentCity = c.Policy.ex_Agency.PrimaryAddress.City
		  agentState = c.Policy.ex_Agency.PrimaryAddress.State.Code
		}else{
		  agency = "&#60No Agent Indicated&#62"
		}
		if (c.Claim.Description != null){
		  lossDescription = c.Claim.Description;
		}else{
		  lossDescription ="&#60No Loss Description Entered&#62"
		}
	    	%>

	    	%>
		
		<table>
                <tr>
		    <td>
		        <table>
		            <tr>
				<td class=label>From:</td>
				<td class=value><%= c.AssigneeDisplayString %></td>
			    </tr>
		            <tr>
				<td class=label>To:</td>
				<td class=value><%= recipient %></td>
			    </tr>
			    <tr>
				<td class=label>Subject:</td>
				<td class=value>New Claim <%= c.ClaimNumber %></td>
			    </tr>
			</table>
		    </td>
		</tr>
		<tr>
		    <td><br></td>
	        </tr>
		<tr>
		    <td class=header>Notice of New Claim</td>
	        </tr>
	        <tr>
		    <td><br></td>
	        </tr>
		<tr>
					<td class=value><p>The following claim has been opened:</p></td>
				</tr>
				<tr>
					<td><br></td>
				</tr>
			
			<tr>
				<td>		 
					<table>
						<tr>
							<td class=label>Underwriter:</td>
							<td class=value><%= underwriter %></td>
						</tr>
						<tr>
							<td class=label>Claim Number:</td>
							<td class=value><%= c.ClaimNumber %></td>
						</tr>
						<tr>
							<td class=label>Incident Only:</td>
							<td class=value><%= c.IncidentReport?"Yes":"No" %></td>
						</tr>
						<tr>
							<td class=label>Cause of Loss:</td>
							<td class=value><%= c.LossCause==null ? "":c.LossCause.DisplayName%><%= c.ex_DetailLossCause==null ? "": ", " + c.ex_DetailLossCause.DisplayName %></td>
						</tr>
						<tr>
							<td class=label>Date of Loss:</td>
							<td class=value><%= gw.api.util.StringUtil.formatDate( c.LossDate, "MM-dd-yyyy" ) %></td>
						</tr>
						<tr>
							<td class=label>Adjuster Name:</td>
							<td class=value><%= c.AssigneeDisplayString %></td>
						</tr>
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
							<td class=label>Policy Effective Date:</td>
							<td class=value><%= gw.api.util.StringUtil.formatDate( c.Policy.EffectiveDate, "MM-dd-yyyy" ) %></td>
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
							<td class=label>Loss Description:</td>
							<td class=value><%= lossDescription %></td>
						</tr>

					</table> 
				</td>
			</tr>
		</table>	
	</body>
</html>