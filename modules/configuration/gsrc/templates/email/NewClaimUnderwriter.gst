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
		var incidentOnly:boolean = c.IncidentReport;
		var recipient = "" 
		var sender = ""  
		var agency = ""  
		
		if(c.Policy.underwriter != null){
		  recipient = c.Policy.underwriter.DisplayName;
		}else{
		  recipient = "&#60No Underwriter Indicated&#62";
		}
		if(User.util.getCurrentUser() != null){
		  sender = User.util.getCurrentUser().DisplayName;
		}
		if(c.Policy.ex_Agency != null){
		  agency = c.Policy.ex_Agency.DisplayName;
		}
		%>
		
		<table>

				<tr>
					<td class=header>Notice of New Claim</td>
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
					<td class=value><p>New Claim <%= c.ClaimNumber %> under Policy <%= c.Policy.PolicyNumber %> for Insured <%= c.Insured %> has been assigned.</p></td>
				</tr>
			
				<td><br></td>
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
							<td class=label>Incident Only:</td>
							<td class=value><%= c.IncidentReport?"Yes":"No" %></td>
						</tr>
						<tr>
							<td class=label>Cause of Loss:</td>
							<td class=value><%= c.LossCause==null ? "":c.LossCause.DisplayName %><%= c.ex_DetailLossCause==null ? "": ", " + c.ex_DetailLossCause.DisplayName %></td>
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
				</td>
			</tr>
		</table>	
	</body>
</html>