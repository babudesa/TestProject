<%@ params(TransactionSet : TransactionSet, action : String) %>
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
		var reciepent = ""
		var to = ScriptParameters.Divisional_Accounting_Name
		var user : String = "" 
		var busUnit : String = ""	
		var check : Check = (TransactionSet as CheckSet).PrimaryCheck
		var cn = check.CheckNumber
		var type : String = action
		var EFT_Canadian : String = ""
		var phone : String = gw.plugin.util.CurrentUserUtil.getCurrentUser().User.Contact.WorkPhone
		  
		if( TransactionSet.RequestingUser != null ) {
		  user = gw.plugin.util.CurrentUserUtil.getCurrentUser().User.DisplayName
		  busUnit = TransactionSet.RequestingUser.getUserBusinessUnitAndGroup()
		}
		
		if( check.PrefixExt == "991" )
			EFT_Canadian = "EFT or Canadian "
		
		if(check.Claim.Policy.underwriter != null){
		  reciepent = check.Claim.Policy.underwriter.DisplayName;
		}
		
		if (check.ManualCheck && check.ex_ManualPaymentMethod == "manual") {
  			cn = check.ex_DraftRegion + "-" + cn
		} 
		else if ( check.ManualCheck && check.ex_ManualPaymentMethod == "eft") {
			cn = check.PrefixExt + "-" + cn
		}
		
		if( type == "Stop" ) {
			type = type + " Payment"
		}
		
		if( type == "Void" ) {
			type = type + " Check"
		}	
	%>
	
	<table>
			<tr>
				<td class=header><%=EFT_Canadian%> <%=type%> Request</td>
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
				<td class=value><p>Please place a <%=((type.toLowerCase() == "void check") ? "void" : type.toLowerCase()) %> on the following <%=EFT_Canadian%> check:</p></td>
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
							<td class=label>Payee Name:</td>
							<td class=value><%=check.PayTo%></td>
						</tr>
						<tr>
							<td class=label>Amount:</td>
							<td class=value>$<%=gw.api.util.StringUtil.formatNumber(check.GrossAmountExt, "#,##0.00" )%></td>
						</tr>
						<tr>
							<td class=label>Date Issued:</td>
							<td class=value><%=gw.api.util.StringUtil.formatDate(check.IssueDate, "MM-dd-yyyy" )%></td>
						</tr>
						<tr>
							<td class=label>Reason:</td>
							<td class=value><%=check.ex_CheckVoidStopReasonType.Description %></td>
						</tr>
						<tr>
							<td><br></td>
						</tr>
						<tr>
							<td class=label>Requested by:</td>
							<td class=value><%= user %></td>
						</tr>
						<tr>
							<td class=label>Business Unit/Group:</td>
							<td class=value> <%= busUnit.toString() %></td>
						</tr>
						<tr>
							<td class=label>Phone:</td>
							<td class=value> <%= ((phone == null) ? "" : phone) %></td>
						</tr>
					</table> 
				</td>
			</tr>
		</table>
	</body>
</html>