<%@ params(TransactionSet : TransactionSet, BusinessUnitAndGroup : String) %>
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
		var user : String = "" 
		var busUnit : String = ""	
		var to = ScriptParameters.Divisional_Accounting_Name + "; " + ScriptParameters.Divisional_Account_Contact + "; " + "Birdseye, Karen"
		var check : Check = (TransactionSet as CheckSet).PrimaryCheck
		var cn = check.CheckNumber
		var type = (TransactionSet as CheckSet).PrimaryCheck.Status
		var typeString : String = ""
		
		user = gw.plugin.util.CurrentUserUtil.getCurrentUser().User.DisplayName
		
		busUnit = BusinessUnitAndGroup
		
		if( type == "pendingstop" ) {
			typeString = "Stop" 
		}
		
		if( type == "pendingvoid" ) {
			typeString = "Void" 
		}	
		
		if( TransactionSet.RequestingUser != null ) {
			busUnit=TransactionSet.RequestingUser.getUserBusinessUnitAndGroup()
			
		}
	%>
		<table>
			
			<tr>
				<td class=header>Claim Center <%= typeString %> Pay Notification</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>
					<table>
						<tr>
							<td class=label>To:</td>
							<td class=value><%= to %></td>
						</tr>
						<tr>
							<td class=label>From:</td>
							<td class=value><%= user %></td>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td class=value><p><strong>Please Update the Check writer History DB2 table to reflect that the Pending <%= typeString %> was accepted by the bank.</strong></p></td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>		 
					<table>
							<tr>
								<td class=label>Check Number:</td>
								<td class=value><%=cn%></td>
							</tr>
							<tr>
								<td class=label>Claim Number:</td>
								<td class=value><%= check.Claim.ClaimNumber %></td>
							</tr>
							<tr>
								<td class=label>Policy Number:</td>
								<td class=value><%= check.Claim.Policy.PolicyNumber %></td>
							</tr>
							<tr>
								<td class=label>Payee Name:</td>
								<td class=value><%=check.PayTo%></td>
							</tr>
							<tr>
								<td class=label>Amount:</td>
								<td class=value>$<%=gw.api.util.StringUtil.formatNumber(check.GrossAmountExt, "#,##0.00" )%></td>
							</tr>
							<tr>
								<td class=label>Requested by:</td>
								<td class=value><%= user %></td>
							</tr>
							<tr>
								<td class=label>Business Unit/Group:</td>
								<td class=value> <%= busUnit %></td>
							</tr>
					</table> 
				</td>
			</tr>
		</table>
	</body>
</html>