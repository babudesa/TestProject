<%@ params(exp : Exposure) %>
<html>
	<head>
		<style type="text/css">
		td.header {font-family:verdana;font-size:12;font-weight:bold}
		td.label {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
		td.value {font-family:verdana;font-size:10;text-align:left}
		td.boldvalue {font-family:verdana;font-size:10;text-align:left;font-weight:bold}
		</style>
	</head>
	<body> 
	
		<%
		var sender = ""
		var recipient = ""
		var agency = ""
		
		if(exp.Claim.Policy.underwriter != null){
		  recipient = exp.Claim.Policy.underwriter.DisplayName;
		}else{
		  recipient = "&#60No Underwriter Indicated&#62";
		}
		if(User.util.getCurrentUser() != null){
		  sender = User.util.getCurrentUser().DisplayName;
		}
		if(exp.Claim.Policy.ex_Agency != null){
		  agency = exp.Claim.Policy.ex_Agency.DisplayName;
		}
		%>
		
		<table>
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
				<td class=value><p>An unlisted driver has been added to the following Claim Number:</p></td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>		 
					<table>
						<tr>
							<td class=label>Unlisted Driver Name:</td>
							<td class=boldvalue><%= exp.DriverExt %></td>
						</tr>
						<tr>
							<td class=label>Claim Number:</td>
							<td class=value><%= exp.Claim.ClaimNumber %></td>
						</tr>
						<!--added driver type to email per defect 2644-->
						<tr>
							<td class=label>Driver Type:</td>
							<td class=value><%= exp.DriverTypeExt.Description %></td>
						</tr>
						<tr>
							<td class=label>Named Insured:</td>
							<td class=value><%= exp.Claim.Insured %></td>
						</tr>
						<tr>
							<td class=label>Feature Type:</td>
							<td class=value><%= exp.ExposureType.Description %></td>
						</tr>
						<tr>
							<td class=label>Policy Number:</td>
							<td class=value><%= exp.Claim.Policy.PolicyNumber %></td>
						</tr>
						<tr>
							<td class=label>Policy Mod:</td>
							<td class=value><%= exp.Claim.Policy.PolicySuffix %></td>
						</tr>
						<tr>
							<td class=label>Policy Effective Date:</td>
							<td class=value><%= gw.api.util.StringUtil.formatDate( exp.Claim.Policy.EffectiveDate, "MM-dd-yyyy" ) %></td>
						</tr>
						<tr>
							<td class=label>Producer Name:</td>
							<td class=value><%= agency %></td>
						</tr>
						<tr>
							<td class=label>Cause of Loss:</td>
							<td class=value><%= exp.Claim.LossCause==null ? "":exp.Claim.LossCause.DisplayName %><%= exp.Claim.ex_DetailLossCause==null ? "": ", " + exp.Claim.ex_DetailLossCause.DisplayName %></td>
						</tr>
						<tr>
							<td class=label>Date of Loss:</td>
							<td class=value><%= gw.api.util.StringUtil.formatDate( exp.Claim.LossDate, "MM-dd-yyyy" ) %></td>
						</tr>
						<tr>
							<td class=label>Adjuster:</td>
							<td class=value><%= exp.Claim.AssigneeDisplayString %></td>
						</tr>
					</table> 
				</td>
			</tr>
		</table>	
	</body>
</html>