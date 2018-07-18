<% uses java.lang.Double %>
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
		var recipient = ""
		var sender = ""
		var agency = ""
				
		if(c.AssignedUser != null){
		  recipient = c.AssignedUser.DisplayName;
		  }
		    else{recipient = "&#60No Attorney Indicated&#62"
		}
		if(User.util.getCurrentUser() != null){
		  sender = User.util.getCurrentUser().DisplayName;
		  }
		    else{sender = "No User Indicated"
		}
		if(c.Policy.ex_Agency != null){
		  agency = c.Policy.ex_Agency.DisplayName;
		  }
		    else{agency = "No Agency Indicated"
		}
		
	%>			
		<table>	
			<tr>
				<td class=header>Approve Settlement</td>
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
			<table>
			<tr>
				<td class=value><p>Your settlement request has been reviewed for claim:</p></td>
			</tr>	
			</table>
			<br>
			
					<table>
						<tr>
							<td class=label>Claim Number:</td>
							<td class=value><%= c.ClaimNumber %></td>
						</tr>
						<tr>
							<td class=label>Named Insured:</td>
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
						</tr>
						<tr>
							<td class=label>Date of Loss:</td>
							<td class=value><%= gw.api.util.StringUtil.formatDate( c.LossDate, "MM-dd-yyyy" ) %></td>
						</tr>
						<tr>
							<td class=label>Adjuster:</td>
							<td class=value><%= c.AssigneeDisplayString %></td>
						</tr>
					</table> 		
	</body>
</html>