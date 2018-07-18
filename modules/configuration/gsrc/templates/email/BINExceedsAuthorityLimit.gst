<% uses org.omg.PortableInterceptor.INACTIVE %>
<%@ params(invoice : BulkInvoice) %>
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
		var transFormat = ""
		var transAmount = invoice.BulkInvoiceTotal				
		
                if(transAmount >= 0){
		  transFormat = gw.api.util.StringUtil.formatNumber( transAmount, "$#,##0.00" );
		}else{
		  transFormat = gw.api.util.StringUtil.formatNumber( (-transAmount), "($-#,##0.00)" );
		}
		
		%>

		<table>
			<tr>
				<td class=label>To:</td>
				<td class=value><%= ScriptParameters.CorporateClaimsSecurity_Name %>; Karen Birdseye</td>
			</tr>
			<tr>
				<td class=label>From:</td>
				<td class=value><%= invoice.LastApprovingUser.DisplayName %></td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
		</table>
		<table>
			<tr>
				<td class=header>This Bulk Invoice could not be submitted because it exceeds the authority of all potential approvers in ClaimCenter.</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>
					<table>
						<tr>
							<td class=label>BIN Number:</td>
							<td class=value><%=invoice.BulkInvoiceIDExt %></td>
						</tr>
						<tr>
							<td class=label>Check Number:</td>
							<td class=value><%=invoice.CheckNumber %></td>
						</tr>
						<tr>
							<td class=label>Gross Amount:</td>
							<td class=value><%=transFormat%></td>
						</tr>
						<tr>
							<td class=label>Payee Name:</td>
							<td class=value><%= invoice.PayTo%></td>
						</tr>
					        <tr>
							<td class=label>Submitted By:</td>
							<td class=value><%= invoice.CreateUser.DisplayName%></td>
						</tr>
						<tr>
					</table>
				</td>
			</tr>	
		</table>
	</body>
</html>