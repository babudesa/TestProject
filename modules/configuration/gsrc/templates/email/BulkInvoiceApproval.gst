<%@ params(BulkInvoice : BulkInvoice) %>
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
		var recipient = util.custom_Ext.finders.getUserOb( "alatto" );
		var sender = User.util.getCurrentUser();
		var transAmount = BulkInvoice.BulkInvoiceTotal;
		var checkNumber = BulkInvoice.CheckNumber;
		var payeeName = BulkInvoice.PayTo;
		var transFormat = "";
		var multipleInsureds = "Multiple Insureds";
		var claim = BulkInvoice.InvoiceItems[0].Claim;
		var claimNumber = claim.ClaimNumber;
		var bulkInvoiceIDExt = BulkInvoice.BulkInvoiceIDExt;
		var createUser = BulkInvoice.CreateUser;
		transFormat = gw.api.util.StringUtil.formatNumber( transAmount, "$#,##0.00" );
		%>
		
		<table>	
			<tr>
				<td class=header>Bulk Invoice Approval Activity Notification</td>
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
				<td class=value><p>The following bulk invoice check requires your review and approval.</p></td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>		 
					<table>
						<tr>
							<td class=label>BIN Number:</td>
							<td class=value><%= bulkInvoiceIDExt %></td>
						</tr>
						<tr>
							<td class=label>Claim Number:</td>
							<td class=value><%= claimNumber %></td>
						</tr>
						<tr>
							<td class=label>Check Number:</td>
							<td class=value><%= checkNumber %></td>
						</tr>
						<tr>
							<td class=label>Transaction Amount:</td>
							<td class=value><%= transFormat %></td>
						</tr>
						<tr>
							<td class=label>Payee Name:</td>
							<td class=value><%= payeeName %></td>
						</tr>
						<tr>
							<td class=label>Insured Name:</td>
							<td class=value><%= multipleInsureds %></td>
						</tr>
						<tr>
							<td class=label>Created By:</td>
							<td class=value><%= createUser %></td>
						</tr>
					</table> 
				</td>
			</tr>
		</table>	
	</body>
</html>